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
          <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
            {categories.length} total
          </div>
        </div>

        {isCategoriesLoading ? (
          <p className="text-gray-400">Loading categories...</p>
        ) : categories.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-700 bg-gray-950/40 p-10 text-center text-gray-400">
            No categories yet. Create the first one from the form.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {categories.map((category) => (
              <article
                key={category._id}
                className="overflow-hidden rounded-3xl border border-gray-800 bg-gray-950/60"
              >
                <div className="h-44 w-full bg-gradient-to-br from-emerald-700/40 to-gray-950">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>

                <div className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-400">{category.slug}</p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        category.isActive
                          ? "bg-emerald-500/15 text-emerald-300"
                          : "bg-gray-700 text-gray-300"
                      }`}
                    >
                      {category.isActive ? "Active" : "Hidden"}
                    </span>
                  </div>

                  <p className="min-h-12 text-sm text-gray-300">
                    {category.description || "No description yet."}
                  </p>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleEdit(category)}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-gray-700 px-4 py-2 text-sm font-semibold text-gray-100 transition hover:border-emerald-500 hover:text-emerald-300"
                    >
                      <Pencil size={16} />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(category._id)}
                      disabled={isDeleting}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-red-500/40 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminCategoriesPage;
