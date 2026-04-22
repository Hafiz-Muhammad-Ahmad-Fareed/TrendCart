import { useState, useEffect } from "react";
import useReviewStore from "../stores/useReviewStore";
import StarRating from "./StarRating";
import { MessageSquare, User } from "lucide-react";

const ReviewSection = ({ productId }) => {
  const { reviews, fetchReviews, addReview, canReview, checkCanReview, isLoading } = useReviewStore();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (productId) {
      fetchReviews(productId);
      checkCanReview(productId);
    }
  }, [productId, fetchReviews, checkCanReview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    await addReview(productId, rating, comment);
    setComment("");
    setRating(5);
  };

  return (
    <div className="mt-24">
      <div className="mb-10 flex items-center gap-3">
        <MessageSquare className="text-emerald-400" size={28} />
        <h2 className="text-3xl font-bold">Customer Reviews</h2>
      </div>

      <div className="grid gap-12 lg:grid-cols-3">
        {/* Review Form */}
        <div className="lg:col-span-1">
          {canReview ? (
            <div className="rounded-3xl border border-gray-800 bg-gray-900/50 p-6 shadow-xl">
              <h3 className="mb-6 text-xl font-bold">Write a Review</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-400">
                    Rating
                  </label>
                  <StarRating rating={rating} onRatingChange={setRating} />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-400">
                    Your Review
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    className="w-full rounded-xl border border-gray-800 bg-gray-950 p-4 text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    placeholder="Share your thoughts about the product..."
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-xl bg-emerald-600 py-3 font-bold text-white transition hover:bg-emerald-500 disabled:opacity-50"
                >
                  {isLoading ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </div>
          ) : (
            <div className="rounded-3xl border border-gray-800 bg-gray-900/50 p-6 text-center shadow-xl">
              <p className="text-gray-400">
                Only verified purchasers can leave a review.
              </p>
            </div>
          )}
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div
                  key={review._id}
                  className="rounded-3xl border border-gray-800 bg-gray-900/30 p-6 transition hover:bg-gray-900/50"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 overflow-hidden">
                        {review.user?.profileImage ? (
                          <img
                            src={review.user.profileImage}
                            alt={review.user.fullName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <User size={20} className="text-gray-500" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-white">
                          {review.user?.fullName || "Anonymous"}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <StarRating rating={review.rating} readOnly />
                  </div>
                  <p className="leading-relaxed text-gray-300">
                    {review.comment}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-gray-800 p-12 text-center">
                <p className="text-gray-500 italic">No reviews yet. Be the first to review!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewSection;
