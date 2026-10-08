# discord.js-self v12 + Flask Dashboard

Complete selfbot with web dashboard, full logging, auto-reaction mirroring, command execution, and minigame framework.

## Features

- **Full Logging**: All messages, reactions, updates logged to JSON with timestamps
- **Web Dashboard**: Flask UI at `http://localhost:5000` showing live logs and entries
- **Auto-React**: After 5 seconds, mirrors all reactions that exist on your messages (works with bot messages too)
- **Command Execution**: `!exec <command>` sends command text back to channel (use commands from other bots)
- **Minigames Framework**: Random minigame hosting every ~2 days (configurable). Prize distribution: 1st 60%, 2nd 25%, 3rd 15%
  - light/dark, guess the number (5-95), closest wins (30s, 1 guess per person), speed type (reply with exact phrase in backticks), guess the color
- **Entry Tracking**: All minigame entries logged in `.json` files

## Quick Start

```bash
npm install
cp .env.example .env  # add your DISCORD_TOKEN
# Bot only
npm start
# Dashboard only
npm run web
# Both
./start.sh
```

## API Endpoints

- `GET /` - Dashboard UI
- `GET /api/logs?limit=N` - Recent logs
- `GET /api/logs/all` - All logs
- `GET /api/state` - Full state
- `GET /api/entries` - Minigame entries

## Data Files

- `data/logs.json` - All action logs
- `data/state.json` - System state
- `data/entries.json` - Minigame entries and winners

## Notes

Selfbots violate Discord's Terms of Service. Use at your own risk. Never commit your `.env` file or share your token.
