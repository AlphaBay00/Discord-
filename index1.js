const { Client, GatewayIntentBits } = require("discord.js");
const axios = require("axios");

// التوكن يقرأ من Environment Variable في Railway
const TOKEN = process.env.TOKEN;

// رابط API وعدد القناة
const API = "https://roblox-api-production-08e4.up.railway.app/count";
const CHANNEL_ID = "1468033384176423064";

const INTERVAL = 1000; // تحديث كل ثانية

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

let messageToEdit = null;

client.once("ready", async () => {
  console.log("Bot ready!");

  try {
    const channel = await client.channels.fetch(CHANNEL_ID);

    // أول رسالة تظهر "none"
    const msg = await channel.send("Online Roblox Script Users: **none**");
    messageToEdit = msg;

    // تحديث الرسالة كل ثانية حسب عدد اللاعبين من API
    setInterval(async () => {
      try {
        const res = await axios.get(API);
        const count = Number(res.data.online) || 0;

        await messageToEdit.edit(`Online Roblox Script Users: **${count}**`);
        client.user.setActivity(`Online: ${count}`);
      } catch (e) {
        console.log("API error:", e.message);
      }
    }, INTERVAL);

  } catch (err) {
    console.log("Setup error:", err.message);
  }
});

client.login(TOKEN);
