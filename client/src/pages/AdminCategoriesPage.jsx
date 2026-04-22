import { useEffect, useState, useRef, useMemo } from "react";
import {
  Pencil,
  Plus,
  Tag,
  Trash2,
  X,
  Search,
  CheckCircle2,
  EyeOff,
  LayoutGrid,
  ChevronDown,
  Filter,
} from "lucide-react";
import useAdminStore from "../stores/useAdminStore";
import useOnClickOutside from "../hooks/useOnClickOutside";
import SummaryCard from "../components/SummaryCard";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fileInputRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Derived Stats for Categories
  const categoryStats = useMemo(
    () => ({
      total: categories.length,
      active: categories.filter((c) => c.isActive).length,
      hidden: categories.filter((c) => !c.isActive).length,
    }),
    [categories],
  );

  const filteredCategories = categories.filter((category) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      category.name.toLowerCase().includes(searchLower) ||
      category.slug.toLowerCase().includes(searchLower);

    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
          ? category.isActive
          : !category.isActive;

    return matchesSearch && matchesStatus;
  });

  const resetForm = () => {
    setForm(emptyForm);
    setEditingCategoryId(null);
    setIsModalOpen(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const category = await saveCategory(form, editingCategoryId);
    if (category) resetForm();
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
    setIsModalOpen(true);
  };

  const handleDelete = async (categoryId) => {
    const confirmed = window.confirm(
      "Delete this category? Its linked products will also be removed.",
    );
    if (!confirmed) return;
    await deleteCategory(categoryId);
    if (editingCategoryId === categoryId) resetForm();
  };

  useOnClickOutside(modalRef, () => {
    if (isModalOpen) resetForm();
  });

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
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-blue-500/20 p-3 text-blue-400">
            <Tag size={24} />
          </div>
          <h2 className="text-3xl font-bold">Categories Management</h2>
        </div>

        <div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-400 shadow-lg shadow-emerald-500/20"
          >
            <Plus size={18} />
            Add Category
          </button>
        </div>
      </div>

      {/* Summary Stats Section */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          title="Total Categories"
          value={categoryStats.total}
          icon={<LayoutGrid size={20} />}
          color="text-blue-400"
          bgColor="bg-blue-500/10"
          isLoading={isCategoriesLoading}
        />
        <SummaryCard
          title="Active Categories"
          value={categoryStats.active}
          icon={<CheckCircle2 size={20} />}
          color="text-emerald-400"
          bgColor="bg-emerald-500/10"
          isLoading={isCategoriesLoading}
        />
        <SummaryCard
          title="Hidden Categories"
          value={categoryStats.hidden}
          icon={<EyeOff size={20} />}
          color="text-gray-400"
          bgColor="bg-gray-500/10"
          isLoading={isCategoriesLoading}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row justify-between">
        <div className="relative">
          <Search
            className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-gray-700 bg-gray-900/60 py-2.5 pr-4 pl-10 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none sm:w-80"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 relative">
          <Filter
            className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full appearance-none rounded-xl border border-gray-700 bg-gray-900/60 py-2.5 pr-10 pl-10 text-sm text-white focus:border-emerald-500 outline-none sm:w-48"
          >
            <option value="all">All Categories</option>
            <option value="active">Active Only</option>
            <option value="hidden">Hidden Only</option>
          </select>
          <ChevronDown
            className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
            size={16}
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-3xl border border-gray-800 bg-gray-900/40 backdrop-blur-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-800/30 text-xs font-semibold uppercase tracking-wider text-gray-400">
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {isCategoriesLoading ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-20 text-center text-gray-400"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                      Loading categories...
                    </div>
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-20 text-center text-gray-400 italic"
                  >
                    No categories found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => (
                  <tr
                    key={category._id}
                    className="group transition hover:bg-gray-800/30"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        {category.image ? (
                          <img
                            src={category.image}
                            alt=""
                            className="h-12 w-12 rounded-xl object-cover ring-1 ring-gray-700"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-800 text-gray-500">
                            <Tag size={20} />
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-white">
                            {category.name}
                          </span>
                          <span className="text-xs text-gray-500 line-clamp-1 max-w-[250px]">
                            {category.description}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="font-mono text-xs text-gray-400">
                        /{category.slug}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div
                        className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-semibold capitalize ${
                          category.isActive
                            ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                            : "text-gray-400 bg-gray-500/10 border-gray-500/20"
                        }`}
                      >
                        {category.isActive ? "Active" : "Hidden"}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-700 bg-gray-800/50 text-gray-400 transition hover:border-emerald-500/50 hover:text-emerald-400"
                          title="Edit"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(category._id)}
                          disabled={isDeleting}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-700 bg-gray-800/50 text-gray-400 transition hover:border-red-500/50 hover:text-red-400 disabled:opacity-30"
                          title="Delete"
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
      </div>

      {/* Category Modal Section */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <section
            ref={modalRef}
            className="custom-scrollbar mt-15 overflow-y-auto flex flex-col w-full max-w-md max-h-[80vh] rounded-3xl border border-gray-800 bg-gray-900 p-6 shadow-2xl animate-in fade-in zoom-in duration-200"
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-emerald-500/20 p-3 text-emerald-300">
                  <Tag size={20} />
                </div>
                <h2 className="text-2xl font-semibold text-white">
                  {editingCategoryId ? "Edit Category" : "Create Category"}
                </h2>
              </div>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-white transition"
              >
                <X size={24} />
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Category name"
                className="w-full rounded-2xl border border-gray-700 bg-gray-950/80 px-4 py-3 text-white outline-none focus:border-emerald-500 transition"
              />
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="Slug (optional)"
                className="w-full rounded-2xl border border-gray-700 bg-gray-950/80 px-4 py-3 text-white outline-none focus:border-emerald-500 transition"
              />
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Description"
                rows={3}
                className="w-full rounded-2xl border border-gray-700 bg-gray-950/80 px-4 py-3 text-white outline-none focus:border-emerald-500 transition"
              />

              <div className="flex items-center gap-3 px-1">
                <label className="text-sm text-gray-400">
                  Category Status:
                </label>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, isActive: !form.isActive })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    form.isActive ? "bg-emerald-500" : "bg-gray-700"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      form.isActive ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className="text-xs font-medium text-white">
                  {form.isActive ? "Active" : "Hidden"}
                </span>
              </div>

              {(form.image || form.imageFile) && (
                <div className="flex items-center gap-4 p-3 rounded-2xl border border-gray-700 bg-gray-950/50">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-gray-700">
                    <img
                      src={
                        form.imageFile
                          ? URL.createObjectURL(form.imageFile)
                          : form.image
                      }
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-xs font-medium text-white">
                      Category Image
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setForm((prev) => ({
                          ...prev,
                          image: "",
                          imageFile: null,
                        }));
                        if (fileInputRef.current)
                          fileInputRef.current.value = "";
                      }}
                      className="text-xs text-red-400 hover:text-red-300 transition w-fit mt-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setForm({ ...form, imageFile: e.target.files?.[0] || null })
                }
                className="w-full rounded-2xl border border-dashed border-gray-700 bg-gray-950/80 px-4 py-3 text-sm text-gray-300 file:mr-4 file:rounded-xl file:border-0 file:bg-emerald-500 file:px-3 file:py-1 file:text-white cursor-pointer hover:border-emerald-500/50 transition"
              />

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSavingCategory}
                  className="flex-1 rounded-2xl bg-emerald-500 py-3 font-semibold text-white hover:bg-emerald-400 disabled:opacity-60 transition"
                >
                  {isSavingCategory
                    ? "Saving..."
                    : editingCategoryId
                      ? "Update"
                      : "Create"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-2xl border border-gray-700 px-6 py-3 font-semibold text-gray-200 hover:bg-gray-800 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
};

export default AdminCategoriesPage;
