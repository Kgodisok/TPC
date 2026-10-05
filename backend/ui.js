function escapeHtml(value = '') {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function renderAlert(message, type = 'success') {
    return `
        <div class="status-alert ${type}">${escapeHtml(message)}</div>
    `;
}

function buildTaskCard(task = {}) {
    return `
        <article class="task-card">
            <h3>${escapeHtml(task.title || 'Untitled task')}</h3>
            <p>${escapeHtml(task.description || 'No description provided.')}</p>
            <div class="task-meta">
                <span>${escapeHtml(task.status || 'Pending')}</span>
                <span>${escapeHtml(task.priority || 'Medium')}</span>
            </div>
        </article>
    `;
}

function renderErrorPage(message, statusCode = 500) {
    return {
        statusCode,
        html: `
            <main class="error-page">
                <h1>Error ${statusCode}</h1>
                <p>${escapeHtml(message)}</p>
            </main>
        `
    };
}

module.exports = {
    escapeHtml,
    renderAlert,
    buildTaskCard,
    renderErrorPage
};
