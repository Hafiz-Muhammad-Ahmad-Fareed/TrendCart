import { useEffect, useMemo, useState } from "react";
import { Package, Pencil, Plus, Trash2 } from "lucide-react";
import useAdminStore from "../stores/useAdminStore";

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  price: "",
  categoryId: "",
  stockQuantity: "",
  isFeatured: false,
  status: "active",
  image: "",
  imageFile: null,
};

const AdminProductsPage = () => {
  const {
    categories,
    products,
    isCategoriesLoading,
    isProductsLoading,
    isSavingProduct,
    isDeleting,
    fetchCategories,
    fetchProducts,
    saveProduct,
    deleteProduct,
  } = useAdminStore();
  const [form, setForm] = useState(emptyForm);
  const [editingProductId, setEditingProductId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const activeFilters = useMemo(
    () => ({
      status: statusFilter,
      categoryId: categoryFilter,
    }),
    [categoryFilter, statusFilter],
  );

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProducts(activeFilters);
  }, [activeFilters, fetchProducts]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingProductId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const product = await saveProduct(form, editingProductId, activeFilters);

    if (product) {
      resetForm();
    }
  };

  const handleEdit = (product) => {
    setEditingProductId(product._id);
    setForm({
      name: product.name,
      slug: product.slug,
      description: product.description || "",
      price: String(product.price ?? ""),
      categoryId: product.category?._id || "",
      stockQuantity: String(product.stockQuantity ?? ""),
      isFeatured: Boolean(product.isFeatured),
      status: product.status || "active",
      image: product.image || "",
      imageFile: null,
    });
  };

  const handleDelete = async (productId) => {
    const confirmed = window.confirm("Delete this product?");

    if (!confirmed) {
      return;
    }

    await deleteProduct(productId, activeFilters);

    if (editingProductId === productId) {
      resetForm();
    }
  };

  return (
    <div className="grid gap-8 xl:grid-cols-[420px_minmax(0,1fr)]">
      <section className="rounded-3xl border border-gray-800 bg-gray-900/70 p-6 shadow-2xl shadow-emerald-950/20">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-2xl bg-emerald-500/20 p-3 text-emerald-300">
            <Package size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-white">
              {editingProductId ? "Edit product" : "Create product"}
            </h2>
            <p className="text-sm text-gray-400">
              Control inventory, featured items, and storefront visibility.
            </p>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            value={form.name}
            onChange={(event) =>
              setForm((current) => ({ ...current, name: event.target.value }))
            }
            placeholder="Product name"
            className="w-full rounded-2xl border border-gray-700 bg-gray-950/80 px-4 py-3 text-white outline-none transition focus:border-emerald-500"
          />
          <input
            type="text"
            value={form.slug}
            onChange={(event) =>
              setForm((current) => ({ ...current, slug: event.target.value }))
            }
            placeholder="Slug (optional)"
            className="w-full rounded-2xl border border-gray-700 bg-gray-950/80 px-4 py-3 text-white outline-none transition focus:border-emerald-500"
          />
          <textarea
            value={form.description}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                description: event.target.value,
              }))
            }
            rows={4}
            placeholder="Description"
            className="w-full rounded-2xl border border-gray-700 bg-gray-950/80 px-4 py-3 text-white outline-none transition focus:border-emerald-500"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={(event) =>
                setForm((current) => ({ ...current, price: event.target.value }))
              }
              placeholder="Price"
              className="w-full rounded-2xl border border-gray-700 bg-gray-950/80 px-4 py-3 text-white outline-none transition focus:border-emerald-500"
            />
            <input
              type="number"
              min="0"
              value={form.stockQuantity}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  stockQuantity: event.target.value,
                }))
              }
              placeholder="Stock quantity"
              className="w-full rounded-2xl border border-gray-700 bg-gray-950/80 px-4 py-3 text-white outline-none transition focus:border-emerald-500"
            />
          </div>

          <select
            value={form.categoryId}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                categoryId: event.target.value,
              }))
            }
            className="w-full rounded-2xl border border-gray-700 bg-gray-950/80 px-4 py-3 text-white outline-none transition focus:border-emerald-500"
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>

          <div className="grid gap-4 sm:grid-cols-2">
            <select
              value={form.status}
              onChange={(event) =>
                setForm((current) => ({ ...current, status: event.target.value }))
              }
              className="w-full rounded-2xl border border-gray-700 bg-gray-950/80 px-4 py-3 text-white outline-none transition focus:border-emerald-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <label className="flex items-center gap-3 rounded-2xl border border-gray-800 bg-gray-950/70 px-4 py-3 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    isFeatured: event.target.checked,
                  }))
                }
                className="h-4 w-4 accent-emerald-500"
              />
              Featured product
            </label>
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                imageFile: event.target.files?.[0] || null,
              }))
            }
            className="w-full rounded-2xl border border-dashed border-gray-700 bg-gray-950/80 px-4 py-3 text-sm text-gray-300 file:mr-4 file:rounded-xl file:border-0 file:bg-emerald-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
          />

          {form.image && !form.imageFile ? (
            <img
              src={form.image}
              alt={form.name || "Product preview"}
              className="h-40 w-full rounded-2xl object-cover"
            />
          ) : null}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSavingProduct || isCategoriesLoading}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Plus size={18} />
              {isSavingProduct
                ? "Saving..."
                : editingProductId
                  ? "Update product"
                  : "Create product"}
            </button>

            {editingProductId ? (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-2xl border border-gray-700 px-4 py-3 font-semibold text-gray-200 transition hover:border-gray-500"
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="rounded-3xl border border-gray-800 bg-gray-900/70 p-6 shadow-2xl shadow-emerald-950/20">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">Products</h2>
            <p className="text-sm text-gray-400">
              Filter products by category and status while managing inventory.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-2xl border border-gray-700 bg-gray-950/80 px-4 py-3 text-white outline-none transition focus:border-emerald-500"
            >
              <option value="">All statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="rounded-2xl border border-gray-700 bg-gray-950/80 px-4 py-3 text-white outline-none transition focus:border-emerald-500"
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isProductsLoading ? (
          <p className="text-gray-400">Loading products...</p>
        ) : products.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-700 bg-gray-950/40 p-10 text-center text-gray-400">
            No products found for the selected filters.
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((product) => (
              <article
                key={product._id}
                className="grid gap-4 rounded-3xl border border-gray-800 bg-gray-950/60 p-4 md:grid-cols-[120px_minmax(0,1fr)_auto]"
              >
                <div className="h-28 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-700/40 to-gray-950">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-white">
                      {product.name}
                    </h3>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        product.status === "active"
                          ? "bg-emerald-500/15 text-emerald-300"
                          : "bg-gray-700 text-gray-300"
                      }`}
                    >
                      {product.status}
                    </span>
                    {product.isFeatured ? (
                      <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-300">
                        Featured
                      </span>
                    ) : null}
                  </div>
                  <p className="text-sm text-gray-300">
                    {product.description || "No description yet."}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    <span>Category: {product.category?.name || "Unknown"}</span>
                    <span>Price: ${Number(product.price).toFixed(2)}</span>
                    <span>Stock: {product.stockQuantity}</span>
                  </div>
                </div>

                <div className="flex gap-3 md:flex-col">
                  <button
                    type="button"
                    onClick={() => handleEdit(product)}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-700 px-4 py-2 text-sm font-semibold text-gray-100 transition hover:border-emerald-500 hover:text-emerald-300"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(product._id)}
                    disabled={isDeleting}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-500/40 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminProductsPage;
