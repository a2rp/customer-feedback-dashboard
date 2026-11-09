import { useRef, useState } from "react";
import { FiX, FiStar } from "react-icons/fi";
import { useDialogFocus } from "../../hooks/useDialogFocus.js";
import styles from "./styles.module.css";

const FeedbackModal = ({ onClose, onSave }) => {
    const [rating, setRating] = useState(5);
    const [form, setForm] = useState({ name: "", company: "", email: "", category: "Product experience", channel: "In-app survey", comment: "" });
    const [formError, setFormError] = useState("");
    const dialogRef = useRef(null);

    useDialogFocus(dialogRef, onClose, "#dashboard-title");

    const updateField = (event) => {
        setFormError("");
        setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    };
    const submit = (event) => {
        event.preventDefault();
        const cleanForm = {
            ...form,
            name: form.name.trim(),
            company: form.company.trim(),
            email: form.email.trim(),
            comment: form.comment.trim(),
        };
        if (!cleanForm.name || !cleanForm.company || !cleanForm.email || !cleanForm.comment) {
            setFormError("Complete each field with a non-empty value.");
            return;
        }
        setFormError("");
        onSave({ ...cleanForm, rating, avatar: "", tone: "lavender" });
    };

    return (
        <div className={styles.backdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
            <section ref={dialogRef} className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="add-feedback-title">
                <div className={styles["modal-heading"]}><div><span className={styles.kicker}>ADD TO THE CONVERSATION</span><h2 id="add-feedback-title">Capture feedback</h2></div><button type="button" onClick={onClose} aria-label="Close"><FiX /></button></div>
                <form onSubmit={submit}>
                    <div className={styles["field-row"]}><label>Customer name<input name="name" value={form.name} onChange={updateField} placeholder="e.g. Jordan Lee" maxLength="200" required /></label><label>Company<input name="company" value={form.company} onChange={updateField} placeholder="Company name" maxLength="200" required /></label></div>
                    <div className={styles["field-row"]}><label>Email address<input name="email" type="email" value={form.email} onChange={updateField} placeholder="jordan@example.com" maxLength="320" required /></label><label>Topic<select name="category" value={form.category} onChange={updateField}><option>Product experience</option><option>Getting started</option><option>Billing</option><option>Support</option><option>Reporting</option><option>Team access</option><option>Mobile app</option></select></label></div>
                    <div className={styles["field-row"]}><label>Source<select name="channel" value={form.channel} onChange={updateField}><option>In-app survey</option><option>Email</option><option>Support</option><option>App review</option><option>Interview</option></select></label><fieldset><legend>Customer rating</legend><div className={styles["rating-picker"]} role="group" aria-label={`Selected rating: ${rating} out of 5`}>{[1, 2, 3, 4, 5].map((value) => <button type="button" key={value} aria-label={`${value} stars`} aria-pressed={rating === value} onClick={() => setRating(value)}><FiStar aria-hidden="true" className={value <= rating ? styles["star-selected"] : ""} /></button>)}</div></fieldset></div>
                    <label className={styles["comment-field"]}>What did they say?<textarea name="comment" value={form.comment} onChange={updateField} placeholder="Add the customer's words or a clear summary..." maxLength="5000" rows="4" required /></label>
                    {formError && <p className={styles["form-error"]} role="alert">{formError}</p>}
                    <div className={styles["form-actions"]}><button type="button" className={styles.cancel} onClick={onClose}>Cancel</button><button type="submit" className={styles.save}>Save feedback</button></div>
                </form>
            </section>
        </div>
    );
};

export default FeedbackModal;
