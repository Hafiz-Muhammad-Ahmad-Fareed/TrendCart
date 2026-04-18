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
          <p className="text-gray-300">Loading category...</p>
        ) : !currentCategory ? (
          <div className="rounded-3xl border border-dashed border-gray-700 bg-gray-900/40 p-12 text-center text-gray-400">
            Category not found.
          </div>
        ) : (
          <>
            <div className="mb-12 grid gap-8 overflow-hidden rounded-[2rem] border border-gray-800 bg-gray-900/70 p-8 lg:grid-cols-[1.4fr_1fr]">
              <div>
                <p className="mb-3 text-sm uppercase tracking-[0.3em] text-emerald-300/70">
                  Live category
                </p>
                <h1 className="text-4xl font-bold text-white sm:text-5xl">
                  {currentCategory.name}
                </h1>
                <p className="mt-4 max-w-2xl text-lg text-gray-300">
                  {currentCategory.description ||
                    "Browse the latest products in this category."}
                </p>
              </div>

              <div className="overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-emerald-700/40 to-gray-950">
                {currentCategory.image ? (
                  <img
                    src={currentCategory.image}
                    alt={currentCategory.name}
                    className="h-full max-h-72 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full min-h-72 items-center justify-center px-8 text-center text-2xl font-semibold text-white">
                    {currentCategory.name}
                  </div>
                )}
              </div>
            </div>

            {categoryProducts.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-gray-700 bg-gray-900/40 p-12 text-center text-gray-400">
                No active products are published in this category yet.
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {categoryProducts.map((product) => (
                  <article
                    key={product._id}
                    className="overflow-hidden rounded-[2rem] border border-gray-800 bg-gray-900/70 shadow-2xl shadow-emerald-950/10"
                  >
                    <div className="h-72 overflow-hidden bg-gradient-to-br from-emerald-700/40 to-gray-950">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover transition duration-500 hover:scale-105"
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
                          <h2 className="text-2xl font-semibold text-white">
                            {product.name}
                          </h2>
                          <p className="text-sm text-gray-400">{product.slug}</p>
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
                        {product.isFeatured ? (
                          <span className="rounded-full bg-amber-500/15 px-3 py-1 font-semibold text-amber-300">
                            Featured
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </article>
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
