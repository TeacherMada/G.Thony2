const parseTime = (timeString) => {
  const [hours, minutes, seconds] = timeString.split('|').map(Number);
  return { hours, minutes, seconds };
};

module.exports = {
  config: {
    name: "rappel",
    version: "1.0",
    role: 0,
    author: "Samir Œ",
    shortDescription: "[🆓️] Rappel moi",
    longDescription: "Rappel un événement..",
    category: "outils",
    guide: "#rappel <message> | <heures> | <minutes> | <secondes>",
  },

  onStart: async function ({ api, event, args }) {
    const reminderInfo = args.join(" ").split("|").map((info) => info.trim());

    if (reminderInfo.length !== 4) {
      return api.sendMessage("▪︎CODE: #rappel <message> | <heures> | <minutes> | <secondes> \n\n ▪︎Ex: #rappel J'ai un rendez-vous à 10h | 0 | 5 | 24", event.threadID);
    }

    const [message, hours, minutes, seconds] = reminderInfo;

    const userID = event.senderID;
    const reminderTime = parseTime(`${hours}|${minutes}|${seconds}`);
    const reminderMilliseconds = (reminderTime.hours * 3600 + reminderTime.minutes * 60 + reminderTime.seconds) * 1000;

    setTimeout(() => {
      api.sendMessage(message, userID);
    }, reminderMilliseconds);

    return api.sendMessage(`✅ C'est noté! Je vous rappelle 《${message}》 après ${hours} heures, ${minutes} minutes, et ${seconds} secondes.`, event.threadID);
  }
};
