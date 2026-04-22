import { useEffect, useState, useMemo } from "react";
import { ArrowLeft, Search, Filter, X } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import useCatalogStore from "../stores/useCatalogStore";

const CategoryPage = () => {
  const { slug } = useParams();
  const {
    currentCategory,
    categoryProducts,
    isCategoryProductsLoading,
    fetchCategoryProducts,
  } = useCatalogStore();

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (slug) {
      fetchCategoryProducts(slug);
    }
  }, [fetchCategoryProducts, slug]);

  const filteredProducts = useMemo(() => {
    return categoryProducts.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [categoryProducts, searchQuery]);

  return (
    <div className="relative min-h-screen text-white">
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <Link
            to="/categories"
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-300 transition hover:text-emerald-200"
          >
            <ArrowLeft size={16} />
            Back to Categories
          </Link>
        </div>

        <div className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative col-span-1 md:col-span-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-gray-700 bg-gray-900/50 py-3 pl-10 pr-4 outline-none focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        {isCategoryProductsLoading ? (
          <div className="px-6 py-20 text-center text-gray-400">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
              Loading products...
            </div>
          </div>
        ) : !currentCategory ? (
          <div className="rounded-3xl border border-dashed border-gray-700 bg-gray-900/40 p-12 text-center text-gray-400">
            Category not found.
          </div>
        ) : (
          <>
            {filteredProducts.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-gray-700 bg-gray-900/40 p-12 text-center text-gray-400">
                {searchQuery !== "all"
                  ? "No products match your current filters."
                  : "No active products are published in this category yet."}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <Link
                    key={product._id}
                    to={`/categories/category/${currentCategory.slug}/product/${product.slug}`}
                    className="group overflow-hidden rounded-4xl border border-gray-800 bg-gray-900/70 shadow-2xl shadow-emerald-950/10 transition hover:border-emerald-500/50"
                  >
                    <div className="h-72 overflow-hidden bg-linear-to-br from-emerald-700/40 to-gray-950">
                      {product.images?.[0] || product.image ? (
                        <img
                          src={product.images?.[0] || product.image}
                          alt={product.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center px-8 text-center text-2xl font-semibold text-white">
                          {product.name}
                        </div>
                      )}
                    </div>

                    <div className="space-y-4 p-6">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="text-2xl font-semibold text-white group-hover:text-emerald-400 transition-colors">
                            {product.name}
                          </h2>
                          <p className="text-sm text-gray-400">
                            {product.slug}
                          </p>
                        </div>
                        <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm font-semibold text-emerald-300">
                          ${Number(product.price).toFixed(2)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 line-clamp-2">
                        {product.description || "No description available."}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <span
                          className={
                            product.stockQuantity === 0 ? "text-red-400" : ""
                          }
                        >
                          Stock: {product.stockQuantity}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
