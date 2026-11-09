import { useEffect } from "react";

const focusableSelector = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
].join(",");

export const useDialogFocus = (dialogRef, onClose, fallbackSelector) => {
    useEffect(() => {
        const dialog = dialogRef.current;
        const returnFocusTo = document.activeElement;
        if (!dialog) return undefined;

        const getFocusable = () => [...dialog.querySelectorAll(focusableSelector)];
        const focusFirst = () => {
            const first = getFocusable()[0];
            (first || dialog).focus();
        };

        focusFirst();

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                event.preventDefault();
                onClose();
                return;
            }

            if (event.key !== "Tab") return;
            const focusable = getFocusable();
            if (!focusable.length) {
                event.preventDefault();
                dialog.focus();
                return;
            }

            const first = focusable[0];
            const last = focusable.at(-1);
            if (!dialog.contains(document.activeElement)) {
                event.preventDefault();
                focusFirst();
            } else if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        const keepFocusInside = (event) => {
            if (!dialog.contains(event.target)) focusFirst();
        };

        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("focusin", keepFocusInside);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("focusin", keepFocusInside);
            if (
                returnFocusTo instanceof HTMLElement &&
                returnFocusTo.isConnected &&
                returnFocusTo.getClientRects().length
            ) {
                returnFocusTo.focus();
            } else {
                document.querySelector(fallbackSelector)?.focus();
            }
        };
    }, [dialogRef, fallbackSelector, onClose]);
};
