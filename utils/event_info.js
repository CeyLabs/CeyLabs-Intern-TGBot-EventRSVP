const fs = require('fs');
const path = require('path');

const eventInfoPath = path.join(__dirname, 'event_info.txt');

/**
 * Get event details from the event information file.
 * @returns {string} Event details as a string.
 */

function getEventDetails() {
  if (!fs.existsSync(eventInfoPath)) {
    return 'No event details available.';
  }
  return fs.readFileSync(eventInfoPath, 'utf8');
}

/**
 * Send event details to the user.
 * @param {Object} ctx - The Telegram context.
 */

function sendEventDetails(ctx) {
  const eventDetails = getEventDetails();
  ctx.reply(eventDetails);
}

module.exports = {
    sendEventDetails
};
