import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Package,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
  Image as ImageIcon,
  Layers,
  CheckCircle2,
  AlertCircle,
  Filter,
  Tag,
} from "lucide-react";
import useAdminStore from "../stores/useAdminStore";
import useOnClickOutside from "../hooks/useOnClickOutside";
import SummaryCard from "../components/SummaryCard"; // Imported as requested

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  price: "",
  categoryId: "",
  stockQuantity: "",
  isFeatured: false,
  status: "active",
  images: [],
  imageFiles: [],
  sizes: "",
  colors: "",
};

const AdminProductsPage = () => {
  const {
    categories,
    products,
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");

  const fileInputRef = useRef(null);
  const modalRef = useRef(null);

  // --- Logic & Filtering ---
  const filteredProducts = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();

    let result = [...products].filter((product) => {
      return (
        product.name.toLowerCase().includes(searchLower) ||
        (product.slug && product.slug.toLowerCase().includes(searchLower))
      );
    });

    switch (sortOption) {
      case "priceLowHigh":
        result.sort((a, b) => a.price - b.price);
        break;
      case "priceHighLow":
        result.sort((a, b) => b.price - a.price);
        break;
      case "stockLowHigh":
        result.sort((a, b) => a.stockQuantity - b.stockQuantity);
        break;
      case "stockHighLow":
        result.sort((a, b) => b.stockQuantity - a.stockQuantity);
        break;
      case "nameAZ":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "nameZA":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    return result;
  }, [products, searchTerm, sortOption]);

  const activeFilters = useMemo(
    () => ({
      status: statusFilter,
      categoryId: categoryFilter,
    }),
    [categoryFilter, statusFilter],
  );

  const stats = useMemo(
    () => ({
      total: products.length,
      active: products.filter((p) => p.status === "active").length,
      lowStock: products.filter((p) => p.stockQuantity <= 5).length,
      categoriesCount: categories.length,
    }),
    [products, categories],
  );

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProducts(activeFilters);
  }, [activeFilters, fetchProducts]);

  // --- Handlers ---
  const resetForm = () => {
    setForm(emptyForm);
    setEditingProductId(null);
    setIsModalOpen(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setForm((c) => ({
      ...c,
      name,
      slug: editingProductId
        ? c.slug
        : name
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, ""),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const product = await saveProduct(form, editingProductId, activeFilters);
    if (product) resetForm();
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
      images: product.images || [],
      imageFiles: [],
      sizes: Array.isArray(product.sizes) ? product.sizes.join(", ") : "",
      colors: Array.isArray(product.colors) ? product.colors.join(", ") : "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Delete this product?")) return;
    await deleteProduct(productId, activeFilters);
    if (editingProductId === productId) resetForm();
  };

  useOnClickOutside(modalRef, () => {
    if (isModalOpen) resetForm();
  });

  // --- Styles ---
  const selectClasses = `appearance-none rounded-xl border border-gray-700 px-4 outline-none transition focus:border-emerald-500 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_1rem_center] bg-no-repeat`;

  const getStatusStyles = (status) => {
    switch (status) {
      case "active":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "inactive":
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
      default:
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  return (
    <div className="relative min-h-screen flex flex-col gap-6 text-white">
      {/* Product MODAL SECTION */}
      {isModalOpen && (
        <section className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div
            ref={modalRef}
            className="custom-scrollbar overflow-y-auto mt-15 flex flex-col w-full max-w-md max-h-[80vh] rounded-3xl border border-gray-800 bg-gray-900 p-6 shadow-2xl animate-in fade-in zoom-in duration-200"
          >
            <div className=" mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-emerald-500/20 p-3 text-emerald-300">
                  <Package size={20} />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">
                    {editingProductId ? "Edit Product" : "Create Product"}
                  </h2>
                  <p className="text-sm text-gray-400">
                    Manage catalog details.
                  </p>
                </div>
              </div>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-white transition"
              >
                <X size={24} />
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                value={form.name}
                onChange={handleNameChange}
                placeholder="Product name"
                required
                className="w-full rounded-2xl border border-gray-700 bg-gray-950/80 px-4 py-3 text-white outline-none transition focus:border-emerald-500"
              />
              <input
                type="text"
                value={form.slug}
                onChange={(e) =>
                  setForm((c) => ({ ...c, slug: e.target.value }))
                }
                placeholder="Slug"
                className="w-full rounded-2xl border border-gray-700 bg-gray-950/80 px-4 py-3 text-white outline-none transition focus:border-emerald-500"
              />
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((c) => ({ ...c, description: e.target.value }))
                }
                rows={3}
                placeholder="Description"
                className="w-full rounded-2xl border border-gray-700 bg-gray-950/80 px-4 py-3 text-white outline-none transition focus:border-emerald-500"
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  value={form.sizes}
                  onChange={(e) =>
                    setForm((c) => ({ ...c, sizes: e.target.value }))
                  }
                  placeholder="Sizes (e.g. S, M, L)"
                  className="w-full rounded-2xl border border-gray-700 bg-gray-950/80 px-4 py-3 text-white outline-none transition focus:border-emerald-500"
                />
                <input
                  type="text"
                  value={form.colors}
                  onChange={(e) =>
                    setForm((c) => ({ ...c, colors: e.target.value }))
                  }
                  placeholder="Colors (e.g. Red, Blue)"
                  className="w-full rounded-2xl border border-gray-700 bg-gray-950/80 px-4 py-3 text-white outline-none transition focus:border-emerald-500"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) =>
                    setForm((c) => ({ ...c, price: e.target.value }))
                  }
                  placeholder="Price"
                  required
                  step="0.01"
                  className="w-full rounded-2xl border border-gray-700 bg-gray-950/80 px-4 py-3 text-white outline-none transition focus:border-emerald-500"
                />
                <input
                  type="number"
                  value={form.stockQuantity}
                  onChange={(e) =>
                    setForm((c) => ({ ...c, stockQuantity: e.target.value }))
                  }
                  placeholder="Stock"
                  required
                  className="w-full rounded-2xl border border-gray-700 bg-gray-950/80 px-4 py-3 text-white outline-none transition focus:border-emerald-500"
                />
              </div>

              <select
                value={form.categoryId}
                onChange={(e) =>
                  setForm((c) => ({ ...c, categoryId: e.target.value }))
                }
                required
                className={`${selectClasses} border border-gray-700 bg-gray-950/80 w-full py-2.5 ${!form.categoryId ? "text-gray-500" : "text-white"}`}
              >
                <option value="" className="">
                  Select category
                </option>
                {categories.map((cat) => (
                  <option
                    key={cat._id}
                    value={cat._id}
                    className="bg-gray-900 text-white"
                  >
                    {cat.name}
                  </option>
                ))}
              </select>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Status Toggle */}
                <div className="flex items-center gap-3 px-1">
                  <label className="text-sm text-gray-400 flex-1">
                    Status:
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((c) => ({
                        ...c,
                        status: c.status === "active" ? "inactive" : "active",
                      }))
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                      form.status === "active"
                        ? "bg-emerald-500"
                        : "bg-gray-700"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        form.status === "active"
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                  <span className="text-xs font-medium text-white w-12">
                    {form.status === "active" ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Featured Toggle */}
                <div className="flex items-center gap-3 px-1">
                  <span className="text-sm text-gray-400 flex-1">
                    Featured:
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((c) => ({ ...c, isFeatured: !c.isFeatured }))
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                      form.isFeatured ? "bg-emerald-500" : "bg-gray-700"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        form.isFeatured ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                  <span className="text-xs font-medium text-white w-12">
                    {form.isFeatured ? "Yes" : "No"}
                  </span>
                </div>
              </div>

              {/* IMAGE PREVIEW */}
              {(form.images.length > 0 || form.imageFiles.length > 0) && (
                <div className="flex flex-wrap gap-3 p-4 rounded-2xl border border-gray-700 bg-gray-950/50">
                  {form.images.map((img, idx) => (
                    <div
                      key={`img-${idx}`}
                      className="relative h-16 w-16 overflow-hidden rounded-xl border border-gray-700"
                    >
                      <img
                        src={img}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setForm((c) => ({
                            ...c,
                            images: c.images.filter((_, i) => i !== idx),
                          }))
                        }
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-bl-xl p-0.5 hover:bg-red-600 transition"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  {form.imageFiles.map((file, idx) => (
                    <div
                      key={`file-${idx}`}
                      className="relative h-16 w-16 overflow-hidden rounded-xl border border-gray-700"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setForm((c) => ({
                            ...c,
                            imageFiles: c.imageFiles.filter(
                              (_, i) => i !== idx,
                            ),
                          }))
                        }
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-bl-xl p-0.5 hover:bg-red-600 transition"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <input
                type="file"
                ref={fileInputRef}
                multiple
                accept="image/*"
                onChange={(e) =>
                  setForm((c) => ({
                    ...c,
                    imageFiles: [
                      ...c.imageFiles,
                      ...Array.from(e.target.files || []),
                    ],
                  }))
                }
                className="w-full rounded-2xl border border-dashed border-gray-700 bg-gray-950/80 px-4 py-3 text-sm text-gray-300 file:mr-4 file:rounded-xl file:border-0 file:bg-emerald-500 file:px-4 file:py-2 file:text-white cursor-pointer"
              />

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSavingProduct}
                  className="flex-1 rounded-2xl bg-emerald-500 px-4 py-3 font-semibold hover:bg-emerald-400 disabled:opacity-50 transition"
                >
                  {isSavingProduct
                    ? "Saving..."
                    : editingProductId
                      ? "Update"
                      : "Create"}
                </button>
                <button
                  onClick={resetForm}
                  type="button"
                  className="rounded-2xl border border-gray-700 px-6 py-3 hover:bg-gray-800 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </section>
      )}

      {/* 2. HEADER SECTION */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-blue-500/20 p-3 text-blue-400">
              <Package size={24} />
            </div>
            <h2 className="text-3xl font-bold">Products Management</h2>
          </div>
          <div>
            <button
              onClick={() => {
                resetForm();
                setIsModalOpen(true);
              }}
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-400 shadow-lg shadow-emerald-500/20"
            >
              <Plus size={18} />
              Add Product
            </button>
          </div>
        </div>

        {/* 3. SUMMARY CARDS (Integrated Component) */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-4">
          <SummaryCard
            title="Categories"
            value={stats.categoriesCount}
            icon={<Tag size={20} />}
            color="text-purple-400"
            bgColor="bg-purple-500/10"
          />
          <SummaryCard
            title="Total Products"
            value={stats.total}
            icon={<Package size={20} />}
            color="text-blue-400"
            bgColor="bg-blue-500/10"
          />
          <SummaryCard
            title="Active"
            value={stats.active}
            icon={<CheckCircle2 size={20} />}
            color="text-emerald-400"
            bgColor="bg-emerald-500/10"
          />
          <SummaryCard
            title="Low Stock Alert"
            value={stats.lowStock}
            icon={<AlertCircle size={20} />}
            color="text-amber-400"
            bgColor="bg-amber-500/10"
          />
        </div>
      </section>

      {/* 4. FILTERS & SEARCH */}
      <section className="flex flex-col gap-3 sm:flex-row justify-between">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-gray-700 bg-gray-900/60 py-2.5 pl-10 pr-4 text-sm text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none sm:w-60 md:w-80"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Filter
              className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className={`${selectClasses} py-2.5 pr-10 pl-10 w-full sm:w-44 text-sm border-gray-700 bg-gray-900/60`}
            >
              <option value="">Sort By</option>
              <option value="priceLowHigh">Price: Low → High</option>
              <option value="priceHighLow">Price: High → Low</option>
              <option value="stockLowHigh">Stock: Low → High</option>
              <option value="stockHighLow">Stock: High → Low</option>
              <option value="nameAZ">Name: A → Z</option>
              <option value="nameZA">Name: Z → A</option>
            </select>
          </div>
          <div className="relative">
            <Filter
              className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`${selectClasses} w-full sm:w-40 py-2.5 text-sm border-gray-700 bg-gray-900/60 pr-10 pl-10`}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="relative">
            <Filter
              className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className={`${selectClasses} py-2.5 pr-10 pl-10 w-full sm:w-34 md:w-48 text-sm border-gray-700 bg-gray-900/60`}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* 5. TABLE SECTION */}
      <section className="rounded-3xl border border-gray-800 bg-gray-900/20 backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-800/30 text-xs font-semibold uppercase tracking-wider text-gray-400">
                <th className="px-6 py-4">Product Detail</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 text-center">Sizes</th>
                <th className="px-6 py-4 text-center">Colors</th>
                <th className="px-6 py-4 text-center">Price</th>
                <th className="px-6 py-4 text-center">Stock</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {isProductsLoading ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-20 text-center text-gray-400"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                      Loading catalog...
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="py-24 text-center text-gray-400 italic"
                  >
                    No products match filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr
                    key={p._id}
                    className="group hover:bg-gray-800/20 transition-colors"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">
                          {p.images && p.images.length > 0 ? (
                            <div className="h-full w-full">
                              <img
                                src={p.images[0] || p.image}
                                className="h-full w-full object-cover"
                                alt={p.name}
                                onError={(e) => {
                                  if (!e.target.dataset.tried) {
                                    e.target.dataset.tried = "true";
                                    console.warn(
                                      "Image failed to load:",
                                      p.images[0] || p.image,
                                    );
                                  }
                                }}
                              />
                              {p.images.length > 1 && (
                                <div className="absolute bottom-0 right-0 bg-emerald-500 px-1 text-[8px] font-bold text-white shadow-sm rounded-tl-md">
                                  +{p.images.length - 1}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="flex h-full items-center justify-center text-gray-700">
                              <ImageIcon size={24} />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="truncate text-base font-bold text-gray-100 group-hover:text-emerald-400 transition-colors">
                            {p.name}
                          </span>
                          <span className="truncate text-xs text-gray-500 font-mono uppercase">
                            {p.slug || "No-Slug"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center gap-2 rounded-xl bg-gray-800/50 px-3 py-1.5 text-xs font-semibold text-gray-300 border border-gray-700/50">
                        <Layers size={14} />{" "}
                        {p.category?.name || "Uncategorized"}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {p.sizes && p.sizes.length > 0 ? (
                          p.sizes.map((s) => (
                            <span
                              key={s}
                              className="text-xs rounded bg-gray-700 px-1.5 py-0.5 text-gray-300"
                            >
                              {s}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-600 italic">
                            N/A
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-1.5 justify-center">
                        {p.colors && p.colors.length > 0 ? (
                          p.colors.map((c) => (
                            <div
                              key={c}
                              style={{ backgroundColor: c.toLowerCase() }}
                              className="group rounded px-1"
                            >
                              <span className="text-xs text-white">{c}</span>
                            </div>
                          ))
                        ) : (
                          <span className="text-xs text-gray-600 italic">
                            N/A
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center font-bold text-emerald-400 text-lg">
                      $
                      {Number(p.price).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="flex flex-col items-center">
                        <span
                          className={`text-lg font-black ${p.stockQuantity <= 5 ? "text-red-400" : "text-gray-100"}`}
                        >
                          {p.stockQuantity}
                        </span>
                        {p.stockQuantity <= 5 && (
                          <span className="text-[9px] font-black uppercase text-red-500">
                            Low Stock
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span
                        className={`inline-flex items-center rounded-full border px-4 py-1.5 text-[10px] font-black uppercase ${getStatusStyles(p.status)}`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(p)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-700 bg-gray-800/50 text-gray-400 transition hover:border-emerald-500/50 hover:text-emerald-400"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          disabled={isDeleting}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-700 bg-gray-800/50 text-gray-400 transition hover:border-red-500/50 hover:text-red-400 disabled:opacity-30"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminProductsPage;
