const axios = require('axios');

module.exports = {
  config: {
    name: 'thony',
    version: '1.0',
    author: 'tsanta',
    role: 0,
    category: 'Ai-Chat',
    shortDescription: {
      en: `[🆓️] Ai gratuit`
    },
    longDescription: {
      en: `Just Ai`
    },
    guide: {
      en: '{pn}thony [question]'
    },
  },

  onStart: async function ({ api, event, args, usersData }) {
    try {
      const query = args.join(" ") || "Bonjour";
      const { name } = (await usersData.get(event.senderID));

      if (query) {
        api.setMessageReaction("⏳", event.messageID, (err) =&gt; console.log(err), true);
        const processingMessage = await api.sendMessage(
          `Attendez svp...`,
          event.threadID
        );

        const apiUrl = `https://lianeapi.onrender.com/@unregistered/api/thon?key=j86bwkwo-8hako-12C&amp;userName=${encodeURIComponent(name || "a user")}&amp;query=${encodeURIComponent(query)}`;
        const response = await axios.get(apiUrl);

        if (response.data &amp;&amp; response.data.message) {
          const trimmedMessage = response.data.message.trim();
          api.setMessageReaction("✅", event.messageID, (err) =&gt; console.log(err), true);
          await api.sendMessage({ body: trimmedMessage }, event.threadID, event.messageID);

          console.log(`Sent Thony's response to the user`);
        } else {
          throw new Error(`Invalid or #thony question`);
        }

        await api.unsendMessage(processingMessage.messageID);
      }
    } catch (error) {
      console.error(`❌ | Failed to get Thon's response: ${error.message}`);
      const errorMessage = `❌ | An error occurred. You can try typing your query again or resending it. There might be an issue with the server that's causing the problem, and it might resolve on retrying.`;
      api.sendMessage(errorMessage, event.threadID);
    }
  },
};
