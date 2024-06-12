const fs = require('fs');
const path = require('path');

const registrationFilePath = path.join(__dirname, 'registration.json');
const { inviteUserToGroup } = require('./group_invitation');
const { saveUserInfo } = require('./database');

// Load registration steps from a file
function loadRegistrationData() {
  if (!fs.existsSync(registrationFilePath)) {
    return {};
  }
  return JSON.parse(fs.readFileSync(registrationFilePath, 'utf8'));
}

// Save registration steps to a file
function saveRegistrationData(steps) {
  fs.writeFileSync(registrationFilePath, JSON.stringify(steps, null, 2));
}

// Start the registration process
function initiateRegistration(ctx) {
  const steps = loadRegistrationData();
  const chatId = ctx.chat.id;
  steps[chatId] = { step: 1 };
  saveRegistrationData(steps);
  ctx.reply('Please enter your name:');
}

// Continue the registration process based on the current step
function handleRegistration(ctx) {
  const steps = loadRegistrationData();
  const chatId = ctx.chat.id;
  const text = ctx.message.text;

  if (steps[chatId].step === 1) {
    if (isValidName(text)) {
      steps[chatId] = { ...steps[chatId], name: text.trim(), step: 2 };
      saveRegistrationData(steps);
      ctx.reply('Please enter your email:');
    } else {
      ctx.reply('Invalid name. Please enter a valid name:');
    }
  } else if (steps[chatId].step === 2) {
    if (isValidEmail(text)) {
      steps[chatId] = { ...steps[chatId], email: text.trim().toLowerCase(), step: 3 };
      saveRegistrationData(steps);
      ctx.reply('How many tickets do you need?');
    } else {
      ctx.reply('Invalid email. Please enter a valid email:');
    }
  } else if (steps[chatId].step === 3) {
    const tickets = parseInt(text.trim(), 10);
    if (!isNaN(tickets) && tickets > 0) {
      steps[chatId] = { ...steps[chatId], tickets, step: 4 };
      saveRegistrationData(steps);
      ctx.reply(`Please confirm your registration:\nName: ${steps[chatId].name}\nEmail: ${steps[chatId].email}\nTickets: ${tickets}\n\nType 'yes' to confirm or 'no' to cancel.`);
    } else {
      ctx.reply('Invalid number. Please enter a valid number of tickets:');
    }
  } else if (steps[chatId].step === 4) {
    if (text.toLowerCase() === 'yes') {
      const { name, email, tickets } = steps[chatId];
      const uniqueID = `${name}_${Date.now()}`;
      const userInfo = { chatId, name, email, tickets, id: uniqueID };

      // Save user information to the database
      saveUserInfo(userInfo); 
      ctx.reply(`Thank you, ${name}! Your request for ${tickets} tickets has been received. Your unique ID is ${uniqueID}.`);
      
      // Add user to group
      inviteUserToGroup(ctx, ctx.chat.id);
      delete steps[chatId];
      saveRegistrationData(steps);
    } else if (text.toLowerCase() === 'no') {
      ctx.reply('Registration cancelled.');
      delete steps[chatId];
      saveRegistrationData(steps);
    } else {
      ctx.reply("Invalid response. Type 'yes' to confirm or 'no' to cancel.");
    }
  }
}

// Check if the user is currently in the registration process
function isRegistrationInProgress(chatId) {
  const steps = loadRegistrationData();
  return !!steps[chatId];
}

// Validate email format
function isValidEmail(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}

// Validate name format
function isValidName(name) {
  return /^[a-zA-Z ]+$/.test(name);
}

module.exports = {
  initiateRegistration,
  handleRegistration,
  isRegistrationInProgress
};
