// add this in new code ↓
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const vipData = fs.readFileSync(path.join(__dirname, "vip.json"), "utf8");
const vipJson = JSON.parse(vipData);
function isVip(senderID) {
  return vipJson.permission.includes(senderID.toString());
}
// add this in new code ↑                                              

module.exports = {
	config: {
		name: 'mayra',
		version: '2.5.4',
		author: 'Deku', // credits owner of this api
		role: 0,
		category: 'Ai',
		shortDescription: {
			en: '[👑] Mayra Ai  pro',
		},
		guide: {
			en: '{pn} [prompt]',
		},
	},

	onStart: async function ({ api, event, args }) {
		 if (!isVip(event.senderID)) {
      api.sendMessage("Vous n'avez pas le droit d'utiliser cette commande. \n\n👑 ABONNEMENT VIP 5000Ar/mois \n 038.22.222.02 \n\nVeuillez Contacter mon Admin: 👇 \n https://www.facebook.com/profile.php?id=100088104908849", event.threadID, event.messageID);
      return;
    }
    
// normal code ↓
   
    const axios = require("axios");
		let prompt = args.join(" "),
			uid = event.senderID,
			url;
		if (!prompt) return api.sendMessage(`1▪︎ #mayra [Question] 
-Ex: #Mayra Salut ! 

 2▪︎ #mayra [répondre une photo] [questions]
 -Ex: #mayra Faites cet exercice`, event.threadID);
		api.sendTypingIndicator(event.threadID);
		try {
			const geminiApi = `https://gemini-api.replit.app`;
			if (event.type == "message_reply") {
				if (event.messageReply.attachments[0]?.type == "photo") {
					url = encodeURIComponent(event.messageReply.attachments[0].url);
					const res = (await axios.get(`${geminiApi}/gemini?prompt=${prompt}&url=${url}&uid=${uid}`)).data;
					return api.sendMessage(res.gemini, event.threadID);
				} else {
					return api.sendMessage('Please reply to an image.', event.threadID);
				}
			}
			const response = (await axios.get(`${geminiApi}/gemini?prompt=${prompt}&uid=${uid}`)).data;
			return api.sendMessage(response.gemini, event.threadID);
		} catch (error) {
			console.error(error);
			return api.sendMessage('❌ | An error occurred. You can try typing your query again or resending it. There might be an issue with the server that\'s causing the problem, and it might resolve on retrying.', event.threadID);
		}
	}
};
