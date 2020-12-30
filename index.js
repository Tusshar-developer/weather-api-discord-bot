const Discord = require("discord.js");
const client = new Discord.Client();
const request = require("request");

const fs = require("fs");

client.commands = new Discord.Collection();

const commandFiles = fs
  .readdirSync("./commands/")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  client.commands.set(command.name, command);
}

client.on("ready", () => console.log("I am ready!"));

client.on("message", (message) => {
  if (message.author.bot) return;
  var args = message.content.split(/ +/);
  var command = args.shift().toLowerCase();
  var userLocation = args.shift().toLowerCase();

  // Functions
  /*******************************************************************/

  const send = (msgValue) =>
    client.commands.get("send").execute(msgValue, message);
  const temp = () =>
    client.commands
      .get("temp")
      .execute(Discord, request, message, userLocation, send);
  const forecast = () =>
    client.commands
      .get("forecast")
      .execute(Discord, request, send, message, args, userLocation);

  /*******************************************************************/

  if (command === "temp") {
    temp();
    return;
  }

  if (command === "forecast") {
    forecast();
    return;
  }
});

const config = require("./config.json");
client.login(config.token);
