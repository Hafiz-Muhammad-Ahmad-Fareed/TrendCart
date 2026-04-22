import Review from "../db/models/Review.model.js";
import Product from "../db/models/Product.model.js";

class ReviewRepository {
  async create(reviewData) {
    const review = await Review.create(reviewData);
    await this.updateProductRating(review.product);
    return review;
  }

  async findByProductId(productId) {
    return await Review.find({ product: productId })
      .populate("user", "fullName profileImage")
      .sort({ createdAt: -1 });
  }

  async findOne(filter) {
    return await Review.findOne(filter);
  }

  async updateProductRating(productId) {
    const reviews = await Review.find({ product: productId });
    const numReviews = reviews.length;
    const averageRating =
      numReviews > 0
        ? reviews.reduce((acc, item) => item.rating + acc, 0) / numReviews
        : 0;

    await Product.findByIdAndUpdate(productId, {
      averageRating,
      numReviews,
    });
  }
}

export default new ReviewRepository();
