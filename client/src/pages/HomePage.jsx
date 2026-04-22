import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Zap, ShieldCheck, Truck } from "lucide-react";
import useCatalogStore from "../stores/useCatalogStore";
import CategoryItem from "../components/CategoryItem";

const HomePage = () => {
  const { categories, fetchCategories, isCategoriesLoading } =
    useCatalogStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div className="relative min-h-screen text-white">
      {/* Hero Section */}
      <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden px-4">
        <div className="relative z-10 text-center">
          <h1 className="mb-6 animate-fade-in text-6xl font-extrabold tracking-tight sm:text-8xl">
            Elevate Your <span className="text-emerald-500">Style</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-400 sm:text-xl">
            Discover TrendCart's exclusive collection where quality meets the
            latest fashion. Shop the trends that define you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/categories"
              className="group flex items-center gap-2 rounded-full bg-emerald-600 px-8 py-4 text-lg font-bold transition hover:bg-emerald-500"
            >
              Shop Collection
              <ShoppingBag
                className="transition-transform group-hover:scale-110"
                size={20}
              />
            </Link>
          </div>
        </div>

        {/* Decorative elements to match your App.js background */}
        <div className="absolute top-1/2 left-1/2 -z-10 size-125 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />
      </section>

      {/* Trust Badges */}
      <section className="border-y border-gray-800 bg-gray-900/50 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { icon: Truck, label: "Fast Shipping" },
              { icon: ShieldCheck, label: "Secure Payment" },
              { icon: Zap, label: "Quick Checkout" },
              { icon: ShoppingBag, label: "Latest Trends" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-2 text-center"
              >
                <item.icon className="text-emerald-500" size={28} />
                <span className="text-sm font-semibold uppercase tracking-widest text-gray-400">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="text-4xl font-bold text-white">Top Categories</h2>
            <p className="mt-2 text-gray-400">
              Explore our most popular departments
            </p>
          </div>
          <Link
            to="/categories"
            className="hidden text-emerald-400 transition hover:text-emerald-300 sm:block"
          >
            View all categories →
          </Link>
        </div>

        {isCategoriesLoading ? (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.slice(0, 3).map((category) => (
              <CategoryItem
                key={category._id}
                category={{
                  slug: category.slug,
                  name: category.name,
                  imageUrl: category.image,
                }}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
