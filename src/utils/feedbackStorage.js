import { initialFeedback } from "../data/feedback.js";

const storageKey = "murmur-feedback";
const allowedStatuses = new Set(["New", "Reviewed", "Needs reply"]);
const allowedTones = new Set([
    "lavender",
    "peach",
    "blue",
    "rose",
    "mint",
    "gold",
    "slate",
]);

const isValidFeedback = (item) =>
    item !== null &&
    typeof item === "object" &&
    typeof item.id === "string" &&
    item.id.length > 0 &&
    item.id.length <= 120 &&
    typeof item.name === "string" &&
    item.name.trim().length > 0 &&
    item.name.length <= 200 &&
    typeof item.company === "string" &&
    item.company.trim().length > 0 &&
    item.company.length <= 200 &&
    typeof item.email === "string" &&
    item.email.length <= 320 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item.email) &&
    Number.isInteger(item.rating) &&
    item.rating >= 1 &&
    item.rating <= 5 &&
    typeof item.category === "string" &&
    item.category.length > 0 &&
    item.category.length <= 120 &&
    typeof item.channel === "string" &&
    item.channel.length > 0 &&
    item.channel.length <= 120 &&
    typeof item.comment === "string" &&
    item.comment.trim().length > 0 &&
    item.comment.length <= 5000 &&
    typeof item.receivedAt === "string" &&
    Number.isFinite(new Date(item.receivedAt).getTime()) &&
    allowedStatuses.has(item.status) &&
    typeof item.avatar === "string" &&
    item.avatar.length <= 600 &&
    allowedTones.has(item.tone);

export const readFeedback = () => {
    try {
        const savedFeedback = localStorage.getItem(storageKey);
        if (!savedFeedback) return initialFeedback;

        const parsedFeedback = JSON.parse(savedFeedback);
        if (!Array.isArray(parsedFeedback)) return initialFeedback;
        if (!parsedFeedback.length) return [];

        const seenIds = new Set();
        const validFeedback = parsedFeedback.filter((item) => {
            if (!isValidFeedback(item) || seenIds.has(item.id)) return false;
            seenIds.add(item.id);
            return true;
        });

        return validFeedback.length ? validFeedback : initialFeedback;
    } catch {
        return initialFeedback;
    }
};

export const writeFeedback = (feedback) => {
    try {
        localStorage.setItem(storageKey, JSON.stringify(feedback));
        return true;
    } catch {
        return false;
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
