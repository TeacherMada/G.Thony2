const moment = require("moment-timezone");
const axios = require("axios");

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
      return api.sendMessage("⚠ | Seul admins peuvent utiliser ce commande", event.threadID, event.messageID);

    const { author, listRequest, messageID } = Reply;
    if (author !== event.senderID) return;
    const args = event.body.replace(/ +/g, " ").toLowerCase().split(" ");

    clearTimeout(Reply.unsendTimeout);

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
          success.push(newTargetIDs[i]);
        }
      }
      catch (e) {
        failed.push(newTargetIDs[i].node.name);
      }
    }

    if (success.length > 0) {
      const successNames = success.map(user => user.node.name);
      api.sendMessage(`✅ The ${args[0] === 'add' ? 'friend request' : 'friend request deletion'} has been processed for ${successNames.length} people:\n\n${successNames.join("\n")}${failed.length > 0 ? `\n» The following ${failed.length} people encountered errors: ${failed.join("\n")}` : ""}`, event.threadID, event.messageID);

      // Send a message to each user who accepted the friend request
      success.forEach(async (user) => {
        try {
          // Send a message to the user who accepted the friend request
          await api.sendMessage(`🎉 Bonjour ${user.node.name} !
Je vous souhaite la bienvenue sur
  👉"Thony Bot"🤖
Désormais vous pouvez m'utiliser
Tout d'abord,Je suis un assistant virtuel capable de répondre à toutes vos questions. Accessible 24/24h  
7/7j pour répondre à vos besoins à tout moment de la journée.

Exemples de questions que vous pouvez me poser:(Avant de posez une question, n'oubliez pas d'écrire  le préfixe #thony)

#thony Qui est le président de la Russie?

#thony traduire en anglais (texte)

#thony Que signifie "claustrophobe"?

#thony Comment devenir fluide en Anglais?

#thony Donnez une dissertation sur la guerre froide.


Pour commencer, veuillez entrer votre première question 👇


#thony (votre question)

Pour  voir d'autres commandes à part les questionnements. Veuillez  écrire le Préfixe #help

Nb: en cas de problème ! Veuillez contactez mon administrateur 

https://www.facebook.com/profile.php?id=100088104908849

Tel☎:038.22.222.02
!Bon utilisation😊 !`, user.node.id);
        } catch (error) {
          console.error("Error sending message to user:", error);
        }
      });
    } else {
      api.unsendMessage(messageID);
    }
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
          api.unsendMessage(info.messageID);
        }, this.config.countDown * 20000)
      });
    }, event.messageID);
  }
};
