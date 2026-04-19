import User from "../db/models/User.model.js";

const userRepository = {
  async findAll() {
    return User.find().sort({ createdAt: -1 }).lean();
  },

  async findById(id) {
    return User.findById(id).lean();
  },

  async findByClerkId(clerkId) {
    return User.findOne({ clerkId }).lean();
  },

  async updateById(id, data) {
    return User.findByIdAndUpdate(id, data, { new: true }).lean();
  },

  async deleteById(id) {
    return User.findByIdAndDelete(id).lean();
  },

  async countDocuments() {
    return User.countDocuments();
  },
};

export default userRepository;
