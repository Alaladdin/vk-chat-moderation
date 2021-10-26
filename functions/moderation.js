const { mainChat } = require('../config');

module.exports = {
  name: 'moderation',
  async sendMessageToChat(message, ctx) {
    return ctx.send({ message, attachment: ctx.attachments, peer_id: mainChat, dont_parse_links: true });
  },
  async init(ctx, next, vk) {
    const { text, senderId, attachments, conversationMessageId } = ctx;

    if (!ctx.isUser) return;

    vk.api.messages.delete({
      peer_id                 : ctx.peerId,
      conversation_message_ids: [conversationMessageId],
      delete_for_all          : 1,
    })
      .then(() => {
        const attachment = { ...attachments[0] };
        const hasAllowedAttachment = !!attachments.length && attachment.type !== 'doc';
        const message = ['Перехвачено, подло отправленное, сообщение', `@id${senderId} (Отправитель)`];

        if (text) message.push(`Сообщение: ${text}`);
        if (text || hasAllowedAttachment) this.sendMessageToChat(message.join('\n'), ctx);
      })
      .catch(console.error);
  },
};
