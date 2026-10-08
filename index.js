require('dotenv').config();
const { Client } = require('discord.js-self');
const { appendLog, loadState, saveState } = require('./utils');
const { pickRandomMinigame } = require('./minigames');

const client = new Client({
  checkUpdate: false,
});

const MINIGAME_INTERVAL_MS = 2 * 24 * 60 * 60 * 1000;
const REACTION_DELAY_MS = 5000;

let activeMinigames = new Map();

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  appendLog({
    type: 'ready',
    user: client.user.tag,
    id: client.user.id,
    timestamp: Date.now()
  });
  scheduleNextMinigame();
});

client.on('message', (message) => {
  appendLog({
    type: 'message',
    guildId: message.guild ? message.guild.id : null,
    channelId: message.channel ? message.channel.id : null,
    messageId: message.id,
    authorId: message.author.id,
    authorTag: message.author.tag,
    content: message.content,
    hasEmbeds: message.embeds && message.embeds.length > 0,
    hasAttachments: message.attachments && message.attachments.size > 0,
    timestamp: Date.now()
  });

  if (message.author.id === client.user.id) {
    handleSelfMessage(message);
    return;
  }

  if (message.content && message.content.startsWith('!exec ')) {
    handleCommand(message);
  }
});

client.on('messageReactionAdd', (reaction, user) => {
  appendLog({
    type: 'reaction_add',
    guildId: reaction.message.guild ? reaction.message.guild.id : null,
    channelId: reaction.message.channel ? reaction.message.channel.id : null,
    messageId: reaction.message.id,
    userId: user.id,
    emoji: reaction.emoji && reaction.emoji.name,
    emojiId: reaction.emoji && reaction.emoji.id,
    timestamp: Date.now()
  });
});

client.on('messageReactionRemove', (reaction, user) => {
  appendLog({
    type: 'reaction_remove',
    guildId: reaction.message.guild ? reaction.message.guild.id : null,
    channelId: reaction.message.channel ? reaction.message.channel.id : null,
    messageId: reaction.message.id,
    userId: user.id,
    emoji: reaction.emoji && reaction.emoji.name,
    emojiId: reaction.emoji && reaction.emoji.id,
    timestamp: Date.now()
  });
});

client.on('messageUpdate', (oldMessage, newMessage) => {
  appendLog({
    type: 'message_update',
    guildId: newMessage.guild ? newMessage.guild.id : null,
    channelId: newMessage.channel ? newMessage.channel.id : null,
    messageId: newMessage.id,
    authorId: newMessage.author.id,
    oldContent: oldMessage.content,
    newContent: newMessage.content,
    timestamp: Date.now()
  });
});

function handleSelfMessage(message) {
  setTimeout(async () => {
    try {
      const msg = await message.channel.messages.fetch(message.id).catch(() => null);
      if (!msg) return;
      const reactions = msg.reactions.cache.values();
      for (const reaction of reactions) {
        try {
          await reaction.users.fetch();
          const meReacted = reaction.users.cache.has(client.user.id);
          if (!meReacted) {
            await reaction.users.remove(client.user).catch(() => {});
          }
          await msg.react(reaction.emoji).catch(() => {});
          appendLog({
            type: 'auto_react',
            guildId: msg.guild ? msg.guild.id : null,
            channelId: msg.channel.id,
            messageId: msg.id,
            emoji: reaction.emoji.name,
            emojiId: reaction.emoji.id,
            timestamp: Date.now()
          });
        } catch (e) {}
      }
    } catch (e) {}
  }, REACTION_DELAY_MS);
}

function handleCommand(message) {
  const args = message.content.slice(6).trim();
  if (!args) return;
  try {
    appendLog({
      type: 'command_exec',
      guildId: message.guild ? message.guild.id : null,
      channelId: message.channel.id,
      messageId: message.id,
      authorId: message.author.id,
      command: args,
      timestamp: Date.now()
    });
    message.channel.send(args).catch(() => {});
  } catch (e) {}
}

function scheduleNextMinigame() {
  setTimeout(async () => {
    try {
      await hostRandomMinigame();
    } catch (e) {
      appendLog({ type: 'minigame_error', error: e.message, timestamp: Date.now() });
    }
    scheduleNextMinigame();
  }, MINIGAME_INTERVAL_MS);
}

async function hostRandomMinigame() {
  const minigame = pickRandomMinigame();
  appendLog({
    type: 'minigame_host',
    minigame,
    timestamp: Date.now()
  });
}

if (process.env.DISCORD_TOKEN) {
  client.login(process.env.DISCORD_TOKEN);
} else {
  console.log('No DISCORD_TOKEN in .env; bot not logging in');
  appendLog({ type: 'info', message: 'no_token', timestamp: Date.now() });
}

module.exports = { client };
