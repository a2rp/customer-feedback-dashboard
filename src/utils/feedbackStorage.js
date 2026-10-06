import { initialFeedback } from "../data/feedback.js";

const storageKey = "murmur-feedback";

export const readFeedback = () => {
    try {
        const savedFeedback = localStorage.getItem(storageKey);
        if (!savedFeedback) return initialFeedback;

        const parsedFeedback = JSON.parse(savedFeedback);
        return Array.isArray(parsedFeedback) ? parsedFeedback : initialFeedback;
    } catch {
        return initialFeedback;
    }
};

export const getSentiment = (rating) => {
    if (rating >= 4) return "positive";
    if (rating === 3) return "neutral";
    return "negative";
};

export const formatReceivedDate = (dateString) => {
    const received = new Date(dateString);
    const dayDifference = Math.floor(
        (Date.now() - received.getTime()) / (24 * 60 * 60 * 1000),
    );

    if (dayDifference <= 0) return "Today";
    if (dayDifference === 1) return "Yesterday";
    return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
    }).format(received);
};
