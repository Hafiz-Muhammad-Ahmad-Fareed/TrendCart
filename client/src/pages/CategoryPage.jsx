import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
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

  useEffect(() => {
    if (slug) {
      fetchCategoryProducts(slug);
    }
  }, [fetchCategoryProducts, slug]);

  return (
    <div className="relative min-h-screen text-white">
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-emerald-300 transition hover:text-emerald-200"
        >
          <ArrowLeft size={16} />
          Back to categories
        </Link>

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
            {categoryProducts.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-gray-700 bg-gray-900/40 p-12 text-center text-gray-400">
                No active products are published in this category yet.
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {categoryProducts.map((product) => (
                  <Link
                    key={product._id}
                    to={`/product/${product.slug}`}
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

                      <p className="text-sm text-gray-300">
                        {product.description || "No description available."}
                      </p>

                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <span>Stock: {product.stockQuantity}</span>
                        {/* {product.isFeatured ? (
                          <span className="rounded-full bg-amber-500/15 px-3 py-1 font-semibold text-amber-300">
                            Featured
                          </span>
                        ) : null} */}
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
