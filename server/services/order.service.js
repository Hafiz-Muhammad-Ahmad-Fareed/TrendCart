import Stripe from "stripe";
import orderRepository from "../repositories/order.repository.js";
import cartRepository from "../repositories/cart.repository.js";
import userRepository from "../repositories/user.repository.js";
import productRepository from "../repositories/product.repository.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  const user = await userRepository.findByClerkId(req.user.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const cart = await cartRepository.findByUserId(user._id);
  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  let totalAmount = 0;
  const lineItems = cart.items.map((item) => {
    const amount = Math.round(item.product.price * 100); // Stripe expects amounts in cents
    totalAmount += amount * item.quantity;
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.product.name,
          images: item.product.image ? [item.product.image] : [],
          metadata: {
            id: item.product._id.toString(),
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
    metadata: {
      userId: user._id.toString(),
    },
  });

  // Create pending order
  await orderRepository.create({
    user: user._id,
    items: cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image,
    })),
    totalAmount: totalAmount / 100,
    stripeSessionId: session.id,
    paymentStatus: "unpaid",
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

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const order = await orderRepository.findBySessionId(session.id);
    if (order) {
      // Update order status
      await orderRepository.updateById(order._id, {
        paymentStatus: "paid",
        status: "processing",
      });

      // Update product stock
      for (const item of order.items) {
        const product = await productRepository.findById(item.product);
        if (product) {
          await productRepository.updateById(item.product, {
            stockQuantity: Math.max(0, product.stockQuantity - item.quantity),
          });
        }
      }

      // Clear user's cart
      await cartRepository.updateByUserId(order.user, { items: [] });
    }
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
