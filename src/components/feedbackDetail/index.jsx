import { useEffect } from "react";
import { FiCheck, FiClock, FiMail, FiMessageCircle, FiStar, FiX } from "react-icons/fi";
import { formatReceivedDate } from "../../utils/feedbackStorage.js";
import styles from "./styles.module.css";

const FeedbackDetail = ({ feedback, onClose, onUpdateStatus }) => {
    useEffect(() => {
        const closeOnEscape = (event) => { if (event.key === "Escape") onClose(); };
        document.addEventListener("keydown", closeOnEscape);
        return () => document.removeEventListener("keydown", closeOnEscape);
    }, [onClose]);

    const markStatus = (status) => { onUpdateStatus(feedback.id, status); onClose(); };
    return (
        <div className={styles.backdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
            <article className={styles.detail} role="dialog" aria-modal="true" aria-labelledby="feedback-detail-title">
                <div className={styles["detail-top"]}><span className={styles.kicker}><FiMessageCircle aria-hidden="true" /> CUSTOMER RESPONSE</span><button type="button" onClick={onClose} aria-label="Close"><FiX /></button></div>
                <div className={styles["customer-row"]}><span className={`${styles.avatar} ${styles[feedback.tone]}`}>{feedback.avatar ? <img src={feedback.avatar} alt="" /> : feedback.name.split(" ").map((part) => part[0]).join("")}</span><div><h2 id="feedback-detail-title">{feedback.name}</h2><p>{feedback.company} <span>·</span> {feedback.email}</p></div></div>
                <div className={styles["rating-row"]} aria-label={`${feedback.rating} out of 5 stars`}>{Array.from({ length: 5 }, (_, index) => <FiStar key={index} className={index < feedback.rating ? styles.filled : ""} aria-hidden="true" />)}<span>{feedback.rating}.0</span></div>
                <blockquote>{feedback.comment}</blockquote>
                <div className={styles["detail-meta"]}><span><FiClock aria-hidden="true" /> {formatReceivedDate(feedback.receivedAt)}</span><span>{feedback.category}</span><span>{feedback.channel}</span></div>
                <div className={styles["detail-actions"]}><a href={`mailto:${feedback.email}?subject=${encodeURIComponent(`Following up on your ${feedback.category} feedback`)}`}><FiMail aria-hidden="true" /> Reply by email</a>{feedback.status === "Needs reply" ? <button type="button" onClick={() => markStatus("Reviewed")}><FiCheck aria-hidden="true" /> Mark reviewed</button> : <button type="button" onClick={() => markStatus("Needs reply")}><FiMessageCircle aria-hidden="true" /> Flag for reply</button>}</div>
            </article>
        </div>
    );
};

export default FeedbackDetail;
