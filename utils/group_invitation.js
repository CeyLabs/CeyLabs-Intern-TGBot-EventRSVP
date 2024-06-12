const config = require('../src/config.json');

/**
 * Invite a user to the Telegram group.
 * @param {Object} ctx - The Telegram context.
 * @param {number} chatId - The chat ID of the user.
 */

function inviteUserToGroup(ctx,chatId) {
  const groupInviteLink = config.GROUP_INVITE_LINK;
  if (groupInviteLink) {
    ctx.telegram.sendMessage(chatId, `Join our group: ${groupInviteLink}`);
  } else {
    ctx.telegram.sendMessage(chatId, 'Group invitation link is not available.');
  }
}

module.exports = {
  inviteUserToGroup
};
