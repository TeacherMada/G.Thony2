const axios = require('axios');

const ArYAN = ['thony', 'tonny', 'thonny'];

module.exports = {
  config: {
    name: 'thony',
    version: '1.0.1',
    author: 'ArYAN | OpenAi',
    role: 0,
    category: 'ai',
    longDescription: {
      en: 'Ai thony.',
    },
    guide: {
      en: '\nAi < questions >\n\n🔎 𝗚𝘂𝗶𝗱𝗲\nthony what is capital of France?',
    },
  },
  langs: {
    en: {
      final: "",
      loading: 'Attendez svp...'
    }
  },
  onStart: async function () {},

  onChat: async function ({ api, event, args, getLang, message }) {
    try {
      // Check for prefix in the event body
      const prefix = ArYAN.find((p) => event.body && event.body.toLowerCase().startsWith(p));
      if (!prefix) {
        console.log("No valid prefix found.");
        return;
      }

      // Extract prompt
      const prompt = event.body.substring(prefix.length).trim();
      console.log(`Prompt: ${prompt}`);

      // Send loading message
      const loadingMessage = getLang("loading");
      const loadingReply = await message.reply(loadingMessage);

      // Make API request
      const apiUrl = `https://liaspark.chatbotcommunity.ltd/@unregistered/api/thon?key=j86bwkwo-8hako-12C&query=${encodeURIComponent(prompt)}`;
      console.log(`Making API request to: ${apiUrl}`);
      const response = await axios.get(apiUrl);

      // Log the full response
      console.log(`API Response status: ${response.status}`);
      console.log(`API Response data: ${JSON.stringify(response.data)}`);

      // Check for valid response
      if (response.status !== 200 || !response.data || !response.data.message) {
        throw new Error('Invalid or missing response from API');
      }

      // Prepare and send final message
      const messageText = response.data.message;
      const finalMsg = `${messageText}`;
      api.editMessage(finalMsg, loadingReply.messageID);
      console.log('Sent answer as a reply to user');

    } catch (error) {
      console.error(`Failed to get answer: ${error.message}`);
      if (error.response) {
        // The request was made and the server responded with a status code that falls out of the range of 2xx
        console.error(`Error data: ${JSON.stringify(error.response.data)}`);
        console.error(`Error status: ${error.response.status}`);
        console.error(`Error headers: ${JSON.stringify(error.response.headers)}`);
        api.sendMessage(`Error: ${error.message}. Status: ${error.response.status}. Data: ${JSON.stringify(error.response.data)}.`, event.threadID);
      } else if (error.request) {
        // The request was made but no response was received
        console.error(`No response received: ${JSON.stringify(error.request)}`);
        api.sendMessage(`Error: No response received from the API.`, event.threadID);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error(`Error setting up request: ${error.message}`);
        api.sendMessage(`Error setting up request: ${error.message}.`, event.threadID);
      }
    }
  }
};
