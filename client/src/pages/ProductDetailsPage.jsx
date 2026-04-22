import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Info, TrendingUp } from "lucide-react";
import { useAuth } from "@clerk/react";
import toast from "react-hot-toast";
import useCatalogStore from "../stores/useCatalogStore";
import useCartStore from "../stores/useCartStore";

const ProductDetailsPage = () => {
  const { slug } = useParams();
  const { isSignedIn } = useAuth();
  const {
    currentProduct,
    similarProducts,
    isProductDetailsLoading,
    fetchProductDetails,
  } = useCatalogStore();
  const { addToCart } = useCartStore();

  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  useEffect(() => {
    if (slug) {
      fetchProductDetails(slug);
    }
  }, [fetchProductDetails, slug]);

  useEffect(() => {
    if (currentProduct) {
      setMainImage(currentProduct.images?.[0] || currentProduct.image || "");
      setSelectedSize("");
      setSelectedColor("");
    }
  }, [currentProduct]);
  // console.log(similarProducts);
  const handleAddToCart = () => {
    if (!isSignedIn) {
      toast.error("Please login to add to cart");
      return;
    }

    if (currentProduct.sizes?.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    if (currentProduct.colors?.length > 0 && !selectedColor) {
      toast.error("Please select a color");
      return;
    }

    addToCart({
      ...currentProduct,
      selectedSize,
      selectedColor,
      selectedImage:
        mainImage || currentProduct.images?.[0] || currentProduct.image || "",
    });
  };

  if (isProductDetailsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-white">
        <div className="px-6 py-20 text-center text-gray-400">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
            Loading product details...
          </div>
        </div>
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="flex min-h-screen items-center justify-center text-white">
        <div className="text-center">
          <h2 className="mb-4 text-3xl font-bold">Product not found</h2>
          <Link
            to="/"
            className="text-emerald-400 hover:text-emerald-300 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-white">
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Link
          to={`/category/${currentProduct.category?.slug || ""}`}
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-emerald-300 transition hover:text-emerald-200"
        >
          <ArrowLeft size={16} />
          Back to {currentProduct.category?.name || "category"}
        </Link>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Product Gallery */}
          <div className="flex flex-col gap-4">
            <div className="aspect-square overflow-hidden rounded-4xl border border-gray-800 bg-gray-900/70 shadow-2xl">
              {mainImage ? (
                <img
                  src={mainImage}
                  alt={currentProduct.name}
                  className="h-full w-full object-cover transition duration-300"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-emerald-700/40 to-gray-950 text-4xl font-bold text-gray-500">
                  No Image
                </div>
              )}
            </div>

            {currentProduct.images?.length > 1 && (
              <div className="flex flex-wrap gap-3">
                {currentProduct.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMainImage(img)}
                    className={`h-20 w-20 overflow-hidden rounded-xl border-2 transition ${
                      mainImage === img
                        ? "border-emerald-500 scale-105"
                        : "border-gray-800 hover:border-gray-600"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${currentProduct.name} ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center space-y-8">
            <div>
              <h1 className="mb-2 text-4xl font-bold text-white lg:text-5xl">
                {currentProduct.name}
              </h1>
              <span className="inline-block rounded-full bg-emerald-500/15 px-4 py-1.5 text-lg font-semibold text-emerald-300">
                ${Number(currentProduct.price).toFixed(2)}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-400">
                <Info size={20} />
                <h3 className="text-xl font-semibold">Description</h3>
              </div>
              <p className="text-lg leading-relaxed text-gray-300">
                {currentProduct.description || "No description available."}
              </p>
            </div>

            {/* Sizes & Colors */}
            <div className="grid gap-6 sm:grid-cols-2">
              {currentProduct.sizes?.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">
                    Select Size
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {currentProduct.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-12 rounded-lg border-2 px-3 py-2 text-sm font-bold transition ${
                          selectedSize === size
                            ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                            : "border-gray-800 bg-gray-900/50 text-gray-300 hover:border-gray-700"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentProduct.colors?.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">
                    Select Color
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {currentProduct.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`min-w-12 rounded-lg border-2 px-3 py-2 text-sm font-bold transition ${
                          selectedColor === color
                            ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                            : "border-gray-800 bg-gray-900/50 text-gray-300 hover:border-gray-700"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-6">
              <div className="text-sm text-gray-400">
                <span className="block font-medium text-gray-300">
                  Availability
                </span>
                {currentProduct.stockQuantity > 0 ? (
                  <span className="text-emerald-400">
                    In Stock ({currentProduct.stockQuantity})
                  </span>
                ) : (
                  <span className="text-red-400">Out of Stock</span>
                )}
              </div>
              {/* {currentProduct.isFeatured && (
                <div className="rounded-full bg-amber-500/15 px-3 py-1 text-sm font-semibold text-amber-300">
                  Featured Product
                </div>
              )} */}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={currentProduct.stockQuantity <= 0}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-emerald-600 py-4 text-lg font-bold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 lg:w-max lg:px-12"
            >
              <ShoppingCart size={24} />
              Add to Cart
            </button>
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="mt-24">
            <div className="mb-10 flex items-center gap-3">
              <TrendingUp className="text-emerald-400" size={28} />
              <h2 className="text-3xl font-bold">Similar Products</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {similarProducts.map((product) => (
                <Link
                  key={product._id}
                  to={`/product/${product.slug}`}
                  className="group block overflow-hidden rounded-3xl border border-gray-800 bg-gray-900/50 transition hover:border-emerald-500/50"
                >
                  <div className="aspect-square overflow-hidden bg-gray-800">
                    {product?.images ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xl font-semibold">
                        {product.name}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="mb-1 truncate font-semibold text-white group-hover:text-emerald-400">
                      {product.name}
                    </h3>
                    <p className="font-bold text-emerald-300">
                      ${Number(product.price).toFixed(2)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPage;
