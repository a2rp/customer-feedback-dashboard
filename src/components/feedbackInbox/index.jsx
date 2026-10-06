import { FiArrowUpRight, FiFilter, FiMessageSquare, FiPlus, FiSearch, FiStar } from "react-icons/fi";
import { formatReceivedDate } from "../../utils/feedbackStorage.js";
import styles from "./styles.module.css";

const filters = [
    { id: "all", label: "All responses" },
    { id: "reply", label: "Needs reply" },
    { id: "positive", label: "Positive" },
    { id: "neutral", label: "Neutral" },
    { id: "negative", label: "Negative" },
];

const FeedbackInbox = ({ feedback, totalCount, activeFilter, onFilterChange, onOpenFeedback, onAddFeedback }) => (
    <section className={styles.inbox} id="responses" aria-labelledby="inbox-title">
        <div className={styles["inbox-heading"]}>
            <div>
                <span className={styles.kicker}><FiMessageSquare aria-hidden="true" /> CUSTOMER VOICE</span>
                <h2 id="inbox-title">The response inbox <span>{totalCount} responses</span></h2>
            </div>
            <button className={styles["mobile-add"]} type="button" onClick={onAddFeedback} aria-label="Add feedback"><FiPlus /></button>
        </div>
        <div className={styles["inbox-toolbar"]}>
            <div className={styles.filters} aria-label="Filter responses">
                {filters.map((filter) => (
                    <button key={filter.id} type="button" className={activeFilter === filter.id ? styles.active : ""} aria-pressed={activeFilter === filter.id} onClick={() => onFilterChange(filter.id)}>
                        {filter.id === "all" && <FiFilter aria-hidden="true" />}{filter.label}
                    </button>
                ))}
            </div>
            <span className={styles["showing-count"]}>{feedback.length} showing</span>
        </div>
        <div className={styles["feedback-list"]}>
            {feedback.map((item) => (
                <button className={styles["feedback-card"]} type="button" key={item.id} onClick={() => onOpenFeedback(item.id)}>
                    <span className={`${styles.avatar} ${styles[item.tone]}`}>
                        {item.avatar ? <img src={item.avatar} alt="" /> : item.name.split(" ").map((part) => part[0]).join("")}
                    </span>
                    <span className={styles["feedback-main"]}>
                        <span className={styles["feedback-meta"]}>
                            <strong>{item.name}</strong><span>{item.company}</span><span className={styles.dot}>·</span><span>{item.category}</span>
                        </span>
                        <span className={styles.comment}>{item.comment}</span>
                        <span className={styles["feedback-tags"]}>
                            <span className={`${styles.status} ${item.status === "Needs reply" ? styles["needs-reply"] : item.status === "Reviewed" ? styles.reviewed : styles.unread}`}>{item.status}</span>
                            <span>{item.channel}</span>
                        </span>
                    </span>
                    <span className={styles["feedback-side"]}>
                        <span className={styles.rating} aria-label={`${item.rating} out of 5 stars`}>
                            {Array.from({ length: 5 }, (_, index) => <FiStar key={index} className={index < item.rating ? styles.filled : ""} aria-hidden="true" />)}
                        </span>
                        <time>{formatReceivedDate(item.receivedAt)}</time>
                        <FiArrowUpRight className={styles["open-icon"]} aria-hidden="true" />
                    </span>
                </button>
            ))}
            {feedback.length === 0 && <div className={styles.empty}><FiSearch aria-hidden="true" /><strong>No responses found</strong><span>Try another search or filter to see more customer voices.</span><button type="button" onClick={() => onFilterChange("all")}>Clear filters</button></div>}
        </div>
    </section>
);

export default FeedbackInbox;
