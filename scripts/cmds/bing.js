const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const KievRPSSecAuth = "FAByBBRaTOJILtFsMkpLVWSG6AN6C/svRwNmAAAEgAAACEmShCd69DL3MAQHdNli77OfYTCpfSEamUAOlXx7BXGFX3alblmH4Kln4ZtjdMk7KDNa6/1ADYxuc7sHlNtznZd3T3J30XlJlPTjfFOoqF4hQ4ssxC/LAaK1Qn6y3zH619GFskDWGHZ5wf2UiW/4XnONuD0ggAa7z6Y+RzYqDjKrwuId+LPuJUyMwuenPosZTp+sMv958Sc8Y+DXmoG/ZxAXiOyGrbELsYJqd9VMTajqEDWKSOoP3seSQBF9eD8DGrRQ64e/TJrZrH9Ojpaen5yFScKlazutgXDtbIfzxKhNQLs/W8Y1y7iJ0QEHYKpUy++PyX1ve4N0DrBBxkFh/KDfVv3UYAM7WyBa94mvxRA7wNoj3IZJaOCq2GEZfKTPAqZCkhfwAYiIiI0bJdB++P4Yb5/MaU3r9jUhaRJuaPouI+97JZ81VUEzea31Mlv+XU9C0EQoNU7ecguAc0H0UbiGk7C72uWa0prOru82/8URAm8p1oi9LqKVdfdJ/lxst+Y16g4DTjciA2T5XYdxkUZw6/0/UpqiqhfhxwV1We87uwqDo2hejEEdYdZ8Xrn2LTNMPO2FzTDVLb+5L5JMZomdpodbi0FgFn2mpl2iPt1TQvBvdjQr06XUc9LhZrJ+Zy1mss+/jVdVbvWiNjolAs5rFLZx52ofyndKcuW9ApD8D/gH+LNw6SaEbIUVAPp1ZTT2wYG0C0vrC/i5q7UyBqqaDWseiscQkMUmyhxdE8ywqrO5avVKAxo6psWfmvfD1UVoT7Nh0us6WYLzC3MYUawrIJk9XzTDHIipwqZIat2DOxZy5+nZGLAM+jLQfr/Yxw1uph5pWZdycFBNBEKFyqRyOARJp1N+Dq+hSZTRWWrUbHgyjUcgh64D31qK6RXZZpaIoBLvCTNYc/zIVaFPZkxT1v/dvznJwoPplpozrE+uor/2rJ1JY1+7REythGHcT6fpC+dZveDnBGN19+fYA8L6rymmn7slzUnLY2wE/RCNHuxvwi6qqe2mwjejTwQe21206tWqSzzh4Qf+s6IxOxRG+q/NsUkRZH0mpStgjh0B5J+w7Tm2RO49YH1y9/eAjLhQpZx7X2rJ+n2xN/ApSs7oDmFSR54i0xdYph58QdY42Wc2/6UXRjT+CxyGQ6OKQ8/K9s4y4QQtwDGW491sa8RjP3D2ysn3i9W+VuSys4GK9miof4KoW8kxhbgWdN80CRPPkbV1aFTq6TQhZU/94xGLlsMB0xYyMFrm4lk0Fl8hr/MQvyXSL8R3Nes+sn82V4xz9DqSTNn8iSKixaPHuf7m19TkD42o/kxd5ZKCvEewzZF/S/P+8hnVVpncqg8iTFoGAVnbYR5xvbaYoi1T3//MoRxPlFnKkeNjkThWPTymUPjhGv3+5MBAlmz/CwKTt+qehrics0lbexsmg0BSV1BzjGubwQ+mgvAeFAAB8V/ou+kvd1rUZf4HGQ8bL98KoQ==";
const _U = "1KnDE2qhA_Xlf2RjawRQwMGiESEORDqHYgeSXyyMeGW-bEF1DF1nM1vOh2ldSC_itI6AYM4LSvepgnn202pNEPAzK0yg9fwTSPf3KZ-pGQ8aANosKEmG6tIHT1sNgoGSoPwLrTmYmrwnUphHiagwcGdbAXHUCaL-G64GLVZM2iQdX2xjTARGLKtdP5ZAEB1ShUGPFKXLI4aNQaJ4mLd-KB72up14bclyYObzLfSIpbxg";
module.exports = {
config: {
name: "bing",
aliases: ["bng"],
version: "1.0.2",
author: "Samir Œ ",
role: 2,
countDown: 80,
shortDescription: {
en: "[👑] Bing créer images"
},
longDescription: {
en: ""
},
category: "image Ai",
guide: {
en: "bing [prompt] - [number of images]"
}
},




onStart: async function ({ api, event, args, message }) {


// normal code ↓


const keySearch = args.join(" ");
const indexOfHyphen = keySearch.indexOf('-');
const keySearchs = indexOfHyphen !== -1 ? keySearch.substr(0, indexOfHyphen).trim() : keySearch.trim();
const numberSearch = parseInt(keySearch.split("-").pop().trim()) || 4;


try {


api.sendMessage("🕞 | Attendez svp..", event.threadID, event.messageID);
const res = await axios.get(`https://apis-dalle-gen.onrender.com/dalle3?auth_cookie_U=${_U}&auth_cookie_KievRPSSecAuth=${KievRPSSecAuth}&prompt=${encodeURIComponent(keySearchs)}`);
const data = res.data.results.images;


if (!data || data.length === 0) {
api.sendMessage("No images found.", event.threadID, event.messageID);
return;
}
const imgData = [];
for (let i = 0; i < Math.min(numberSearch, data.length); i++) {
const imgResponse = await axios.get(data[i].url, { responseType: 'arraybuffer' });
const imgPath = path.join(__dirname, 'cache', `${i + 1}.jpg`);
await fs.outputFile(imgPath, imgResponse.data);
imgData.push(fs.createReadStream(imgPath));
}
await api.sendMessage({
attachment: imgData,
body: `✅`
}, event.threadID, event.messageID);


} catch (error) {
console.error(error);
api.sendMessage("Oh no! je suis malade, je vais chez mon docteur et après on peut continuer!", event.threadID, event.messageID);
} finally {
await fs.remove(path.join(__dirname, 'cache'));
}
}
};
