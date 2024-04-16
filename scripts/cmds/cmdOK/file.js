const fs = require('fs');

module.exports = {
	config: {
		name: "file",
		aliases: ["files"],
		version: "1.0",
		author: "Mahir Tahsan",
		countDown: 5,
		role: 2,
		shortDescription: "[👨‍🔧] De admin",
		longDescription: "Send bot specified file ",
		category: "dev",
		guide: "{pn} file name. Ex: .{pn} filename"
	},

	onStart: async function ({ message, args, api, event }) {
		
const permission = ["61552825191002"];
 if (!permission.includes(event.senderID))
 return api.sendMessage("⚠ | Seul nos développeurs peuvent utiliser ce commande", event.threadID, event.messageID);

		const fileName = args[0];
		if (!fileName) {
			return api.sendMessage("Please provide a file name.", event.threadID, event.messageID);
		}

		const filePath = __dirname + `/${fileName}.js`;
		if (!fs.existsSync(filePath)) {
			return api.sendMessage(`File not found: ${fileName}.js`, event.threadID, event.messageID);
		}

		const fileContent = fs.readFileSync(filePath, 'utf8');
		api.sendMessage({ body: fileContent }, event.threadID);
	}
};
