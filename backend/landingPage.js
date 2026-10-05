const DEFAULT_HIGHLIGHTS = [
    { key: 'tasks', label: 'Tasks completed', value: 48 },
    { key: 'sessions', label: 'Support sessions', value: 12 },
    { key: 'progress', label: 'Progress rate', value: 88 }
];

function getLandingHighlights() {
    return DEFAULT_HIGHLIGHTS.map((item) => ({ ...item }));
}

function formatStatValue(value, key = 'tasks') {
    if (key === 'progress') {
        return `${Number(value) || 0}%`;
    }

    return String(value ?? 0);
}

function initLandingPage({ document: doc } = {}) {
    if (!doc) {
        return { highlights: getLandingHighlights(), animated: false };
    }

    const liveNodes = doc.querySelectorAll('[data-live-stat]');
    liveNodes.forEach((node) => {
        const key = node.dataset.liveStat;
        const matched = DEFAULT_HIGHLIGHTS.find((item) => item.key === key);
        if (matched) {
            node.textContent = formatStatValue(matched.value, key);
        }
    });

    return {
        highlights: getLandingHighlights(),
        animated: liveNodes.length > 0
    };
}

module.exports = {
    DEFAULT_HIGHLIGHTS,
    getLandingHighlights,
    formatStatValue,
    initLandingPage
};

