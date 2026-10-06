import { useEffect, useRef, useState } from "react";
import { FiActivity, FiMessageCircle, FiSearch } from "react-icons/fi";
import styles from "./styles.module.css";

const Header = ({ search, onSearchChange }) => {
    const [searchOpen, setSearchOpen] = useState(false);
    const searchRef = useRef(null);

    useEffect(() => {
        const handleSearchShortcut = (event) => {
            if (!event.ctrlKey || event.key.toLowerCase() !== "k") return;
            event.preventDefault();
            setSearchOpen(true);
            requestAnimationFrame(() => searchRef.current?.focus());
        };

        document.addEventListener("keydown", handleSearchShortcut);
        return () => document.removeEventListener("keydown", handleSearchShortcut);
    }, []);

    return (
        <header className={styles.topbar}>
            <a className={styles["brand-lockup"]} href="#overview" aria-label="Murmur overview">
                <span className={styles["brand-icon"]}>
                    <FiMessageCircle />
                    <i />
                </span>
                <span className={styles["brand-name"]}>murmur<span>.</span></span>
            </a>

            <nav className={styles["main-nav"]} aria-label="Main navigation">
                <a href="#overview">Overview</a>
                <a href="#responses">Responses</a>
                <a href="#insights">Insights</a>
            </nav>

            <div className={styles["topbar-tools"]}>
                <label
                    className={`${styles["search-box"]} ${searchOpen ? styles["search-open"] : ""}`}
                    onClick={() => {
                        setSearchOpen(true);
                        requestAnimationFrame(() => searchRef.current?.focus());
                    }}
                >
                    <FiSearch aria-hidden="true" />
                    <input
                        ref={searchRef}
                        type="search"
                        aria-label="Search feedback"
                        placeholder="Search feedback..."
                        value={search}
                        onChange={(event) => onSearchChange(event.target.value)}
                        onBlur={() => {
                            if (!search) setSearchOpen(false);
                        }}
                    />
                    <kbd>Ctrl + K</kbd>
                </label>
                <a className={styles["response-link"]} href="#responses" aria-label="Go to responses">
                    <FiActivity aria-hidden="true" />
                    <span>Live inbox</span>
                </a>
            </div>
        </header>
    );
};

export default Header;
