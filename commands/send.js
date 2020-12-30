module.exports = {
  name: "send",
  execute(sendVar, message) {
    message.channel.send(sendVar);
  },
};
