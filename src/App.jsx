import { useEffect, useMemo, useState } from "react";
import Header from "./components/header/index.jsx";
import SummaryHero from "./components/summaryHero/index.jsx";
import MetricGrid from "./components/metricGrid/index.jsx";
import FeedbackInbox from "./components/feedbackInbox/index.jsx";
import InsightsPanel from "./components/insightsPanel/index.jsx";
import TrendPanel from "./components/trendPanel/index.jsx";
import FeedbackModal from "./components/feedbackModal/index.jsx";
import FeedbackDetail from "./components/feedbackDetail/index.jsx";
import Toast from "./components/toast/index.jsx";
import Footer from "./components/footer/index.jsx";
import { readFeedback, writeFeedback } from "./utils/feedbackStorage.js";
import styles from "./App.module.css";

const createFeedbackId = () =>
    `feedback-${globalThis.crypto?.randomUUID?.() || `${Date.now().toString(36)}-${Math.random().toString(16).slice(2)}`}`;

const escapeCsvCell = (value) => {
    const text = String(value ?? "");
    const safeText = /^[=+\-@]/.test(text.trimStart())
        ? `'${text}`
        : text;
    return `"${safeText.replaceAll('"', '""')}"`;
};

const App = () => {
    const [feedback, setFeedback] = useState(readFeedback);
    const [currentTime, setCurrentTime] = useState(() => Date.now());
    const [period, setPeriod] = useState("30");
    const [activeFilter, setActiveFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [createOpen, setCreateOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [toast, setToast] = useState("");

    useEffect(() => {
        if (!toast) return undefined;
        const timeout = window.setTimeout(() => setToast(""), 2600);
        return () => window.clearTimeout(timeout);
    }, [toast]);

    useEffect(() => {
        const interval = window.setInterval(
            () => setCurrentTime(Date.now()),
            60_000,
        );
        return () => window.clearInterval(interval);
    }, []);

    const periodFeedback = useMemo(() => {
        if (period === "all") return feedback;
        const limit = Number(period) * 24 * 60 * 60 * 1000;
        return feedback.filter((item) => {
            const age = currentTime - new Date(item.receivedAt).getTime();
            return age >= 0 && age <= limit;
        });
    }, [feedback, period, currentTime]);

    const visibleFeedback = useMemo(() => {
        const query = search.trim().toLowerCase();
        return periodFeedback.filter((item) => {
            const matchesSearch =
                !query ||
                [item.name, item.company, item.category, item.comment]
                    .join(" ")
                    .toLowerCase()
                    .includes(query);
            const matchesFilter =
                activeFilter === "all" ||
                (activeFilter === "reply" && item.status === "Needs reply") ||
                (activeFilter === "positive" && item.rating >= 4) ||
                (activeFilter === "neutral" && item.rating === 3) ||
                (activeFilter === "negative" && item.rating <= 2);
            return matchesSearch && matchesFilter;
        });
    }, [periodFeedback, search, activeFilter]);

    const selectedFeedback = feedback.find((item) => item.id === selectedId);
    const averageRating = periodFeedback.length
        ? periodFeedback.reduce((sum, item) => sum + item.rating, 0) /
          periodFeedback.length
        : 0;
    const positiveCount = periodFeedback.filter(
        (item) => item.rating >= 4,
    ).length;
    const replyCount = periodFeedback.filter(
        (item) => item.status === "Needs reply",
    ).length;

    const saveFeedback = (nextFeedback, successMessage) => {
        setFeedback(nextFeedback);
        setToast(
            writeFeedback(nextFeedback)
                ? successMessage
                : "Change saved for this session; browser storage is unavailable",
        );
    };

    const addFeedback = (newFeedback) => {
        const item = {
            ...newFeedback,
            id: createFeedbackId(),
            receivedAt: new Date().toISOString(),
            status: newFeedback.rating <= 2 ? "Needs reply" : "New",
        };
        saveFeedback([item, ...feedback], "Feedback added to the inbox");
        setCreateOpen(false);
        setPeriod("30");
        setActiveFilter("all");
        setSearch("");
    };

    const updateStatus = (id, status) => {
        saveFeedback(
            feedback.map((item) =>
                item.id === id ? { ...item, status } : item,
            ),
            status === "Reviewed" ? "Marked as reviewed" : "Flagged for reply",
        );
    };

    const clearFilters = () => {
        setPeriod("all");
        setActiveFilter("all");
        setSearch("");
    };

    const exportFeedback = () => {
        const columns = [
            ["Customer", "name"],
            ["Company", "company"],
            ["Rating", "rating"],
            ["Category", "category"],
            ["Channel", "channel"],
            ["Status", "status"],
            ["Comment", "comment"],
            ["Received", "receivedAt"],
        ];
        const rows = [
            columns.map(([label]) => label),
            ...visibleFeedback.map((item) =>
                columns.map(([, key]) => item[key] ?? ""),
            ),
        ];
        const csv = rows
            .map((row) =>
                row.map(escapeCsvCell).join(","),
            )
            .join("\r\n");
        const url = URL.createObjectURL(
            new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" }),
        );
        const link = document.createElement("a");
        link.href = url;
        link.download = "murmur-customer-feedback.csv";
        link.click();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
        setToast("Feedback export is ready");
    };

    return (
        <div className={styles["app-shell"]}>
            <Header search={search} onSearchChange={setSearch} />
            <main className={styles["page-content"]}>
                <div id="overview">
                    <SummaryHero
                        period={period}
                        onPeriodChange={setPeriod}
                        onAddFeedback={() => setCreateOpen(true)}
                        onExport={exportFeedback}
                    />
                    <MetricGrid
                        responseCount={periodFeedback.length}
                        averageRating={averageRating}
                        positiveCount={positiveCount}
                        replyCount={replyCount}
                    />
                </div>

                <div className={styles["dashboard-grid"]}>
                    <FeedbackInbox
                        feedback={visibleFeedback}
                        totalCount={periodFeedback.length}
                        activeFilter={activeFilter}
                        onFilterChange={setActiveFilter}
                        onClearFilters={clearFilters}
                        onOpenFeedback={setSelectedId}
                        onAddFeedback={() => setCreateOpen(true)}
                    />
                    <InsightsPanel
                        feedback={periodFeedback}
                        onSentimentSelect={setActiveFilter}
                    />
                </div>

                <div id="insights">
                    <TrendPanel
                        feedback={periodFeedback}
                        currentTime={currentTime}
                    />
                </div>
                <Footer />
            </main>

            {createOpen && (
                <FeedbackModal
                    onClose={() => setCreateOpen(false)}
                    onSave={addFeedback}
                />
            )}
            {selectedFeedback && (
                <FeedbackDetail
                    feedback={selectedFeedback}
                    onClose={() => setSelectedId(null)}
                    onUpdateStatus={updateStatus}
                />
            )}
            {toast && <Toast message={toast} />}
        </div>
    );
};

export default App;
