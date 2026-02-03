const { Client, GatewayIntentBits } = require("discord.js");
const axios = require("axios");

// التوكن من Environment Variable
const TOKEN = process.env.TOKEN;

// رابط API وعدد القناة
const API = "https://roblox-api-production-08e4.up.railway.app/count";
const CHANNEL_ID = "1468033384176423064";

const INTERVAL = 1000; // تحديث كل ثانية

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

let messageToEdit = null;      // رسالة Online count
let bestMessageToEdit = null;  // رسالة Best number
let bestNumber = null;         // أعلى عدد وصل له البوت, null معناه None

client.once("ready", async () => {
  console.log("Bot ready!");

  try {
    const channel = await client.channels.fetch(CHANNEL_ID);

    // أول رسالة للعدد الحالي
    const msg = await channel.send("Online Roblox Script Users: **none**");
    messageToEdit = msg;

    // أول رسالة للـBest number
    const bestMsg = await channel.send("Best number: **None**");
    bestMessageToEdit = bestMsg;

    // تحديث كل ثانية
    setInterval(async () => {
      try {
        const res = await axios.get(API);
        const count = Number(res.data.online) || 0;

        // تحديث رسالة Online count
        if (messageToEdit) {
          await messageToEdit.edit(`Online Roblox Script Users: **${count}**`);
          client.user.setActivity(`Online: ${count}`);
        }

        // تحديث Best number فقط إذا العدد أكبر من الحالي
        if (bestNumber === null || count > bestNumber) {
          bestNumber = count;
          if (bestMessageToEdit) {
            await bestMessageToEdit.edit(`Best number: **${bestNumber}**`);
          }
        }

      } catch (e) {
        console.log("API or Discord edit error:", e.message);

        // fallback: لو الرسائل اختفت، ابعث رسائل جديدة
        try {
          const channel = await client.channels.fetch(CHANNEL_ID);

          if (!messageToEdit) {
            messageToEdit = await channel.send(`Online Roblox Script Users: **${Number(res?.data?.online) || 0}**`);
          }

          if (!bestMessageToEdit) {
            bestMessageToEdit = await channel.send(`Best number: **${bestNumber ?? "None"}**`);
          }

        } catch {}
      }
    }, INTERVAL);

  } catch (err) {
    console.log("Setup error:", err.message);
  }
});

client.login(TOKEN);
