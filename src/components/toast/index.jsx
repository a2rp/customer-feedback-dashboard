import { FiCheckCircle } from "react-icons/fi";
import styles from "./styles.module.css";

const Toast = ({ message }) => <div className={styles.toast} role="status" aria-live="polite"><FiCheckCircle aria-hidden="true" />{message}</div>;

export default Toast;
