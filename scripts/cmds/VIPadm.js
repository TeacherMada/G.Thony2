const { config } = global.GoatBot;
const { writeFileSync } = require("fs-extra");

module.exports = {
	config: {
		name: "vip",
		version: "1.6",
		author: "NTKhang",
		countDown: 5,
		role: 2,
		shortDescription: {
			vi: "Thêm, xóa, sửa quyền admin",
			en: "[👨‍💻] Gestion membre VIP"
		},
		category: "Admin",
		guide: {
			en: ' #vip add id (Add vip role for user)'
				+ '\n	  #vip remove id (Remove vip role of user)'
				+ '\n	  #vip list (List all vip)'
		}
	},

	langs: {
			en: {
			added: "✅ | Added VIP role for %1 users:\n%2",
			alreadyAdmin: "\n⚠️ | %1 users already have VIP role:\n%2",
			missingIdAdd: "⚠️ | Syntax error. \n #vip add ID",
			removed: "✅ | Removed VIP role of %1 users:\n%2",
			notAdmin: "⚠️ | %1 users don't have VIP role:\n%2",
			missingIdRemove: "⚠️ | Syntax error. \n #vip remove ID",
			listAdmin: "👑 | LISTE MEMBRE VIP:\n%1"
		}
	},

	onStart: async function ({ message, args, usersData, event, getLang }) {
		const permission = ["61552825191002","100088104908849"];
 if (!permission.includes(event.senderID))
 return api.sendMessage("⚠️ | Seul l'admin peuvent utiliser ce commande", event.threadID, event.messageID);
    switch (args[0]) {
			case "add":
			case "-a": {
				if (args[1]) {
					let uids = [];
					if (Object.keys(event.mentions).length > 0)
						uids = Object.keys(event.mentions);
					else if (event.messageReply)
						uids.push(event.messageReply.senderID);
					else
						uids = args.filter(arg => !isNaN(arg));
					const notAdminIds = [];
					const adminIds = [];
					for (const uid of uids) {
						if (config.adminBot.includes(uid))
							adminIds.push(uid);
						else
							notAdminIds.push(uid);
					}

					config.adminBot.push(...notAdminIds);
					const getNames = await Promise.all(uids.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));
					writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
					return message.reply(
						(notAdminIds.length > 0 ? getLang("added", notAdminIds.length, getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")) : "")
						+ (adminIds.length > 0 ? getLang("alreadyAdmin", adminIds.length, adminIds.map(uid => `• ${uid}`).join("\n")) : "")
					);
				}
				else
					return message.reply(getLang("missingIdAdd"));
			}
			case "remove":
			case "-r": {
				if (args[1]) {
					let uids = [];
					if (Object.keys(event.mentions).length > 0)
						uids = Object.keys(event.mentions)[0];
					else
						uids = args.filter(arg => !isNaN(arg));
					const notAdminIds = [];
					const adminIds = [];
					for (const uid of uids) {
						if (config.adminBot.includes(uid))
							adminIds.push(uid);
						else
							notAdminIds.push(uid);
					}
					for (const uid of adminIds)
						config.adminBot.splice(config.adminBot.indexOf(uid), 1);
					const getNames = await Promise.all(adminIds.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));
					writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
					return message.reply(
						(adminIds.length > 0 ? getLang("removed", adminIds.length, getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")) : "")
						+ (notAdminIds.length > 0 ? getLang("notAdmin", notAdminIds.length, notAdminIds.map(uid => `• ${uid}`).join("\n")) : "")
					);
				}
				else
					return message.reply(getLang("missingIdRemove"));
			}
			case "list":
			case "-l": {
				const getNames = await Promise.all(config.adminBot.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));
				return message.reply(getLang("listAdmin", getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")));
			}
			default:
				return message.SyntaxError();
		}
	}
};
