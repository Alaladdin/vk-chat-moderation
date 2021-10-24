module.exports = {
  name: 'moderation',
  async init(ctx, next, vk) {
    const { text, conversationMessageId } = ctx;

    if (!text) return;

    vk.api.messages.delete({
      peer_id                 : ctx.peerId,
      conversation_message_ids: [conversationMessageId],
      delete_for_all          : 1,
    }).catch(() => {});
  },
};
