import { useEffect, useState } from "react";
import { Pencil, Plus, Tag, Trash2 } from "lucide-react";
import useAdminStore from "../stores/useAdminStore";

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  isActive: true,
  image: "",
  imageFile: null,
};

const AdminCategoriesPage = () => {
  const {
    categories,
    isCategoriesLoading,
    isSavingCategory,
    isDeleting,
    fetchCategories,
    saveCategory,
    deleteCategory,
  } = useAdminStore();
  const [form, setForm] = useState(emptyForm);
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingCategoryId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const category = await saveCategory(form, editingCategoryId);

    if (category) {
      resetForm();
    }
  };

  const handleEdit = (category) => {
    setEditingCategoryId(category._id);
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      isActive: category.isActive,
      image: category.image || "",
      imageFile: null,
    });
  };

  const handleDelete = async (categoryId) => {
    const confirmed = window.confirm(
      "Delete this category? Its linked products will also be removed.",
    );

    if (!confirmed) {
      return;
    }

    await deleteCategory(categoryId);

    if (editingCategoryId === categoryId) {
      resetForm();
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[380px_minmax(0,1fr)]">
      <section className="rounded-3xl border border-gray-800 bg-gray-900/70 p-6 shadow-2xl shadow-emerald-950/20">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-2xl bg-emerald-500/20 p-3 text-emerald-300">
            <Tag size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-white">
              {editingCategoryId ? "Edit category" : "Create category"}
            </h2>
            <p className="text-sm text-gray-400">
              Add storefront sections and keep the catalog organized.
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
            placeholder="Category name"
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
            placeholder="Description"
            rows={4}
            className="w-full rounded-2xl border border-gray-700 bg-gray-950/80 px-4 py-3 text-white outline-none transition focus:border-emerald-500"
          />
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
              alt={form.name || "Category preview"}
              className="h-40 w-full rounded-2xl object-cover"
            />
          ) : null}

          <label className="flex items-center gap-3 rounded-2xl border border-gray-800 bg-gray-950/70 px-4 py-3 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  isActive: event.target.checked,
                }))
              }
              className="h-4 w-4 accent-emerald-500"
            />
            Visible on the public storefront
          </label>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSavingCategory}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Plus size={18} />
              {isSavingCategory
                ? "Saving..."
                : editingCategoryId
                  ? "Update category"
                  : "Create category"}
            </button>

            {editingCategoryId ? (
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
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">Categories</h2>
            <p className="text-sm text-gray-400">
              Every category here drives the public homepage.
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-950/40">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-900/50 text-xs font-semibold uppercase tracking-wider text-gray-400">
              <tr>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {isCategoriesLoading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-20 text-center text-gray-400"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                      Loading categories...
                    </div>
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-20 text-center text-gray-400"
                  >
                    No categories found.
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr
                    key={category._id}
                    className="group transition hover:bg-emerald-500/5"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {category.image ? (
                          <img
                            src={category.image}
                            alt={category.name}
                            className="h-12 w-12 rounded-xl object-cover ring-1 ring-gray-700"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-800 text-gray-500">
                            <Tag size={20} />
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-white">
                            {category.name}
                          </div>
                          <div className="text-xs text-gray-500 line-clamp-1 max-w-[200px]">
                            {category.description || "No description"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400 font-mono">
                      /{category.slug}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          category.isActive
                            ? "bg-emerald-500/15 text-emerald-400"
                            : "bg-gray-700/50 text-gray-400"
                        }`}
                      >
                        {category.isActive ? "Active" : "Hidden"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="p-2 text-gray-400 transition hover:text-emerald-400 hover:bg-emerald-400/10 rounded-lg"
                          title="Edit Category"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(category._id)}
                          disabled={isDeleting}
                          className="p-2 text-gray-400 transition hover:text-red-400 hover:bg-red-400/10 rounded-lg disabled:opacity-30"
                          title="Delete Category"
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

export default AdminCategoriesPage;
