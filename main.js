const sendNotification = require("./notif");
require("dotenv").config();
const {
  Client,
  RichPresence,
  CustomStatus,
} = require("discord.js-selfbot-v13");
const fs = require("fs");
const path = require("path");

const client = new Client({ checkUpdate: false });

const status = new RichPresence(client)
  .setApplicationId("1000410111833018378")
  .setType("STREAMING")
  .setURL("https://www.twitch.tv/tuturp33")
  .setState("Administrer sur SwiftBot")
  .setName("SwiftBot")
  .setDetails("SwiftBot")
  .setStartTimestamp(Date.now())
  .setAssetsLargeImage("1213862750451929138")
  .setAssetsLargeText("Rejoins nous sur Discord")
  .setAssetsSmallImage("1213863166874746910")
  .setAssetsSmallText("TuturP33")
  .addButton("Serveur Discord", "https://discord.gg/zP7sHFpTZX")
  .addButton(
    "Bot Discord",
    "https://discord.com/api/oauth2/authorize?client_id=1204577464903409674&permissions=8&scope=applications.commands%20bot"
  );

const customs = new CustomStatus(client)
  .setEmoji("👀")
  .setState("Regarde vos messages !");

const notificationsFile = path.join(__dirname, "notifications.json");
let notifications = new Set();

// Load notifications from JSON file
if (fs.existsSync(notificationsFile)) {
  const data = fs.readFileSync(notificationsFile, "utf-8");
  notifications = new Set(JSON.parse(data));
}

// Save notifications to JSON file
function saveNotifications() {
  fs.writeFileSync(
    notificationsFile,
    JSON.stringify([...notifications], null, 2)
  );
}

client.on("ready", async () => {
  console.log(`${client.user.username} is ready!`);
  sendNotification("SelfBot", "Le selfbot Discord est en ligne !", 1);
  client.user.setPresence({ activities: [status, customs] });

  setInterval(async () => {
    const channel = client.channels.cache.get("1354502169742541043");
    await channel.sendSlash("1354503814769672345", "ping");
  }, 24 * 60 * 60 * 1000);

  process.on("unhandledRejection", (reason, p) => {
    console.log(" [antiCrash] :: Unhandled Rejection/Catch");
    console.log(reason, p);
  });

  process.on("uncaughtException", (err, origin) => {
    console.log(" [antiCrash] :: Uncaught Exception/Catch");
    console.log(err, origin);
  });
});

client.on("messageCreate", async (message) => {
  if (message.author.id === client.user.id) {
    const args = message.content.split(" ");
    const command = args.shift().toLowerCase();

    if (command === "!addnotif") {
      const serverId = args[0] || message.guild?.id;
      if (!serverId) {
        return message.reply(
          "Impossible de déterminer le serveur. Fournissez un ID ou utilisez cette commande dans un serveur."
        );
      }
      notifications.add(serverId);
      saveNotifications();
      message.reply(
        `Notifications activées pour le serveur avec l'ID: ${serverId}`
      );
    } else if (command === "!supnotif") {
      const serverId = args[0] || message.guild?.id;
      if (!serverId) {
        return message.reply(
          "Impossible de déterminer le serveur. Fournissez un ID ou utilisez cette commande dans un serveur."
        );
      }
      if (notifications.delete(serverId)) {
        saveNotifications();
        message.reply(
          `Notifications désactivées pour le serveur avec l'ID: ${serverId}`
        );
      } else {
        message.reply(
          `Aucune notification trouvée pour le serveur avec l'ID: ${serverId}`
        );
      }
    } else if (command === "!listnotif") {
      if (notifications.size === 0) {
        message.reply("Aucune notification activée.");
      } else {
        message.reply(
          `Notifications activées pour les serveurs: ${[...notifications].join(
            ", "
          )}`
        );
      }
    }
  } else {
    if (message.channel.type === "DM") {
      sendNotification(message.author.tag, message.content, 1);
    } else if (message.channel.type === "GROUP_DM") {
      if (message.channel.name) {
        sendNotification(message.channel.name, message.content, 1);
      } else {
        sendNotification(
          message.channel.recipients.map((r) => r.tag).join(", "),
          message.content,
          1
        );
      }
    } else if (message.guild && notifications.has(message.guild.id)) {
      sendNotification(message.guild.name, message.content, 1);
    }
  }
});

client.login(process.env.TOKEN);
