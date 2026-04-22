import asyncHandler from "../utils/async_handler.js";
import reviewService from "../services/review.service.js";
import ApiResponse from "../utils/api_response.js";
import userRepository from "../repositories/user.repository.js";

export const createReview = asyncHandler(async (req, res) => {
  const { productId, rating, comment } = req.body;
  const clerkId = req.auth.userId;

  const user = await userRepository.findByClerkId(clerkId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const review = await reviewService.createReview(user._id, productId, rating, comment);

  return res
    .status(201)
    .json(new ApiResponse(201, review, "Review created successfully"));
});

export const getProductReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const reviews = await reviewService.getProductReviews(productId);

  return res
    .status(200)
    .json(new ApiResponse(200, reviews, "Reviews fetched successfully"));
});

export const checkCanReview = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const clerkId = req.auth.userId;

  if (!clerkId) {
    return res
      .status(200)
      .json(new ApiResponse(200, { canReview: false }, "User not logged in"));
  }

  const user = await userRepository.findByClerkId(clerkId);
  if (!user) {
    return res
      .status(200)
      .json(new ApiResponse(200, { canReview: false }, "User not found"));
  }

  const canReview = await reviewService.checkCanReview(user._id, productId);

  return res
    .status(200)
    .json(new ApiResponse(200, { canReview }, "Can review status fetched"));
});
