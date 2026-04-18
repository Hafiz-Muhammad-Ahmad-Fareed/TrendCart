import User from "../db/models/User.model.js";

const userRepository = {
  async findByClerkId(clerkId) {
    return User.findOne({ clerkId }).lean();
  },

  async countDocuments() {
    return User.countDocuments();
  },
};

export default userRepository;
