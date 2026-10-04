// src/components/Screens/ReviewsPage.jsx
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FaCheckCircle, FaTimes, FaSync } from 'react-icons/fa'; // Import FaSync
import './ReviewsPage.css';
import { useReviews } from '../../../context/ReviewsContext';

export default function ReviewsPage() {
    // Add the refreshTrigger state here
    // Pass the trigger to the hook
    const { reviews, loading, error, markReviewAsRead, refreshReviews } = useReviews();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);


    const handleMarkAsRead = async (reviewId) => {
        const success = await markReviewAsRead(reviewId);
        if (success) {
            // The useReviews hook will handle the local state update.
            // You might want to show a success toast here.
        } else {
            toast.error('Failed to mark review as read.');
        }
    };

    const handleReviewClick = (review) => {
        setSelectedReview(review);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedReview(null);
    };

    if (loading) return <p className="loading-message">Loading reviews...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="reviews-page-container">
            <div className="reviews-content">
                <div className="reviews-header">
                    <h2 className="reviews-heading">User Reviews</h2>
                    <button onClick={refreshReviews} className="refresh-button" title="Refresh Reviews">
                        <FaSync />
                    </button>
                </div>
                {reviews.length === 0 ? (
                    <p className="no-reviews-message">No reviews found.</p>
                ) : (
                    <div className="reviews-table-wrapper">
                        <table className="reviews-table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Rating</th>
                                    <th>Feedback</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reviews.map((review) => (
                                    <tr key={review._id} className={`review-row ${review.isRead ? 'read-row' : 'unread-row'}`}>
                                        <td className="table-user-name" onClick={() => handleReviewClick(review)}>{review.userName || 'Anonymous'}</td>
                                        <td className="table-rating" onClick={() => handleReviewClick(review)}>
                                            <span className="table-emoji">
                                                {
                                                    review.rating === 'Bad' ? '😠' :
                                                    review.rating === 'Neutral' ? '😐' :
                                                    review.rating === 'Good' ? '🙂' :
                                                    review.rating === 'Excellent' ? '😍' : ''
                                                }
                                            </span>
                                            {review.rating}
                                        </td>
                                        <td className="table-feedback" onClick={() => handleReviewClick(review)}>{review.feedback || 'No feedback provided.'}</td>
                                        <td className="table-date" onClick={() => handleReviewClick(review)}>{new Date(review.createdAt).toLocaleDateString()}</td>
                                        <td className="table-actions">
                                            {!review.isRead && (
                                                <button
                                                    onClick={() => handleMarkAsRead(review._id)}
                                                    className="mark-as-read-button"
                                                    title="Mark as Read"
                                                >
                                                    <FaCheckCircle />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {isModalOpen && selectedReview && (
                <div className="modal-backdrop" onClick={closeModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Review from {selectedReview.userName || 'Anonymous'}</h3>
                            <button className="modal-close-button" onClick={closeModal}>
                                <FaTimes />
                            </button>
                        </div>
                        <div className="modal-body">
                            <p className="modal-rating-text">
                                <span className="modal-emoji">
                                    {
                                        selectedReview.rating === 'Bad' ? '😠' :
                                        selectedReview.rating === 'Neutral' ? '😐' :
                                        selectedReview.rating === 'Good' ? '🙂' :
                                        selectedReview.rating === 'Excellent' ? '😍' : ''
                                    }
                                </span>
                                <strong>Rating:</strong> {selectedReview.rating}
                            </p>
                            <p className="modal-date-text">
                                <strong>Date:</strong> {new Date(selectedReview.createdAt).toLocaleString()}
                            </p>
                            <p className="modal-feedback-text">
                                <strong>Feedback:</strong> <br />
                                {selectedReview.feedback || 'No feedback provided.'}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}