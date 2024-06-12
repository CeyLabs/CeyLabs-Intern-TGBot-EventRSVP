const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'users.json');

// Load user information from the database file
function loadUserInfo() {
  if (!fs.existsSync(dbPath)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}

// Save user information to the database file
function saveUserInfo(userInfo) {
  const users = loadUserInfo();
  users.push(userInfo);
  fs.writeFileSync(dbPath, JSON.stringify(users, null, 2));
}

// Retrieve a user by chatId
function getUserByChatId(chatId) {
  const users = loadUserInfo();
  return users.find(user => user.chatId === chatId);
}

module.exports = {
  loadUserInfo,
  saveUserInfo,
  getUserByChatId
};


