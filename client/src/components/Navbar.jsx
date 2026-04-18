import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { Show, SignInButton, UserButton } from "@clerk/react";
import useUserStore from "../stores/useUserStore";

const Navbar = () => {
  const { user } = useUserStore();
  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-emerald-800">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap justify-between items-center">
          <Link
            to="/"
            className="text-2xl font-bold text-emerald-400 items-center space-x-2 flex"
          >
            TrendCart
          </Link>

          <nav className="flex items-center gap-6">
            {user?.role === "admin" ? (
              <>
                <Link
                  to="/admin-dashboard"
                  className="text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out"
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out"
                >
                  Home
                </Link>

                <Link
                  to="/cart"
                  className="text-gray-300 hover:text-emerald-400 transition"
                >
                  <ShoppingCart size={20} />
                </Link>
              </>
            )}
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition duration-300 shadow-md cursor-pointer">
                  Sign In
                </button>
              </SignInButton>
            </Show>

            <Show when="signed-in">
              <div className="flex items-center mt-1 gap-3">
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
