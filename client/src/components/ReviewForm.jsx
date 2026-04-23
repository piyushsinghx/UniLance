import { useState } from 'react';
import { Star, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from './Button';
import { createReview } from '../services/reviewService';

const ReviewForm = ({ gigId, gigTitle, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    if (!comment.trim()) {
      toast.error('Please write a review');
      return;
    }

    try {
      setLoading(true);
      await createReview({ gigId, rating, comment: comment.trim() });
      toast.success('Review submitted successfully!');
      setRating(0);
      setComment('');
      if (onReviewSubmitted) onReviewSubmitted();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-bg-secondary rounded-2xl border border-border p-6 sm:p-8">
      <h3 className="text-lg font-bold text-text-primary mb-6">Rate Your Experience</h3>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Star Rating */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-3">Your Rating</label>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="p-1 transition-transform hover:scale-110 active:scale-95"
              >
                <Star
                  size={28}
                  className={`transition-colors ${
                    star <= (hoveredRating || rating)
                      ? 'fill-warning text-warning'
                      : 'text-text-muted'
                  }`}
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-2 text-sm text-text-secondary font-medium">
                {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
              </span>
            )}
          </div>
        </div>

        {/* Review Text */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">Your Review</label>
          <textarea
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={`Share your experience with "${gigTitle}"...`}
            maxLength={500}
            className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
          ></textarea>
          <p className="text-xs text-text-muted mt-1 text-right">{comment.length}/500</p>
        </div>

        <Button type="submit" disabled={loading || rating === 0} className="w-full">
          <Send size={16} />
          {loading ? 'Submitting...' : 'Submit Review'}
        </Button>
      </form>
    </div>
  );
};

export default ReviewForm;
