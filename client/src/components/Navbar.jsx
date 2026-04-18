import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { Show, SignInButton, UserButton } from "@clerk/react";
import useUserStore from "../stores/useUserStore";

const Navbar = () => {
  const { user } = useUserStore();

  return (
    <header className="fixed top-0 left-0 z-40 w-full border-b border-emerald-800 bg-gray-900/90 shadow-lg backdrop-blur-md transition-all duration-300">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center justify-between">
          <Link
            to="/"
            className="flex items-center space-x-2 text-2xl font-bold text-emerald-400"
          >
            TrendCart
          </Link>

          <nav className="flex items-center gap-6">
            {user?.role === "admin" ? (
              <>
                {/* <Link
                  to="/admin-dashboard"
                  className="text-gray-300 transition duration-300 ease-in-out hover:text-emerald-400"
                >
                  Dashboard
                </Link>
                <Link
                  to="/admin-dashboard/categories"
                  className="text-gray-300 transition duration-300 ease-in-out hover:text-emerald-400"
                >
                  Categories
                </Link>
                <Link
                  to="/admin-dashboard/products"
                  className="text-gray-300 transition duration-300 ease-in-out hover:text-emerald-400"
                >
                  Products
                </Link> */}
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className="text-gray-300 transition duration-300 ease-in-out hover:text-emerald-400"
                >
                  Home
                </Link>

                <Link
                  to="/cart"
                  className="text-gray-300 transition hover:text-emerald-400"
                >
                  <ShoppingCart size={20} />
                </Link>
              </>
            )}
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="cursor-pointer rounded-lg bg-emerald-500 px-4 py-2 text-white shadow-md transition duration-300 hover:bg-emerald-600">
                  Sign In
                </button>
              </SignInButton>
            </Show>

            <Show when="signed-in">
              <div className="mt-1 flex items-center gap-3">
                <UserButton afterSignOutUrl="/" />
              </div>
            </Show>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
