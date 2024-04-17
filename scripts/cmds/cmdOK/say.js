const axios = require('axios');

module.exports = {
  config: {
    name: "say",
    aliases: ["parle"],
    version: "1.0",
    author: "tsanta",
    countDown: 5,
    role: 2,
    shortDescription: "[👑] Texte_to_Audio",
    longDescription: "female Voice",
    category: "audio",
    guide: "{pn} {{<say>}}"
  },

  onStart: async function ({ api, message, args, event }) {
    let lng = "fr";
    let say;

    // Add more language codes
    const languages = ["en", "fr", "es", "de", "it", "pt", "ja", "ko", "zh-CN", "ar", "hi", "ru", "tr", "vi", "nl", "sv", "fi", "da", "no", "pl", "hu", "cs"];

    // Check if the first argument is a valid language code
    if (args.length > 1 && languages.includes(args[0])) {
      lng = args[0]; // Set language code
      args.shift(); // Remove the language code from the arguments
      say = encodeURIComponent(args.join(" ")); // Join the rest of the arguments
    } else {
      say = encodeURIComponent(args.join(" "));
    }

    try {
      // Add "⏳" reaction while waiting
      api.setMessageReaction("⏳", event.messageID, (err) => {
        if (err) console.error("Error setting reaction:", err);
      }, true);

      let url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lng}&client=tw-ob&q=${say}`;

      message.reply({
        body: "",
        attachment: await global.utils.getStreamFromURL(url)
      });

      // Add "✅" reaction upon success
      api.setMessageReaction("✅", event.messageID, (err) => {
        if (err) console.error("Error setting reaction:", err);
      }, true);
    } catch (e) {
      console.log(e);
      message.reply(`🐸 error\n\n Ex: #say en Hello everyone`);
    }
  }
};
