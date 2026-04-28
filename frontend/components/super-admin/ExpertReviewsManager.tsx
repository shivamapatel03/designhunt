"use client";

import { useState, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  Add01Icon, 
  Delete02Icon, 
  CancelCircleIcon, 
  Image01Icon 
} from "@hugeicons/core-free-icons";

export function ExpertReviewsManager({ isAdmin = false }: { isAdmin?: boolean }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newReview, setNewReview] = useState({
    author_name: "",
    author_title: "",
    rating: 5,
    content: "",
    author_image: "",
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/admin/expert-reviews");
      if (res.ok) {
        const data = await res.json();
        setReviews(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Failed to fetch expert reviews");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      const res = await fetch(`/api/admin/expert-reviews/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setReviews(prev => prev.filter(r => r.id !== id));
      } else {
        alert("Failed to delete review");
      }
    } catch (e) {
      alert("Error deleting review");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check size (e.g. limit to 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("Image must be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewReview({ ...newReview, author_image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/expert-reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReview),
      });
      if (res.ok) {
        fetchReviews();
        setShowAddForm(false);
        setNewReview({ author_name: "", author_title: "", rating: 5, content: "", author_image: "" });
      } else {
        alert("Failed to create review");
      }
    } catch (error) {
      alert("Error creating review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Expert Reviews</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-accent-blue text-white rounded-xl border border-gray-100 font-bold shadow-sm active:scale-95 transition-all"
        >
          <HugeiconsIcon icon={Add01Icon} className="w-5 h-5" />
          Add Review
        </button>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">New Review</h3>
                <button onClick={() => setShowAddForm(false)} className="hover:bg-gray-100 p-2 rounded-full">
                  <HugeiconsIcon icon={CancelCircleIcon} className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-2">Author Name *</label>
                    <input
                      type="text"
                      required
                      value={newReview.author_name}
                      onChange={e => setNewReview({ ...newReview, author_name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:outline-none focus:shadow-sm transition-all font-medium"
                      placeholder="e.g. Shivam Patel"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-2">Author Title / Role</label>
                    <input
                      type="text"
                      value={newReview.author_title}
                      onChange={e => setNewReview({ ...newReview, author_title: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:outline-none focus:shadow-sm transition-all font-medium"
                      placeholder="e.g. Learner, Design Lead"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                  <div>
                    <label className="block text-xs font-bold mb-2">Rating (1-5)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="5"
                      step="0.1"
                      value={newReview.rating}
                      onChange={e => setNewReview({ ...newReview, rating: parseFloat(e.target.value) })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:outline-none focus:shadow-sm transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-2">Profile Photo</label>
                    <div className="flex items-center gap-4">
                      {newReview.author_image ? (
                        <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-100 shrink-0">
                          <img src={newReview.author_image} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-100 border border-gray-100 flex items-center justify-center shrink-0">
                          <HugeiconsIcon icon={Image01Icon} className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full text-sm font-medium text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-2 file:border-black file:text-sm file:font-bold file: file:bg-accent-yellow file:text-black hover:file:bg-yellow-400 file:cursor-pointer transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-2">Review Content *</label>
                  <textarea
                    required
                    value={newReview.content}
                    onChange={e => setNewReview({ ...newReview, content: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:outline-none focus:shadow-sm transition-all font-medium"
                    placeholder="This course helped me understand..."
                  />
                </div>

                <div className="pt-4 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 px-6 py-3 rounded-xl border border-gray-100 font-bold hover:bg-gray-100 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 bg-black text-white rounded-xl border border-gray-100 font-bold shadow-sm active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? "Saving..." : "Save Review"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Reviews Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full">
          <thead className="bg-black text-white">
            <tr>
              <th className="py-4 px-6 text-left font-bold text-xs tracking-wider">Author</th>
              <th className="py-4 px-6 text-left font-bold text-xs tracking-wider">Rating & Text</th>
              <th className="py-4 px-6 text-right font-bold text-xs tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {reviews.map((review) => (
              <tr key={review.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-100 bg-gray-100 shrink-0">
                      {review.author_image ? (
                        <img src={review.author_image} alt={review.author_name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-gray-500 text-lg">
                          {review.author_name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-sm block">{review.author_name}</div>
                      <div className="text-xs text-gray-500 block">{review.author_title || "No title"}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="font-bold text-xs text-accent-yellow mb-1">⭐ {review.rating} / 5.0</div>
                  <div className="text-sm line-clamp-2 max-w-md">{review.content}</div>
                </td>
                <td className="py-4 px-6 text-right">
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border-2 border-transparent hover:border-red-200"
                    title="Delete Review"
                  >
                    <HugeiconsIcon icon={Delete02Icon} className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
            {reviews.length === 0 && (
              <tr>
                <td colSpan={3} className="py-8 text-center text-gray-400 font-medium">
                  No expert reviews added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
