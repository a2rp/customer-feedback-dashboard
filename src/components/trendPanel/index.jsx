import { useState } from "react";
import { FiArrowUpRight, FiBarChart2 } from "react-icons/fi";
import styles from "./styles.module.css";

const TrendPanel = ({ feedback }) => {
    const [today] = useState(() => new Date());
    const days = Array.from({ length: 7 }, (_, index) => {
        const date = new Date(today);
        date.setDate(date.getDate() - (6 - index));
        const key = date.toDateString();
        return { key, label: new Intl.DateTimeFormat("en", { weekday: "short" }).format(date), value: feedback.filter((item) => new Date(item.receivedAt).toDateString() === key).length };
    });
    const maxValue = Math.max(1, ...days.map((day) => day.value));
    const replyCount = feedback.filter((item) => item.status === "Needs reply").length;

    return (
        <section className={styles.trend} aria-labelledby="trend-title">
            <div className={styles["trend-heading"]}><div><span className={styles.kicker}><FiBarChart2 aria-hidden="true" /> MOMENTUM</span><h2 id="trend-title">A week in customer voice</h2><p>New responses received over the last seven days.</p></div><div className={styles["trend-total"]}><strong>{days.reduce((sum, day) => sum + day.value, 0)}</strong><span>this week <FiArrowUpRight aria-hidden="true" /></span></div></div>
            <div className={styles.chart} role="img" aria-label={`Response counts by day: ${days.map((day) => `${day.label} ${day.value}`).join(", ")}`}>
                {days.map((day) => <div className={styles["chart-day"]} key={day.key}><span className={styles["chart-value"]}>{day.value || ""}</span><div className={styles["bar-track"]}><i style={{ height: `${Math.max(8, day.value / maxValue * 100)}%` }} /></div><span>{day.label}</span></div>)}
            </div>
            <div className={styles["trend-note"]}><span className={styles["note-dot"]} /> {replyCount ? <><strong>{replyCount} responses</strong> are waiting for a reply. A thoughtful follow-up can turn a rough moment around.</> : <>Your inbox is clear. Keep listening for the next opportunity to make someone's day.</>}</div>
        </section>
    );
};

export default TrendPanel;
