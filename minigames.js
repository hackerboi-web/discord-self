const { appendLog, loadEntries, saveEntries, distributePrize } = require('./utils');

const MINIGAMES = [
  'light_dark',
  'guess_number',
  'closest_wins',
  'speed_type',
  'guess_color',
];

function pickRandomMinigame() {
  const idx = Math.floor(Math.random() * MINIGAMES.length);
  return MINIGAMES[idx];
}

async function hostMinigame(client, guildId, channelId, minigame, prize = 100) {
  const entries = loadEntries();
  const key = `${guildId}:${channelId}:${Date.now()}`;
  entries[key] = {
    minigame,
    guildId,
    channelId,
    prize,
    startTime: Date.now(),
    entries: {},
    ended: false,
    winners: [],
  };
  saveEntries(entries);
  appendLog({ type: 'minigame_start', guildId, channelId, minigame, prize, key, timestamp: Date.now() });
  return key;
}

function recordEntry(key, userId, answer, value) {
  const entries = loadEntries();
  if (!entries[key] || entries[key].ended) return false;
  if (entries[key].entries[userId]) return false;
  entries[key].entries[userId] = { answer, value, time: Date.now() };
  saveEntries(entries);
  appendLog({ type: 'minigame_entry', key, userId, answer, value, timestamp: Date.now() });
  return true;
}

function endMinigame(key, winners = []) {
  const entries = loadEntries();
  if (!entries[key]) return null;
  entries[key].ended = true;
  entries[key].winners = winners.slice(0, 3);
  entries[key].endTime = Date.now();
  const prize = entries[key].prize || 0;
  const dist = distributePrize(prize);
  entries[key].prizes = {
    1: dist[1],
    2: dist[2],
    3: dist[3],
  };
  saveEntries(entries);
  appendLog({ type: 'minigame_end', key, winners, prizes: entries[key].prizes, timestamp: Date.now() });
  return entries[key];
}

module.exports = {
  MINIGAMES,
  pickRandomMinigame,
  hostMinigame,
  recordEntry,
  endMinigame,
};
