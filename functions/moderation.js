const { mainChat } = require('../config');

module.exports = {
  name: 'moderation',
  async getUserFullName(userId, vk) {
    return vk.api.users.get({ user_ids: [userId] })
      .then((users) => `${users[0].first_name} ${users[0].last_name}`)
      .catch(() => 'Не признал');
  },
  async sendMessageToChat(message, ctx) {
    if (!message) return false;

    return ctx.send({ message, attachment: ctx.attachments, peer_id: mainChat, dont_parse_links: true });
  },
  getDeleteOptions(ctx) {
    return {
      peer_id                 : ctx.peerId,
      conversation_message_ids: [ctx.conversationMessageId],
      delete_for_all          : 1,
    };
  },
  async init(ctx, next, vk) {
    const { text, senderId, attachments } = ctx;

    if (!ctx.isUser || !ctx.isChat) return;

    const deleteOptions = this.getDeleteOptions(ctx);

    vk.api.messages.delete(deleteOptions)
      .then(() => this.getUserFullName(ctx.senderId, vk))
      .then((userFullName) => {
        const firstAttachment = { ...attachments[0] };
        const hasAllowedAttachment = !!attachments.length && !['doc', 'poll'].includes(firstAttachment.type);

        if (!text && !hasAllowedAttachment) return false;

        const message = ['Перехвачено, подло отправленное, сообщение', `Отправитель: @id${senderId} (${userFullName})`];

        if (text) message.push(`Сообщение: ${text}`);

        return message.join('\n');
      })
      .then((message) => this.sendMessageToChat(message, ctx))
      .catch(console.error);
  },
};
