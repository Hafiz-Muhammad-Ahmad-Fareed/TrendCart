import { Link } from "react-router-dom";
import {
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  Mail,
} from "lucide-react";
import { useAuth } from "@clerk/react";
import { useState } from "react";
import useCartStore from "../stores/useCartStore";

const CartPage = () => {
  const { isSignedIn } = useAuth();
  const [guestEmail, setGuestEmail] = useState("");
  const { cart, updateQuantity, removeFromCart, isCartLoading, checkout } =
    useCartStore();

  const cartItems = cart || [];
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0,
  );

  const handleCheckout = (e) => {
    e.preventDefault();
    if (!isSignedIn && !guestEmail) {
      return; // Handled by HTML required attribute
    }
    checkout(isSignedIn ? null : guestEmail);
  };

  if (isCartLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-white">
        <div className="px-6 py-20 text-center text-gray-400">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
            Loading your cart...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-white">
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="mb-10 text-4xl font-bold">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="rounded-4xl border border-dashed border-gray-700 bg-gray-900/40 p-16 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-800 text-gray-400">
              <ShoppingCart size={40} />
            </div>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              Your cart is empty
            </h2>
            <p className="mb-8 text-gray-400">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-8 py-3 font-bold text-white transition hover:bg-emerald-500"
            >
              Start Shopping
              <ArrowRight size={20} />
            </Link>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-3">
            {/* Cart Items List */}
            <div className="space-y-6 lg:col-span-2">
              {cartItems.map((item) => (
                <div
                  key={`${item.product._id}-${item.selectedSize || "nosize"}-${item.selectedColor || "nocolor"}-${item.selectedImage || "noimage"}`}
                  className="flex flex-col gap-6 rounded-3xl border border-gray-800 bg-gray-900/70 p-6 sm:flex-row sm:items-center"
                >
                  {/* Product Image */}
                  <div className="h-32 w-full overflow-hidden rounded-2xl bg-gray-800 sm:h-24 sm:w-24">
                    {item.selectedImage ||
                    item.product.images?.[0] ||
                    item.product.image ? (
                      <img
                        src={
                          item.selectedImage ||
                          item.product.images?.[0] ||
                          item.product.image
                        }
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center font-bold text-gray-500">
                        IMG
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex flex-1 flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                      <Link
                        to={`/product/${item.product.slug}`}
                        className="text-xl font-semibold text-white transition hover:text-emerald-400"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-gray-400">
                        ${Number(item.product.price).toFixed(2)} each
                      </p>
                      <p className="text-sm text-gray-400">
                        Size: {item.selectedSize || "N/A"} • Color:{" "}
                        {item.selectedColor || "N/A"}
                      </p>
                    </div>

                    <div className="flex items-center gap-6">
                      {/* Quantity Controls */}
                      <div className="flex items-center rounded-xl border border-gray-700 bg-gray-800/50 p-1">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product._id,
                              item.quantity - 1,
                              item.selectedSize || "",
                              item.selectedColor || "",
                              item.selectedImage || "",
                            )
                          }
                          disabled={item.quantity <= 1}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-700 hover:text-white disabled:opacity-30"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-10 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product._id,
                              item.quantity + 1,
                              item.selectedSize || "",
                              item.selectedColor || "",
                              item.selectedImage || "",
                            )
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-700 hover:text-white"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <div className="min-w-24 text-right">
                        <p className="text-lg font-bold text-emerald-400">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          removeFromCart(
                            item.product._id,
                            item.selectedSize || "",
                            item.selectedColor || "",
                            item.selectedImage || "",
                          )
                        }
                        className="text-gray-500 transition hover:text-red-500"
                        title="Remove item"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="h-fit space-y-6 rounded-3xl border border-gray-800 bg-gray-900/70 p-8 shadow-2xl">
              <h2 className="text-2xl font-bold">Order Summary</h2>

              <div className="space-y-4 border-b border-gray-800 pb-6">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span className="text-emerald-400 font-medium">Free</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-emerald-400">${subtotal.toFixed(2)}</span>
              </div>

              <form onSubmit={handleCheckout} className="space-y-4">
                {!isSignedIn && (
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-400"
                    >
                      Email for Guest Checkout
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">
                        <Mail size={18} />
                      </div>
                      <input
                        type="email"
                        id="email"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        className="block w-full rounded-xl border border-gray-700 bg-gray-800/50 py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-4 font-bold text-white transition hover:bg-emerald-500"
                >
                  {isSignedIn ? "Proceed to Checkout" : "Checkout as Guest"}
                  <ArrowRight size={20} />
                </button>
              </form>

              <Link
                to="/"
                className="block text-center text-sm text-gray-400 transition hover:text-emerald-400"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
