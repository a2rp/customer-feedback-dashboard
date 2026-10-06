import { FiAlertCircle, FiMessageSquare, FiSmile, FiStar } from "react-icons/fi";
import styles from "./styles.module.css";

const MetricGrid = ({ responseCount, averageRating, positiveCount, replyCount }) => {
    const positivePercent = responseCount
        ? Math.round((positiveCount / responseCount) * 100)
        : 0;
    const metrics = [
        {
            label: "Responses",
            value: responseCount,
            note: "in this period",
            icon: FiMessageSquare,
            tone: "violet",
        },
        {
            label: "Average rating",
            value: averageRating.toFixed(1),
            note: "out of 5.0",
            icon: FiStar,
            tone: "amber",
        },
        {
            label: "Positive signal",
            value: `${positivePercent}%`,
            note: `${positiveCount} happy voices`,
            icon: FiSmile,
            tone: "mint",
        },
        {
            label: "Needs a reply",
            value: replyCount,
            note: replyCount ? "worth a follow-up" : "you are all caught up",
            icon: FiAlertCircle,
            tone: replyCount ? "coral" : "mint",
        },
    ];

    return (
        <section className={styles["metric-grid"]} aria-label="Feedback summary">
            {metrics.map(({ label, value, note, icon: Icon, tone }) => (
                <article className={`${styles["metric-card"]} ${styles[tone]}`} key={label}>
                    <div className={styles["metric-topline"]}>
                        <span className={styles["metric-icon"]}><Icon aria-hidden="true" /></span>
                        <span>{label}</span>
                    </div>
                    <div className={styles["metric-value-row"]}>
                        <strong>{value}</strong>
                        <small>{note}</small>
                    </div>
                    <span className={styles["metric-accent"]} aria-hidden="true" />
                </article>
            ))}
        </section>
    );
};

export default MetricGrid;
