require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");
const axios = require("axios");

const TOKEN = process.env.TOKEN;
const API = "https://roblox-api-production-08e4.up.railway.app/count";
const CHANNEL_ID = "1468033384176423064";
const INTERVAL = 1000;

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

let messageToEdit = null;

client.once("clientReady", async () => {
  console.log("Bot ready!");

  try {
    const channel = await client.channels.fetch(CHANNEL_ID);

    // first message
    messageToEdit = await channel.send(
      "Online Roblox Script Users: **none**"
    );

    // auto update
    setInterval(async () => {
      try {
        const res = await axios.get(API, { timeout: 5000 });

        const count = Number(res.data.online) || 0;

        await messageToEdit.edit(
          `Online Roblox Script Users: **${count}**`
        );

        client.user.setActivity(`Online: ${count}`);
      } catch (err) {
        console.log("Update failed:", err.message);
      }
    }, INTERVAL);

  } catch (err) {
    console.log("Setup error:", err.message);
  }
});

client.login(TOKEN);