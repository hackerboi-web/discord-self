const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const STATE_FILE = path.join(DATA_DIR, 'state.json');
const LOGS_FILE = path.join(DATA_DIR, 'logs.json');
const ENTRIES_FILE = path.join(DATA_DIR, 'entries.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadState() {
  try {
    const raw = fs.readFileSync(STATE_FILE);
    return JSON.parse(raw);
  } catch (e) {
    return { servers: {}, logs: [], lastRun: 0, minigameQueue: [], config: {} };
  }
}

function saveState(state) {
  try {
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
  } catch (e) {}
}

function appendLog(entry) {
  try {
    let logs = [];
    if (fs.existsSync(LOGS_FILE)) {
      const raw = fs.readFileSync(LOGS_FILE);
      logs = JSON.parse(raw) || [];
    }
    logs.push({
      ...entry,
      timestamp: entry.timestamp || Date.now(),
    });
    if (logs.length > 10000) {
      logs = logs.slice(logs.length - 10000);
    }
    fs.writeFileSync(LOGS_FILE, JSON.stringify(logs, null, 2));
    const state = loadState();
    state.logs = logs;
    saveState(state);
  } catch (e) {}
}

function loadEntries() {
  try {
    if (fs.existsSync(ENTRIES_FILE)) {
      return JSON.parse(fs.readFileSync(ENTRIES_FILE));
    }
  } catch (e) {}
  return {};
}

function saveEntries(data) {
  try {
    fs.writeFileSync(ENTRIES_FILE, JSON.stringify(data, null, 2));
  } catch (e) {}
}

function distributePrize(prize) {
  const first = Math.floor(prize * 0.6);
  const second = Math.floor(prize * 0.25);
  const third = Math.floor(prize * 0.15);
  const remainder = prize - first - second - third;
  return {
    1: first + remainder,
    2: second,
    3: third,
  };
}

module.exports = {
  loadState,
  saveState,
  appendLog,
  loadEntries,
  saveEntries,
  distributePrize,
  DATA_DIR,
  STATE_FILE,
  LOGS_FILE,
  ENTRIES_FILE,
};
