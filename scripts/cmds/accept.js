const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "accept",
    aliases: ['acp'],
    version: "1.0",
    author: "tsanta",
    countDown: 8,
    role: 2,
    shortDescription: "[👨‍💻] Accepte amis",
    longDescription: "accept users",
    category: "Admin",
  },

  onReply: async function ({ message, Reply, event, api, commandName }) {
    const permission = ["61552825191002", "100088104908849"];
 if (!permission.includes(event.senderID))
 return api.sendMessage("⚠️ | Seul admins peuvent utiliser ce commande", event.threadID, event.messageID);
    
    const { author, listRequest, messageID } = Reply;
    if (author !== event.senderID) return;
    const args = event.body.replace(/ +/g, " ").toLowerCase().split(" ");

    clearTimeout(Reply.unsendTimeout); // Clear the timeout if the user responds within the countdown duration

    const form = {
      av: api.getCurrentUserID(),
      fb_api_caller_class: "RelayModern",
      variables: {
        input: {
          source: "friends_tab",
          actor_id: api.getCurrentUserID(),
          client_mutation_id: Math.round(Math.random() * 19).toString()
        },
        scale: 3,
        refresh_num: 0
      }
    };

    const success = [];
    const failed = [];

    if (args[0] === "add") {
      form.fb_api_req_friendly_name = "FriendingCometFriendRequestConfirmMutation";
      form.doc_id = "3147613905362928";
    }
    else if (args[0] === "del") {
      form.fb_api_req_friendly_name = "FriendingCometFriendRequestDeleteMutation";
      form.doc_id = "4108254489275063";
    }
    else {
      return api.sendMessage("↪Choisissez [add / del] [numéro | rehetra]", event.threadID, event.messageID);
    }

    let targetIDs = args.slice(1);

    if (args[1] === "rehetra") {
      targetIDs = [];
      const lengthList = listRequest.length;
      for (let i = 1; i <= lengthList; i++) targetIDs.push(i);
    }

    const newTargetIDs = [];
    const promiseFriends = [];

    for (const stt of targetIDs) {
      const u = listRequest[parseInt(stt) - 1];
      if (!u) {
        failed.push(`Demande d'amis ${stt} introuvable in the list`);
        continue;
      }
      form.variables.input.friend_requester_id = u.node.id;
      form.variables = JSON.stringify(form.variables);
      newTargetIDs.push(u);
      promiseFriends.push(api.httpPost("https://www.facebook.com/api/graphql/", form));
      form.variables = JSON.parse(form.variables);
    }

    const lengthTarget = newTargetIDs.length;
    for (let i = 0; i < lengthTarget; i++) {
      try {
        const friendRequest = await promiseFriends[i];
        if (JSON.parse(friendRequest).errors) {
          failed.push(newTargetIDs[i].node.name);
        }
        else {
          success.push(newTargetIDs[i].node.name);
        }
      }
      catch (e) {
        failed.push(newTargetIDs[i].node.name);
      }
    }

    if (success.length > 0) {
      api.sendMessage(`✅ The ${args[0] === 'add' ? 'friend request' : 'friend request deletion'} has been processed for ${success.length} people:\n\n${success.join("\n")}${failed.length > 0 ? `\n» The following ${failed.length} people encountered errors: ${failed.join("\n")}` : ""}`, event.threadID, event.messageID);
    } else {
      api.unsendMessage(messageID); // Unsend the message if the response is incorrect
      return api.sendMessage("❎Invalid response. Please provide a valid response.", event.threadID);
    }

    api.unsendMessage(messageID); // Unsend the message after it has been processed
  },

  onStart: async function ({ event, api, commandName }) {
    const form = {
      av: api.getCurrentUserID(),
      fb_api_req_friendly_name: "FriendingCometFriendRequestsRootQueryRelayPreloader",
      fb_api_caller_class: "RelayModern",
      doc_id: "4499164963466303",
      variables: JSON.stringify({ input: { scale: 3 } })
    };
    const listRequest = JSON.parse(await api.httpPost("https://www.facebook.com/api/graphql/", form)).data.viewer.friending_possibilities.edges;
    let msg = "";
    let i = 0;
    for (const user of listRequest) {
      i++;
      msg += (`\n${i} 👇 \n▪︎Anarana: ${user.node.name}`
        + `\n▪︎ID: ${user.node.id}`
        + `\n▪︎Lien: ${user.node.url.replace("www.facebook", "fb")}`
        + `\n▪︎Date: ${moment(user.time * 1009).tz("Indian/Antananarivo").format("DD/MM/YYYY HH:mm:ss")}\n`);
    }
    api.sendMessage(`📄LISTE DEMANDE D'AMIS📄 \n\n${msg}\n\n↪Répondez cette message avec : [add / del] [numéro ou rehetra]\n Ex: ↪add 2\n Ex: ↪add rehetra`, event.threadID, (e, info) => {
      global.GoatBot.onReply.set(info.messageID, {
        commandName,
        messageID: info.messageID,
        listRequest,
        author: event.senderID,
        unsendTimeout: setTimeout(() => {
          api.unsendMessage(info.messageID); // Unsend the message after the countdown duration
        }, this.config.countDown * 20000) // Convert countdown duration to milliseconds
      });
    }, event.messageID);
  }
};
