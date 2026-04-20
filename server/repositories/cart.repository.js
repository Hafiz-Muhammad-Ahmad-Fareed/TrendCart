import Cart from "../db/models/Cart.model.js";

const cartRepository = {
  async findByUserId(userId) {
    return Cart.findOne({ user: userId })
      .populate({
        path: "items.product",
        select: "name slug price image stockQuantity status",
      })
      .lean();
  },

  async create(userId) {
    return Cart.create({ user: userId, items: [] });
  },

  async updateByUserId(userId, data) {
    return Cart.findOneAndUpdate({ user: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    })
      .populate({
        path: "items.product",
        select: "name slug price image stockQuantity status",
      })
      .lean();
  },
};

export default cartRepository;
