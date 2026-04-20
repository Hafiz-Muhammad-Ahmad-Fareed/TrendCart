import { useEffect } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, ShoppingBag, ArrowRight } from "lucide-react";
import useCartStore from "../stores/useCartStore";

const CheckoutSuccessPage = () => {
  const { clearCart } = useCartStore();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="flex min-h-[80vh] items-center justify-center text-white">
      <div className="mx-auto max-w-md rounded-4xl border border-emerald-500/30 bg-gray-900/80 p-12 text-center shadow-2xl backdrop-blur-xl">
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
          <CheckCircle size={56} />
        </div>

        <h1 className="mb-4 text-4xl font-bold text-white">
          Payment Successful!
        </h1>
        <p className="mb-8 text-lg text-gray-400">
          Thank you for your purchase. Your order has been placed and is being
          processed.
        </p>

        <div className="flex flex-col gap-4">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-4 font-bold text-white transition hover:bg-emerald-500"
          >
            <ShoppingBag size={20} />
            Continue Shopping
          </Link>
          <Link
            to="/orders"
            className="flex items-center justify-center gap-2 rounded-2xl border border-gray-700 py-4 font-bold text-gray-300 transition hover:bg-gray-800"
          >
            View My Orders
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;
