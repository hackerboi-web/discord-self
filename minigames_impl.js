const { appendLog, loadEntries, saveEntries } = require('./utils');

const COLORS = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'black', 'white'];

function generatePhrase() {
  const phrases = [
    'fast fingers win',
    'type this exact phrase',
    'speed matters here',
    'quick on the keys',
  ];
  const p = phrases[Math.floor(Math.random() * phrases.length)];
  return `\`${p}\``;
}

async function runLightDark(client, guildId, channelId) {
  return { type: 'light_dark', prompt: 'Light or Dark? (pick one)' };
}

async function runGuessNumber(client, guildId, channelId) {
  const target = Math.floor(Math.random() * 91) + 5;
  return { type: 'guess_number', prompt: `Guess the number between 5 and 95!`, target };
}

async function runClosestWins(client, guildId, channelId) {
  const target = Math.floor(Math.random() * 91) + 5;
  return { type: 'closest_wins', prompt: `Closest to ${target} wins after 30 seconds! (1 guess per person)`, target, duration: 30000 };
}

async function runSpeedType(client, guildId, channelId, replyToId) {
  const phrase = generatePhrase();
  return { type: 'speed_type', prompt: `Reply to me with the exact phrase: ${phrase}`, phrase: phrase.replace(/`/g, ''), replyToId };
}

async function runGuessColor(client, guildId, channelId) {
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  return { type: 'guess_color', prompt: `Guess the color: ${COLORS.join(', ')}`, answer: color };
}

module.exports = {
  runLightDark,
  runGuessNumber,
  runClosestWins,
  runSpeedType,
  runGuessColor,
  COLORS,
};
