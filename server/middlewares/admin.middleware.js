import userRepository from "../repositories/user.repository.js";

const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await userRepository.findByClerkId(req.user.id);

    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    req.localUser = user;
    next();
  } catch (error) {
    next(error);
  }
};

export default requireAdmin;
