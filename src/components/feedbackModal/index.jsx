import { useEffect, useState } from "react";
import { FiX, FiStar } from "react-icons/fi";
import styles from "./styles.module.css";

const FeedbackModal = ({ onClose, onSave }) => {
    const [rating, setRating] = useState(5);
    const [form, setForm] = useState({ name: "", company: "", email: "", category: "Product experience", channel: "In-app survey", comment: "" });

    useEffect(() => {
        const closeOnEscape = (event) => { if (event.key === "Escape") onClose(); };
        document.addEventListener("keydown", closeOnEscape);
        return () => document.removeEventListener("keydown", closeOnEscape);
    }, [onClose]);

    const updateField = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    const submit = (event) => { event.preventDefault(); onSave({ ...form, rating, avatar: "", tone: "lavender" }); };

    return (
        <div className={styles.backdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
            <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="add-feedback-title">
                <div className={styles["modal-heading"]}><div><span className={styles.kicker}>ADD TO THE CONVERSATION</span><h2 id="add-feedback-title">Capture feedback</h2></div><button type="button" onClick={onClose} aria-label="Close"><FiX /></button></div>
                <form onSubmit={submit}>
                    <div className={styles["field-row"]}><label>Customer name<input name="name" value={form.name} onChange={updateField} placeholder="e.g. Jordan Lee" required /></label><label>Company<input name="company" value={form.company} onChange={updateField} placeholder="Company name" required /></label></div>
                    <div className={styles["field-row"]}><label>Email address<input name="email" type="email" value={form.email} onChange={updateField} placeholder="jordan@example.com" required /></label><label>Topic<select name="category" value={form.category} onChange={updateField}><option>Product experience</option><option>Getting started</option><option>Billing</option><option>Support</option><option>Reporting</option><option>Team access</option><option>Mobile app</option></select></label></div>
                    <div className={styles["field-row"]}><label>Source<select name="channel" value={form.channel} onChange={updateField}><option>In-app survey</option><option>Email</option><option>Support</option><option>App review</option><option>Interview</option></select></label><fieldset><legend>Customer rating</legend><div className={styles["rating-picker"]} aria-label={`Selected rating: ${rating} out of 5`}>{[1, 2, 3, 4, 5].map((value) => <button type="button" key={value} aria-label={`${value} stars`} aria-pressed={rating === value} onClick={() => setRating(value)}><FiStar className={value <= rating ? styles["star-selected"] : ""} /></button>)}</div></fieldset></div>
                    <label className={styles["comment-field"]}>What did they say?<textarea name="comment" value={form.comment} onChange={updateField} placeholder="Add the customer's words or a clear summary..." rows="4" required /></label>
                    <div className={styles["form-actions"]}><button type="button" className={styles.cancel} onClick={onClose}>Cancel</button><button type="submit" className={styles.save}>Save feedback</button></div>
                </form>
            </section>
        </div>
    );
};

export default FeedbackModal;
