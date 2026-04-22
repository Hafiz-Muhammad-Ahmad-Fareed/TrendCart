import { Star } from "lucide-react";

const StarRating = ({ rating, onRatingChange, readOnly = false }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => !readOnly && onRatingChange(star)}
          className={`${readOnly ? "cursor-default" : "cursor-pointer"} transition-colors`}
        >
          <Star
            size={20}
            className={`${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-600"
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
