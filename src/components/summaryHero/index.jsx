import { FiChevronDown, FiDownload, FiPlus, FiZap } from "react-icons/fi";
import styles from "./styles.module.css";

const SummaryHero = ({ period, onPeriodChange, onAddFeedback, onExport }) => (
    <section className={styles.hero} aria-labelledby="dashboard-title">
        <div className={styles["hero-copy"]}>
            <div className={styles["hero-eyebrow"]}>
                <FiZap aria-hidden="true" /> CUSTOMER VOICE / OVERVIEW
            </div>
            <h1 id="dashboard-title">
                Listen closely.
                <br />
                <em>Move with purpose.</em>
            </h1>
            <p>One clear view of what customers love, need, and hope you will fix.</p>
        </div>

        <div className={styles["hero-actions"]}>
            <label className={styles["period-select"]}>
                <span className={styles["visually-hidden"]}>Feedback period</span>
                <select value={period} onChange={(event) => onPeriodChange(event.target.value)}>
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                    <option value="90">Last 90 days</option>
                    <option value="all">All time</option>
                </select>
                <FiChevronDown
                    className={styles["period-chevron"]}
                    aria-hidden="true"
                />
            </label>
            <button className={styles["export-button"]} type="button" onClick={onExport}>
                <FiDownload aria-hidden="true" /> Export
            </button>
            <button className={styles["add-button"]} type="button" onClick={onAddFeedback}>
                <FiPlus aria-hidden="true" /> Add feedback
            </button>
        </div>
    </section>
);

export default SummaryHero;
