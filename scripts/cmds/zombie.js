const axios = require("axios")
const fs = require("fs");

module.exports = {
  config: {
    name: "zombie",
    aliases: [],
    author: "tsanta",
    version: "69",
    cooldown : 25,
    role: 2,
    shortDescription: {
      en: "[👑] image to Zombie"
    },
    longDescription: {
      en: "Zombie filter"
    },
    category: "image",
    guide: {
      en: "{p}{n} [reply to image or image url]"
    }
  },

onStart: async function({ api, event, args }) {
  const { threadID, messageID } = event;
  if (event.type == "message_reply") {
    var t = event.messageReply.attachments[0].url
  } else {
    var t = args.join(" ");
  }
  try {
    api.sendMessage("Je vais transformer votre image en Zombie...", threadID, messageID);
    const r = await axios.get("https://free-api.ainz-sama101.repl.co/canvas/toZombie?", {
      params: {
        url: encodeURI(t)
      }
    });
    const result = r.data.result.image_data;
    let ly = __dirname + "/cache/zombie.png";
    let ly1 = (await axios.get(result, {
      responseType: "arraybuffer"
    })).data;
    fs.writeFileSync(ly, Buffer.from(ly1, "utf-8"));
    return api.sendMessage({ attachment: fs.createReadStream(ly) }, threadID, () => fs.unlinkSync(ly), messageID)
  } catch (e) {
    console.log(e.message);
    return api.sendMessage("Error.\n" + e.message, threadID, messageID)
   }
  }
};
