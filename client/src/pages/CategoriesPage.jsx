import React, { useEffect, useState, useMemo } from "react"; // Added useState and useMemo
import { Search, X } from "lucide-react"; // Added search icons
import CategoryItem from "../components/CategoryItem";
import useCatalogStore from "../stores/useCatalogStore";

const CategoriesPage = () => {
  const { categories, isCategoriesLoading, fetchCategories } =
    useCatalogStore();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Filter categories based on search query
  const filteredCategories = useMemo(() => {
    return categories.filter((category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [categories, searchQuery]);

  return (
    <div className="relative min-h-screen text-white">
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-5xl font-bold text-emerald-400 sm:text-6xl">
            Where Trends Meet Your Cart
          </h1>
          <p className="text-xl text-gray-300">
            Everything You Love, In One Cart
          </p>
        </div>

        {/* Search Bar Section */}
        <div className="mx-auto mb-12 max-w-2xl">
          <div className="relative group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-400 transition-colors"
              size={20}
            />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-gray-700 bg-gray-900/50 py-4 pl-12 pr-12 text-white outline-none ring-emerald-500/20 transition-all focus:border-emerald-500 focus:ring-4"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {isCategoriesLoading ? (
          <div className="px-6 py-20 text-center text-gray-400">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
              Loading categories...
            </div>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-700 bg-gray-900/40 p-12 text-center text-gray-400">
            {searchQuery
              ? `No categories match "${searchQuery}"`
              : "No categories are live yet."}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCategories.map((category) => (
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
