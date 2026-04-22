import React from "react";
import { useEffect } from "react";
import CategoryItem from "../components/CategoryItem";
import useCatalogStore from "../stores/useCatalogStore";

const CategoriesPage = () => {
  const { categories, isCategoriesLoading, fetchCategories } =
    useCatalogStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);
  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="mb-4 text-center text-5xl font-bold text-emerald-400 sm:text-6xl">
          Where Trends Meet Your Cart
        </h1>
        <p className="mb-12 text-center text-xl text-gray-300">
          Everything You Love, In One Cart
        </p>

        {isCategoriesLoading ? (
          <div className="px-6 py-20 text-center text-gray-400">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
              Loading categories...
            </div>
          </div>
        ) : categories.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-700 bg-gray-900/40 p-12 text-center text-gray-400">
            No categories are live yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
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
      </div>
    </div>
  );
};

export default CategoriesPage;
