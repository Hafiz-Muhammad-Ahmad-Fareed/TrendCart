import { ShoppingCart } from "lucide-react";
import { Link, NavLink } from "react-router-dom"; // Changed Link to NavLink
import { Show, SignInButton, UserButton } from "@clerk/react";
import useUserStore from "../stores/useUserStore";
import useCartStore from "../stores/useCartStore";

const Navbar = () => {
  const { user } = useUserStore();
  const { cart } = useCartStore();

  const cartItemsCount = cart?.length || 0;

  // Helper to manage active vs inactive styles
  const navLinkStyles = ({ isActive }) =>
    `px-3 py-2 rounded-lg transition duration-300 ease-in-out font-medium ${
      isActive
        ? "bg-emerald-500/20 text-emerald-400" // Active Background & Text
        : "text-gray-300 hover:bg-gray-800 hover:text-emerald-400" // Hover Background
    }`;

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

          <nav className="flex items-center gap-2">
            {user?.role === "admin" ? null : (
              <>
                <NavLink to="/" className={navLinkStyles}>
                  Home
                </NavLink>

                <NavLink to="/categories" className={navLinkStyles}>
                  Categories
                </NavLink>

                <NavLink
                  to="/cart"
                  className={({ isActive }) =>
                    `relative p-2 rounded-lg transition ${
                      isActive
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "text-gray-300 hover:bg-gray-800 hover:text-emerald-400"
                    }`
                  }
                >
                  <ShoppingCart size={20} />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white ring-2 ring-gray-900">
                      {cartItemsCount}
                    </span>
                  )}
                </NavLink>

                <Show when="signed-in">
                  <NavLink to="/orders" className={navLinkStyles}>
                    Orders
                  </NavLink>
                </Show>
              </>
            )}

            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="ml-4 cursor-pointer rounded-lg bg-emerald-500 px-4 py-2 text-sm font-bold text-white shadow-md transition duration-300 hover:bg-emerald-600">
                  Sign In
                </button>
              </SignInButton>
            </Show>

            <Show when="signed-in">
              <div className="ml-4 mt-1 flex items-center">
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
