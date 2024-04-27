const axios = require("axios");

module.exports = {
	config: {
		name: "notify",
		aliases: [],
		version: "1.0",
		author: "Kshitiz",
		countDown: 5,
		role: 2,
		shortDescription: "[👨‍💻] Send a message to all users",
		longDescription: "",
		category: "admin",
		guide: {
			en: "{pn} <message>",
		},
	},

	onStart: async function ({ api, event, args, message }) {
		const messageText = args.join(" ");

		try {
			const friendsList = await api.getFriendsList();

			if (friendsList.length === 0) {
				await api.sendMessage('No friends found.', event.threadID);
				return;
			}

			for (const friend of friendsList) {
				await api.sendMessage(messageText, friend.userID);
			}

			api.sendMessage(`✅ Notification sent to all friends.`, event.threadID, event.messageID);
		} catch (error) {
			api.sendMessage(`An error occurred while sending notifications.`, event.threadID);
			console.error(error);
		}
	},
};
