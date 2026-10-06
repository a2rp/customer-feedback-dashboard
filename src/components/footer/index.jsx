import { useState } from "react";
import styles from "./styles.module.css";

const Footer = () => {
    const base = import.meta.env.BASE_URL;
    const [currentYear] = useState(() => new Date().getFullYear());
    const links = [
        ["Portfolio", "https://www.ashishranjan.net"], ["GitHub", "https://github.com/a2rp"], ["CodePen", "https://codepen.io/ash1198"],
        ["LinkedIn", "https://www.linkedin.com/in/aashishranjan"], ["Facebook", "https://www.facebook.com/theash.ashish/"],
        ["YouTube", "https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1"], ["Email", "mailto:ash.ranjan09@gmail.com"],
        ["Support", "https://a2rp-donation-page.netlify.app/"], ["Buy Me a Coffee", "https://buymeacoffee.com/ashishranjan"], ["Patreon", "https://www.patreon.com/ashishranjan"],
    ];
    return (
        <footer className={styles.footer}>
            <div className={styles["footer-credit"]}><a href="https://www.ashishranjan.net" aria-label="Ashish Ranjan profile"><img src={`${base}logo.png`} alt="Ashish Ranjan logo" /></a><p>© {currentYear} <a href="https://github.com/a2rp">Ashish Ranjan</a>. All rights reserved.</p></div>
            <nav className={styles["footer-links"]} aria-label="Social and support links">{links.map(([label, href]) => <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined}>{label}</a>)}</nav>
        </footer>
    );
};

export default Footer;
