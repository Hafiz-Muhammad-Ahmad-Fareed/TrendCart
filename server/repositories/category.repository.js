import Category from "../db/models/Category.model.js";

const categoryRepository = {
  async countDocuments(filter = {}) {
    return Category.countDocuments(filter);
  },

  async findAll() {
    return Category.find().sort({ createdAt: -1 }).lean();
  },

  async findPublic() {
    return Category.find({ isActive: true }).sort({ name: 1 }).lean();
  },

  async findById(id) {
    return Category.findById(id).lean();
  },

  async findBySlug(slug) {
    return Category.findOne({ slug }).lean();
  },

  async existsBySlug(slug, excludeId) {
    const filter = { slug };

    if (excludeId) {
      filter._id = { $ne: excludeId };
    }

    return Boolean(await Category.exists(filter));
  },

  async create(data) {
    return Category.create(data);
  },

  async updateById(id, data) {
    return Category.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();
  },

  async deleteById(id) {
    return Category.findByIdAndDelete(id).lean();
  },
};

export default categoryRepository;
