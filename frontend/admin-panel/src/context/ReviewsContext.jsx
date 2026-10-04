// src/context/ReviewsContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { API_BASE_URL } from '../config/api';

export const ReviewsContext = createContext();

// The ReviewsProvider component is now a wrapper that handles the logic
export const ReviewsProvider = ({ children }) => {
    // State to hold all the review data
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [unreadReviewsCount, setUnreadReviewsCount] = useState(0);
    // State to act as a dependency trigger for manual refreshes
    const [manualRefreshTrigger, setManualRefreshTrigger] = useState(0);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/reviews`);
            if (!response.ok) {
                throw new Error('Failed to fetch reviews');
            }
            const data = await response.json();
            setReviews(data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching reviews:', err);
            setError('Failed to load reviews.');
            setLoading(false);
        }
    };

    const fetchUnreadCount = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/reviews/unread-count`);
            if (response.ok) {
                const data = await response.json();
                setUnreadReviewsCount(data.count);
            }
        } catch (error) {
            console.error('Failed to fetch unread review count:', error);
        }
    };

    useEffect(() => {
        // This effect will run on mount and whenever manualRefreshTrigger changes
        fetchReviews();
        fetchUnreadCount();

        // The unread count can still be polled periodically
        const unreadCountInterval = setInterval(fetchUnreadCount, 3000); 
        return () => clearInterval(unreadCountInterval);
    }, [manualRefreshTrigger]); // The dependency array now includes the trigger

    const markReviewAsRead = async (reviewId) => {
        try {
            await fetch(`${API_BASE_URL}/api/reviews/${reviewId}/read`, {
                method: 'PUT',
            });
            setReviews(prevReviews =>
                prevReviews.map(review =>
                    review._id === reviewId ? { ...review, isRead: true } : review
                )
            );
            await fetchUnreadCount();
            return true;
        } catch (error) {
            console.error('Failed to mark review as read:', error);
            return false;
        }
    };

    const value = {
        reviews,
        loading,
        error,
        unreadReviewsCount,
        markReviewAsRead,
        refreshReviews: () => setManualRefreshTrigger(prev => prev + 1), // Expose a function to trigger the refresh
    };

    return (
        <ReviewsContext.Provider value={value}>
            {children}
        </ReviewsContext.Provider>
    );
};

export const useReviews = () => useContext(ReviewsContext);