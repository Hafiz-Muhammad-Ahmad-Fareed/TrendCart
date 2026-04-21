import Stripe from "stripe";
import orderRepository from "../repositories/order.repository.js";
import userRepository from "../repositories/user.repository.js";
import productRepository from "../repositories/product.repository.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  const user = await userRepository.findByClerkId(req.user.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const { cartItems } = req.body;
  if (!cartItems || cartItems.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  // Fetch product details for the items in the cart
  const enrichedItems = await Promise.all(
    cartItems.map(async (item) => {
      const product = await productRepository.findById(item.productId);
      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }
      return {
        product,
        quantity: item.quantity,
      };
    }),
  );

  const lineItems = enrichedItems.map((item, index) => {
    const amount = Math.round(item.product.price * 100); // Stripe expects amounts in cents
    const selectedSize = cartItems[index]?.selectedSize;
    const selectedColor = cartItems[index]?.selectedColor;
    const selectedImage = cartItems[index]?.selectedImage;
    const variantParts = [];
    if (selectedSize) {
      variantParts.push(`Size: ${selectedSize}`);
    }
    if (selectedColor) {
      variantParts.push(`Color: ${selectedColor}`);
    }
    const variantText = variantParts.join(" • ");
    const primaryImage =
      selectedImage || item.product.images?.[0] || item.product.image || null;
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.product.name,
          description: variantText || undefined,
          images: primaryImage ? [primaryImage] : [],
          metadata: {
            id: item.product._id.toString(),
            selectedSize: selectedSize || "",
            selectedColor: selectedColor || "",
            selectedImage: selectedImage || "",
          },
        },
        unit_amount: amount,
      },
      quantity: item.quantity,
    };
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `${process.env.CLIENT_URL}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/cart`,
    customer_email: user.email,
    shipping_address_collection: {
      allowed_countries: ["US", "CA", "GB"], // Adjust as needed
    },
    metadata: {
      userId: user._id.toString(),
    },
  });

  res.status(200).json({ id: session.id, url: session.url });
};

export const handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "checkout.session.completed":
      {
        const session = await stripe.checkout.sessions.retrieve(
          event.data.object.id,
          {
            expand: ["line_items.data.price.product"],
          },
        );
        console.log(`Checkout session completed for session ID: ${session.id}`);
        let order = await orderRepository.findBySessionId(session.id);
        if (order?.paymentStatus === "paid") {
          console.log(`Order ${order._id} is already marked as paid.`);
          break;
        }

        const shippingName =
          session.shipping_details?.name ||
          session.customer_details?.name ||
          "";
        const shippingAddress =
          session.shipping_details?.address ||
          session.customer_details?.address ||
          {};

        if (!order) {
          const userId = session.metadata?.userId;
          if (!userId) {
            console.log(
              `Unable to create order for session ${session.id}: missing userId metadata.`,
            );
            break;
          }

          const sessionLineItems = session.line_items?.data || [];
          const mappedItems = await Promise.all(
            sessionLineItems.map(async (lineItem) => {
              const stripeProduct = lineItem.price?.product;
              const stripeMetadata =
                stripeProduct && typeof stripeProduct === "object"
                  ? stripeProduct.metadata || {}
                  : {};
              const productId = stripeMetadata.id;
              const product = productId
                ? await productRepository.findById(productId)
                : null;
              const quantity = lineItem.quantity || 1;
              const unitAmount =
                lineItem.price?.unit_amount ??
                (lineItem.amount_total
                  ? Math.round(lineItem.amount_total / quantity)
                  : 0);

              return {
                product: productId || null,
                name:
                  lineItem.description ||
                  (stripeProduct && typeof stripeProduct === "object"
                    ? stripeProduct.name
                    : "") ||
                  product?.name ||
                  "Product",
                price: unitAmount / 100,
                quantity: quantity,
                image:
                  (stripeProduct && typeof stripeProduct === "object"
                    ? stripeProduct.images?.[0]
                    : "") ||
                  product?.images?.[0] ||
                  product?.image ||
                  "",
                variant: {
                  size: stripeMetadata.selectedSize || "",
                  color: stripeMetadata.selectedColor || "",
                },
              };
            }),
          );

          order = await orderRepository.create({
            user: userId,
            items: mappedItems,
            totalAmount: (session.amount_total || 0) / 100,
            stripeSessionId: session.id,
            paymentStatus: "paid",
            status: "processing",
            shippingAddress: {
              name: shippingName,
              ...shippingAddress,
            },
          });
          console.log(`Order ${order._id} created from checkout session.`);
        } else {
          await orderRepository.updateById(order._id, {
            paymentStatus: "paid",
            status: "processing",
            shippingAddress: {
              name: shippingName,
              ...shippingAddress,
            },
          });
          console.log(`Order ${order._id} updated to paid.`);
        }

        for (const item of order.items || []) {
          if (!item.product) {
            continue;
          }
          const product = await productRepository.findById(item.product);
          if (product) {
            await productRepository.updateById(item.product, {
              stockQuantity: Math.max(0, product.stockQuantity - item.quantity),
            });
          }
        }
      }
      break;

    case "charge.succeeded": {
      const charge = event.data.object;
      console.log(`Charge succeeded for charge ID: ${charge.id}`);
      // If using checkout sessions, checkout.session.completed is usually enough.
      // But we can check if the order needs updating here as well if we have the session ID.
      if (charge.payment_intent) {
        // Payment Intent can be used to find the session if needed,
        // but Stripe Checkout sessions are easier to map via session.id
        console.log(`Payment Intent ID: ${charge.payment_intent}`);
      }
      break;
    }

    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;
      console.log(`Payment Intent succeeded for ID: ${paymentIntent.id}`);
      break;
    }

    case "payment_intent.created":
      console.log(`Payment Intent created: ${event.data.object.id}`);
      break;

    case "payment_intent.requires_action":
      console.log(`Payment Intent requires action: ${event.data.object.id}`);
      break;

    case "charge.updated":
      console.log(`Charge updated: ${event.data.object.id}`);
      break;

    default:
      console.log(`Received unhandled event type: ${event.type}`);
  }

  res.status(200).json({ received: true });
};

export const getUserOrders = async (req, res) => {
  const user = await userRepository.findByClerkId(req.user.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const orders = await orderRepository.findByUserId(user._id);
  res.status(200).json({ orders });
};
