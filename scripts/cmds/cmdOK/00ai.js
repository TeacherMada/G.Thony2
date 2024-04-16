const axios = require('axios');

const Prefixes = [
  'uchiwa',
  'bot',
  'ia',
  'guy',
  'sasuke',
  'ai',
  'ask',
];

module.exports = {
  config: {
    name: "ask",
    version: 1.0,
    author: "OtinXSandip",
    longDescription: "AI",
    category: "ai",
    guide: {
      en: "{p} questions",
    },
  },
  onStart: async function () {},
  onChat: async function ({ api, event, args, message }) {
    try {
      
      const prefix = Prefixes.find((p) => event.body && event.body.toLowerCase().startsWith(p));
      if (!prefix) {
        return; // Invalid prefix, ignore the command
      }
      const prompt = event.body.substring(prefix.length).trim();
   if (!prompt) {
        await message.reply("Veuillez poser la question à votre convenance et je m'efforcerai de vous fournir une réponse efficace🤓. Votre satisfaction est ma priorité absolue😼.");
        return;
      }

await message.reply("🧘🏾‍♂|veillez Patientez s'il-vous-plait...");

      const response = await axios.get(`https://sandipbaruwal.onrender.com/gpt?prompt=${encodeURIComponent(prompt)}`);
      const answer = response.data.answer;

 
    await message.reply(answer);

    } catch (error) {
      console.error("Error:", error.message);
    }
  }
};
