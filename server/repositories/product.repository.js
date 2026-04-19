import Product from "../db/models/Product.model.js";

const productRepository = {
  async countDocuments(filter = {}) {
    return Product.countDocuments(filter);
  },

  async findAll(filters = {}) {
    const query = {};

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.categoryId) {
      query.category = filters.categoryId;
    }

    return Product.find(query)
      .populate({
        path: "category",
        select: "name slug isActive",
      })
      .sort({ createdAt: -1 })
      .lean();
  },

  async findPublicByCategoryId(categoryId) {
    return Product.find({
      category: categoryId,
      status: "active",
    })
      .sort({ createdAt: -1 })
      .lean();
  },

  async findById(id) {
    return Product.findById(id)
      .populate({
        path: "category",
        select: "name slug isActive",
      })
      .lean();
  },

  async findBySlug(slug) {
    return Product.findOne({ slug })
      .populate({
        path: "category",
        select: "name slug isActive",
      })
      .lean();
  },

  async findSimilar(categoryId, currentProductId, limit = 4) {
    return Product.find({
      category: categoryId,
      _id: { $ne: currentProductId },
      status: "active",
    })
      .limit(limit)
      .lean();
  },

  async existsBySlug(slug, excludeId) {
    const filter = { slug };

    if (excludeId) {
      filter._id = { $ne: excludeId };
    }

    return Boolean(await Product.exists(filter));
  },

  async create(data) {
    return Product.create(data);
  },

  async updateById(id, data) {
    return Product.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    })
      .populate({
        path: "category",
        select: "name slug isActive",
      })
      .lean();
  },

  async deleteById(id) {
    return Product.findByIdAndDelete(id).lean();
  },

  async deleteManyByCategoryId(categoryId) {
    return Product.deleteMany({ category: categoryId });
  },
};

export default productRepository;
