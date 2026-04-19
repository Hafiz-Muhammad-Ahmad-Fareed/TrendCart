// import { useEffect, useMemo, useState } from "react";
// import { Package, Pencil, Plus, Trash2 } from "lucide-react";
// import useAdminStore from "../stores/useAdminStore";

// const emptyForm = {
//   name: "",
//   slug: "",
//   description: "",
//   price: "",
//   categoryId: "",
//   stockQuantity: "",
//   isFeatured: false,
//   status: "active",
//   image: "",
//   imageFile: null,
// };

// const AdminProductsPage = () => {
//   const {
//     categories,
//     products,
//     isCategoriesLoading,
//     isProductsLoading,
//     isSavingProduct,
//     isDeleting,
//     fetchCategories,
//     fetchProducts,
//     saveProduct,
//     deleteProduct,
//   } = useAdminStore();
//   const [form, setForm] = useState(emptyForm);
//   const [editingProductId, setEditingProductId] = useState(null);
//   const [statusFilter, setStatusFilter] = useState("");
//   const [categoryFilter, setCategoryFilter] = useState("");

//   const activeFilters = useMemo(
//     () => ({
//       status: statusFilter,
//       categoryId: categoryFilter,
//     }),
//     [categoryFilter, statusFilter],
//   );

//   useEffect(() => {
//     fetchCategories();
//   }, [fetchCategories]);

//   useEffect(() => {
//     fetchProducts(activeFilters);
//   }, [activeFilters, fetchProducts]);

//   const resetForm = () => {
//     setForm(emptyForm);
//     setEditingProductId(null);
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     const product = await saveProduct(form, editingProductId, activeFilters);

//     if (product) {
//       resetForm();
//     }
//   };

//   const handleEdit = (product) => {
//     setEditingProductId(product._id);
//     setForm({
//       name: product.name,
//       slug: product.slug,
//       description: product.description || "",
//       price: String(product.price ?? ""),
//       categoryId: product.category?._id || "",
//       stockQuantity: String(product.stockQuantity ?? ""),
//       isFeatured: Boolean(product.isFeatured),
//       status: product.status || "active",
//       image: product.image || "",
//       imageFile: null,
//     });
//   };

//   const handleDelete = async (productId) => {
//     const confirmed = window.confirm("Delete this product?");

//     if (!confirmed) {
//       return;
//     }

//     await deleteProduct(productId, activeFilters);

//     if (editingProductId === productId) {
//       resetForm();
//     }
//   };

//   return (
//     <div className="grid gap-8 xl:grid-cols-[1fr_2fr]">
//       <section className="rounded-3xl border border-gray-800 bg-gray-900/70 p-6 shadow-2xl shadow-emerald-950/20">
//         <div className="mb-6 flex items-center gap-3">
//           <div className="rounded-2xl bg-emerald-500/20 p-3 text-emerald-300">
//             <Package size={20} />
//           </div>
//           <div>
//             <h2 className="text-2xl font-semibold text-white">
//               {editingProductId ? "Edit product" : "Create product"}
//             </h2>
//             <p className="text-sm text-gray-400">
//               Control inventory, featured items, and storefront visibility.
//             </p>
//           </div>
//         </div>

//         <form className="space-y-4" onSubmit={handleSubmit}>
//           <input
//             type="text"
//             value={form.name}
//             onChange={(event) =>
//               setForm((current) => ({ ...current, name: event.target.value }))
//             }
//             placeholder="Product name"
//             className="w-full rounded-2xl border border-gray-700 bg-gray-950/80 px-4 py-3 text-white outline-none transition focus:border-emerald-500"
//           />
//           <input
//             type="text"
//             value={form.slug}
//             onChange={(event) =>
//               setForm((current) => ({ ...current, slug: event.target.value }))
//             }
//             placeholder="Slug (optional)"
//             className="w-full rounded-2xl border border-gray-700 bg-gray-950/80 px-4 py-3 text-white outline-none transition focus:border-emerald-500"
//           />
//           <textarea
//             value={form.description}
//             onChange={(event) =>
//               setForm((current) => ({
//                 ...current,
//                 description: event.target.value,
//               }))
//             }
//             rows={4}
//             placeholder="Description"
//             className="w-full rounded-2xl border border-gray-700 bg-gray-950/80 px-4 py-3 text-white outline-none transition focus:border-emerald-500"
//           />

//           <div className="grid gap-4 sm:grid-cols-2">
//             <input
//               type="number"
//               min="0"
//               step="0.01"
//               value={form.price}
//               onChange={(event) =>
//                 setForm((current) => ({
//                   ...current,
//                   price: event.target.value,
//                 }))
//               }
//               placeholder="Price"
//               className="w-full rounded-2xl border border-gray-700 bg-gray-950/80 px-4 py-3 text-white outline-none transition focus:border-emerald-500"
//             />
//             <input
//               type="number"
//               min="0"
//               value={form.stockQuantity}
//               onChange={(event) =>
//                 setForm((current) => ({
//                   ...current,
//                   stockQuantity: event.target.value,
//                 }))
//               }
//               placeholder="Stock quantity"
//               className="w-full rounded-2xl border border-gray-700 bg-gray-950/80 px-4 py-3 text-white outline-none transition focus:border-emerald-500"
//             />
//           </div>

//           <select
//             value={form.categoryId}
//             onChange={(event) =>
//               setForm((current) => ({
//                 ...current,
//                 categoryId: event.target.value,
//               }))
//             }
//             className="w-full rounded-2xl border border-gray-700 bg-gray-950/80 px-4 py-3 text-white outline-none transition focus:border-emerald-500"
//           >
//             <option value="">Select category</option>
//             {categories.map((category) => (
//               <option key={category._id} value={category._id}>
//                 {category.name}
//               </option>
//             ))}
//           </select>

//           <div className="grid gap-4 sm:grid-cols-2">
//             <select
//               value={form.status}
//               onChange={(event) =>
//                 setForm((current) => ({
//                   ...current,
//                   status: event.target.value,
//                 }))
//               }
//               className="w-full rounded-2xl border border-gray-700 bg-gray-950/80 px-4 py-3 text-white outline-none transition focus:border-emerald-500"
//             >
//               <option value="active">Active</option>
//               <option value="inactive">Inactive</option>
//             </select>

//             <label className="flex items-center gap-3 rounded-2xl border border-gray-800 bg-gray-950/70 px-4 py-3 text-sm text-gray-300">
//               <input
//                 type="checkbox"
//                 checked={form.isFeatured}
//                 onChange={(event) =>
//                   setForm((current) => ({
//                     ...current,
//                     isFeatured: event.target.checked,
//                   }))
//                 }
//                 className="h-4 w-4 accent-emerald-500"
//               />
//               Featured product
//             </label>
//           </div>

//           <input
//             type="file"
//             accept="image/*"
//             onChange={(event) =>
//               setForm((current) => ({
//                 ...current,
//                 imageFile: event.target.files?.[0] || null,
//               }))
//             }
//             className="w-full rounded-2xl border border-dashed border-gray-700 bg-gray-950/80 px-4 py-3 text-sm text-gray-300 file:mr-4 file:rounded-xl file:border-0 file:bg-emerald-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
//           />

//           {form.image && !form.imageFile ? (
//             <img
//               src={form.image}
//               alt={form.name || "Product preview"}
//               className="h-40 w-full rounded-2xl object-cover"
//             />
//           ) : null}

//           <div className="flex gap-3">
//             <button
//               type="submit"
//               disabled={isSavingProduct || isCategoriesLoading}
//               className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
//             >
//               <Plus size={18} />
//               {isSavingProduct
//                 ? "Saving..."
//                 : editingProductId
//                   ? "Update product"
//                   : "Create product"}
//             </button>

//             {editingProductId ? (
//               <button
//                 type="button"
//                 onClick={resetForm}
//                 className="rounded-2xl border border-gray-700 px-4 py-3 font-semibold text-gray-200 transition hover:border-gray-500"
//               >
//                 Cancel
//               </button>
//             ) : null}
//           </div>
//         </form>
//       </section>

//       <section className="rounded-3xl border border-gray-800 bg-gray-900/70 p-6 shadow-2xl shadow-emerald-950/20">
//         <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
//           <div>
//             <h2 className="text-2xl font-semibold text-white">Products</h2>
//             <p className="text-sm text-gray-400">
//               Filter products by category and status while managing inventory.
//             </p>
//           </div>

//           <div className="grid gap-3 sm:grid-cols-2">
//             <select
//               value={statusFilter}
//               onChange={(event) => setStatusFilter(event.target.value)}
//               className="rounded-2xl border border-gray-700 bg-gray-950/80 px-4 py-3 text-white outline-none transition focus:border-emerald-500"
//             >
//               <option value="">All statuses</option>
//               <option value="active">Active</option>
//               <option value="inactive">Inactive</option>
//             </select>
//             <select
//               value={categoryFilter}
//               onChange={(event) => setCategoryFilter(event.target.value)}
//               className="rounded-2xl border border-gray-700 bg-gray-950/80 px-4 py-3 text-white outline-none transition focus:border-emerald-500"
//             >
//               <option value="">All categories</option>
//               {categories.map((category) => (
//                 <option key={category._id} value={category._id}>
//                   {category.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {isProductsLoading ? (
//           <p className="text-gray-400">Loading products...</p>
//         ) : products.length === 0 ? (
//           <div className="rounded-3xl border border-dashed border-gray-700 bg-gray-950/40 p-10 text-center text-gray-400">
//             No products found for the selected filters.
//           </div>
//         ) : (
//           <div className="overflow-x-auto rounded-2xl border border-gray-800 bg-gray-950/40">
//             <table className="w-full text-left border-collapse">
//               <thead className="bg-gray-900/50 text-xs font-semibold uppercase tracking-wider text-gray-400">
//                 <tr>
//                   <th className="px-6 py-4">Product</th>
//                   <th className="px-6 py-4">Category</th>
//                   <th className="px-6 py-4">Price</th>
//                   <th className="px-6 py-4">Stock</th>
//                   <th className="px-6 py-4">Status</th>
//                   <th className="px-6 py-4 text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-800/50">
//                 {products.map((product) => (
//                   <tr
//                     key={product._id}
//                     className="group transition hover:bg-emerald-500/5"
//                   >
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-4">
//                         <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl ring-1 ring-gray-700">
//                           {product.image ? (
//                             <img
//                               src={product.image}
//                               alt={product.name}
//                               className="h-full w-full object-cover"
//                             />
//                           ) : (
//                             <div className="flex h-full w-full items-center justify-center bg-gray-800 text-gray-500">
//                               <Package size={20} />
//                             </div>
//                           )}
//                         </div>
//                         <div className="max-w-[180px]">
//                           <div className="flex items-center gap-2">
//                             <span className="font-medium text-white truncate">
//                               {product.name}
//                             </span>
//                             {product.isFeatured && (
//                               <span
//                                 className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]"
//                                 title="Featured Item"
//                               />
//                             )}
//                           </div>
//                           <div className="text-xs text-gray-500 truncate">
//                             {product.slug}
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-300">
//                       {product.category?.name || "Uncategorized"}
//                     </td>
//                     <td className="px-6 py-4 text-sm font-medium text-emerald-400">
//                       ${Number(product.price).toFixed(2)}
//                     </td>
//                     <td className="px-6 py-4">
//                       <span
//                         className={`text-sm ${product.stockQuantity <= 5 ? "text-red-400 font-bold" : "text-gray-300"}`}
//                       >
//                         {product.stockQuantity}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <span
//                         className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
//                           product.status === "active"
//                             ? "bg-emerald-500/15 text-emerald-400"
//                             : "bg-gray-700/50 text-gray-400"
//                         }`}
//                       >
//                         {product.status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 text-right">
//                       <div className="flex justify-end gap-2">
//                         <button
//                           onClick={() => handleEdit(product)}
//                           className="p-2 text-gray-400 transition hover:text-emerald-400 hover:bg-emerald-400/10 rounded-lg"
//                           title="Edit Product"
//                         >
//                           <Pencil size={18} />
//                         </button>
//                         <button
//                           onClick={() => handleDelete(product._id)}
//                           disabled={isDeleting}
//                           className="p-2 text-gray-400 transition hover:text-red-400 hover:bg-red-400/10 rounded-lg disabled:opacity-30"
//                           title="Delete Product"
//                         >
//                           <Trash2 size={18} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </section>
//     </div>
//   );
// };

// export default AdminProductsPage;

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
      image: product.image || "",
      imageFile: null,
    });
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Delete this product?")) return;
    await deleteProduct(productId, activeFilters);
    if (editingProductId === productId) resetForm();
  };

  // Reusable tailwind classes for the stylized dropdown
  const selectClasses = `w-full appearance-none rounded-2xl border border-gray-700 bg-gray-950/80 px-4 py-3 outline-none transition focus:border-emerald-500 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_1rem_center] bg-no-repeat`;

  return (
    <div className="grid gap-8 xl:grid-cols-[1fr_2fr]">
      {/* LEFT SECTION: FORM */}
      <section className="rounded-3xl border border-gray-800 bg-gray-900/70 p-6 shadow-2xl shadow-emerald-950/20">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-2xl bg-emerald-500/20 p-3 text-emerald-300">
            <Package size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-white">
              {editingProductId ? "Edit product" : "Create product"}
            </h2>
            <p className="text-sm text-gray-400">Manage catalog details.</p>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((c) => ({ ...c, name: e.target.value }))}
            placeholder="Product name"
            className="w-full rounded-2xl border border-gray-700 bg-gray-950/80 px-4 py-3 text-white outline-none transition focus:border-emerald-500"
          />
          <input
            type="text"
            value={form.slug}
            onChange={(e) => setForm((c) => ({ ...c, slug: e.target.value }))}
            placeholder="Slug (optional)"
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
              type="number"
              value={form.price}
              onChange={(e) =>
                setForm((c) => ({ ...c, price: e.target.value }))
              }
              placeholder="Price"
              className="w-full rounded-2xl border border-gray-700 bg-gray-950/80 px-4 py-3 text-white outline-none transition focus:border-emerald-500"
            />
            <input
              type="number"
              value={form.stockQuantity}
              onChange={(e) =>
                setForm((c) => ({ ...c, stockQuantity: e.target.value }))
              }
              placeholder="Stock"
              className="w-full rounded-2xl border border-gray-700 bg-gray-950/80 px-4 py-3 text-white outline-none transition focus:border-emerald-500"
            />
          </div>

          <select
            value={form.categoryId}
            onChange={(e) =>
              setForm((c) => ({ ...c, categoryId: e.target.value }))
            }
            className={`${selectClasses} ${!form.categoryId ? "text-gray-500" : "text-white"}`}
          >
            <option value="" className="bg-gray-900">
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
            <select
              value={form.status}
              onChange={(e) =>
                setForm((c) => ({ ...c, status: e.target.value }))
              }
              className={`${selectClasses} text-white`}
            >
              <option value="active" className="bg-gray-900">
                Active
              </option>
              <option value="inactive" className="bg-gray-900">
                Inactive
              </option>
            </select>

            <label className="flex items-center gap-3 rounded-2xl border border-gray-700 bg-gray-950/80 px-4 py-3 text-sm text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) =>
                  setForm((c) => ({ ...c, isFeatured: e.target.checked }))
                }
                className="h-5 w-5 accent-emerald-500 rounded border-gray-700 bg-gray-900"
              />
              Featured
            </label>
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setForm((c) => ({ ...c, imageFile: e.target.files?.[0] || null }))
            }
            className="w-full rounded-2xl border border-dashed border-gray-700 bg-gray-950/80 px-4 py-3 text-sm text-gray-300 file:mr-4 file:rounded-xl file:border-0 file:bg-emerald-500 file:px-4 file:py-2 file:text-white"
          />

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSavingProduct}
              className="flex-1 rounded-2xl bg-emerald-500 px-4 py-3 font-semibold text-white hover:bg-emerald-400 disabled:opacity-50 transition"
            >
              {isSavingProduct
                ? "Saving..."
                : editingProductId
                  ? "Update"
                  : "Create"}
            </button>
            {editingProductId && (
              <button
                onClick={resetForm}
                type="button"
                className="rounded-2xl border border-gray-700 px-4 py-3 text-gray-200"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      {/* RIGHT SECTION: TABLE */}
      <section className="rounded-3xl border border-gray-800 bg-gray-900/70 p-6 shadow-2xl shadow-emerald-950/20">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-2xl font-semibold text-white">Products</h2>
          {/* Filters Container */}
          <div className="flex flex-row items-center gap-3">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`${selectClasses} text-sm py-2 pl-4 pr-10 w-auto min-w-[130px] text-white`}
              >
                <option value="" className="bg-gray-900">
                  All Status
                </option>
                <option value="active" className="bg-gray-900">
                  Active
                </option>
                <option value="inactive" className="bg-gray-900">
                  Inactive
                </option>
              </select>
            </div>

            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className={`${selectClasses} text-sm py-2 pl-4 pr-10 w-auto min-w-[150px] text-white`}
              >
                <option value="" className="bg-gray-900">
                  All Categories
                </option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id} className="bg-gray-900">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {isProductsLoading ? (
          <p className="text-gray-400">Loading...</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-gray-800 bg-gray-950/40">
            <table className="w-full text-left">
              <thead className="bg-gray-900/50 text-xs font-semibold uppercase text-gray-400">
                <tr>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50 text-sm">
                {products.map((p) => (
                  <tr
                    key={p._id}
                    className="group hover:bg-emerald-500/5 transition"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          className="h-10 w-10 rounded-lg object-cover ring-1 ring-gray-700"
                          alt=""
                        />
                        <span className="font-medium text-white">
                          {p.name}
                          {p.isFeatured && (
                            <span className="ml-2 inline-block h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]" />
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {p.category?.name}
                    </td>
                    <td className="px-6 py-4 text-emerald-400 font-medium">
                      ${Number(p.price).toFixed(2)}
                    </td>
                    <td
                      className={`px-6 py-4 ${p.stockQuantity <= 5 ? "text-red-400 font-bold" : "text-gray-300"}`}
                    >
                      {p.stockQuantity}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${p.status === "active" ? "bg-emerald-500/15 text-emerald-400" : "bg-gray-700 text-gray-400"}`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(p)}
                          className="p-2 text-gray-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          disabled={isDeleting}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminProductsPage;
