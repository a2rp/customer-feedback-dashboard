import { FiArrowUpRight, FiHeart, FiMessageCircle, FiThumbsDown, FiTrendingUp } from "react-icons/fi";
import styles from "./styles.module.css";

const InsightsPanel = ({ feedback, onSentimentSelect }) => {
    const total = feedback.length || 1;
    const positive = feedback.filter((item) => item.rating >= 4).length;
    const neutral = feedback.filter((item) => item.rating === 3).length;
    const negative = feedback.filter((item) => item.rating <= 2).length;
    const categories = Object.entries(feedback.reduce((counts, item) => {
        counts[item.category] = (counts[item.category] || 0) + 1;
        return counts;
    }, {})).sort((a, b) => b[1] - a[1]).slice(0, 4);

    return (
        <aside className={styles.panel} aria-labelledby="insights-title">
            <div className={styles["panel-heading"]}><span className={styles["panel-icon"]}><FiTrendingUp aria-hidden="true" /></span><span className={styles.kicker}>THE BIG PICTURE</span><h2 id="insights-title">How it feels</h2><p>A quick read on the tone behind your feedback.</p></div>
            <div className={styles["sentiment-list"]}>
                <button type="button" onClick={() => onSentimentSelect("positive")}><span className={styles.sentimentIcon}><FiHeart /></span><span className={styles.sentimentCopy}><strong>Positive</strong><small>4 and 5 star responses</small></span><span className={styles.sentimentValue}>{positive}<small>{Math.round(positive / total * 100)}%</small></span></button>
                <button type="button" onClick={() => onSentimentSelect("neutral")}><span className={`${styles.sentimentIcon} ${styles.neutral}`}><FiMessageCircle /></span><span className={styles.sentimentCopy}><strong>In the middle</strong><small>3 star responses</small></span><span className={styles.sentimentValue}>{neutral}<small>{Math.round(neutral / total * 100)}%</small></span></button>
                <button type="button" onClick={() => onSentimentSelect("negative")}><span className={`${styles.sentimentIcon} ${styles.negative}`}><FiThumbsDown /></span><span className={styles.sentimentCopy}><strong>Needs attention</strong><small>1 and 2 star responses</small></span><span className={styles.sentimentValue}>{negative}<small>{Math.round(negative / total * 100)}%</small></span></button>
            </div>
            <div className={styles["category-block"]}><div className={styles["category-heading"]}><h3>Topics customers mention</h3><FiArrowUpRight aria-hidden="true" /></div>
                {categories.map(([category, count]) => <div className={styles.category} key={category}><span>{category}</span><span className={styles["category-track"]}><i style={{ width: `${Math.max(14, count / (categories[0]?.[1] || 1) * 100)}%` }} /></span><strong>{count}</strong></div>)}
                {categories.length === 0 && <p className={styles["no-topics"]}>Topics will appear when feedback is added.</p>}
            </div>
        </aside>
    );
};

export default InsightsPanel;
