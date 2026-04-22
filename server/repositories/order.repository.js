import Order from "../db/models/Order.model.js";

const orderRepository = {
  async create(data) {
    return Order.create(data);
  },

  async findBySessionId(sessionId) {
    return Order.findOne({ stripeSessionId: sessionId });
  },

  async updateById(id, data) {
    return Order.findByIdAndUpdate(id, data, { new: true }).lean();
  },

  async findByUserId(userId) {
    return Order.find({ user: userId }).sort({ createdAt: -1 }).lean();
  },
  async findAll(filters = {}) {
    const query = {};

    if (filters.startDate && filters.endDate) {
      query.createdAt = {
        $gte: filters.startDate,
        $lte: filters.endDate,
      };
    }

    return Order.find(query)
      .populate("user", "fullName email")
      .sort({ createdAt: -1 })
      .lean();
  },
  async findById(id) {
    return Order.findById(id).populate("user", "fullName email").lean();
  },
  async hasPurchasedProduct(userId, productId) {
    const order = await Order.findOne({
      user: userId,
      "items.product": productId,
      paymentStatus: "paid",
    });
    return !!order;
  },
};

export default orderRepository;
