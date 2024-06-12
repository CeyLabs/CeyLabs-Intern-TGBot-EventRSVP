const { Telegraf } = require('telegraf');

const config = require('../src/config.json');
const eventInfo = require('../utils/event_info');
const registration = require('../utils/registration');

// Create the bot instance
const bot = new Telegraf(config.BOT_TOKEN);

// Set bot commands
bot.telegram.setMyCommands([
  { command: 'start', description: 'Greets the user and provides event details.' },
  { command: 'help', description: 'Provides help and usage instructions.' },
  { command: 'register', description: 'Register for the event' }
]).then(() => {
  console.log('Bot Commands set successfully!');
}).catch(console.error);


// /start - Greets the user and provides event details.
bot.start((ctx) => {
  ctx.reply('Welcome to the Event bot!. \nBelow are the event details:');
  eventInfo.sendEventDetails(ctx);
});

// /help - Provides help and usage instructions.
bot.command('help', (ctx) => {
  ctx.reply('Bot Commands:\n/start - Start the bot and get event details\n/register - Register for the event\n/help - Show the bot commands');
});

// /register - Initiates the ticket registration process.
bot.command('register', (ctx) => {
   registration.initiateRegistration(ctx);
});

// Handle text messages during registration
bot.on('text', ctx => {
  if (registration.isRegistrationInProgress(ctx.chat.id)) {
    registration.handleRegistration(ctx);
  } 
//   else if (!ctx.message.text.startsWith('/')) {
//     ctx.reply(`Sorry ${ctx.from.first_name}, I don't understand. Type /help for instructions.`);
// } else {
//     ctx.reply('Unknown command. Type /help for instructions.');
// }
});

// Launch bot
bot.launch().then(() => {
  console.log('Bot is up and running');
}).catch(console.error);



// const express = require('express');

// const app = express();
// const port = 3001;
// app.get('/', (req, res) => {
//   res.send('Hello Bot!');
// });

// //Server port
// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });