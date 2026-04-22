import reviewRepository from "../repositories/review.repository.js";
import orderRepository from "../repositories/order.repository.js";
import ApiError from "../utils/api_error.js";

class ReviewService {
  async createReview(userId, productId, rating, comment) {
    // 1. Check if user has purchased the product
    const hasPurchased = await orderRepository.hasPurchasedProduct(userId, productId);
    if (!hasPurchased) {
      throw new ApiError(403, "You can only review products you have purchased.");
    }

    // 2. Check if user has already reviewed the product
    const existingReview = await reviewRepository.findOne({ user: userId, product: productId });
    if (existingReview) {
      throw new ApiError(400, "You have already reviewed this product.");
    }

    // 3. Create the review
    return await reviewRepository.create({
      user: userId,
      product: productId,
      rating,
      comment,
    });
  }

  async getProductReviews(productId) {
    return await reviewRepository.findByProductId(productId);
  }

  async checkCanReview(userId, productId) {
    if (!userId) return false;
    
    const hasPurchased = await orderRepository.hasPurchasedProduct(userId, productId);
    if (!hasPurchased) return false;

    const existingReview = await reviewRepository.findOne({ user: userId, product: productId });
    return !existingReview;
  }
}

export default new ReviewService();
