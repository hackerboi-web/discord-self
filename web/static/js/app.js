let autoRefresh = false;
let refreshInterval;

async function fetchLogs() {
    try {
        const res = await fetch('/api/logs?limit=500');
        const logs = await res.json();
        displayLogs(logs);
        document.getElementById('recentCount').textContent = logs.length;
        const allRes = await fetch('/api/logs/all');
        const allLogs = await allRes.json();
        document.getElementById('totalLogs').textContent = allLogs.length;
    } catch (e) {
        console.error(e);
    }
}

async function fetchEntries() {
    try {
        const res = await fetch('/api/entries');
        const entries = await res.json();
        displayEntries(entries);
        document.getElementById('totalEntries').textContent = Object.keys(entries).length;
    } catch (e) {
        console.error(e);
    }
}

function displayLogs(logs) {
    const container = document.getElementById('logs');
    const scrollBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 10;
    container.innerHTML = '';
    logs.slice().reverse().forEach(log => {
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        const time = log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : new Date().toLocaleTimeString();
        entry.textContent = `[${time}] ${log.type}: ${JSON.stringify(log)}`;
        container.appendChild(entry);
    });
    if (scrollBottom || container.children.length === 0) {
        container.scrollTop = container.scrollHeight;
    }
}

function displayEntries(entries) {
    const container = document.getElementById('entries');
    container.innerHTML = '';
    Object.entries(entries).forEach(([key, data]) => {
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.textContent = `${key}: ${JSON.stringify(data)}`;
        container.appendChild(entry);
    });
}

function refreshLogs() {
    fetchLogs();
    fetchEntries();
}

function toggleAutoRefresh() {
    autoRefresh = !autoRefresh;
    if (autoRefresh) {
        refreshInterval = setInterval(refreshLogs, 2000);
    } else {
        if (refreshInterval) clearInterval(refreshInterval);
    }
}

function clearLogsView() {
    document.getElementById('logs').innerHTML = '';
}

refreshLogs();
