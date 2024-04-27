const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const KievRPSSecAuth = "FAByBBRaTOJILtFsMkpLVWSG6AN6C/svRwNmAAAEgAAACHaQ64eidSfUMARsFrsR52e8oCz1+r1qp2mn6eIhXPt6NEW+GaVj29QFRUgXDNoWn4Jqb99mYjIuhzvBDDNkvl++8EOhsb5rq3aH5XZVO+27yAGmO0I8ipO4D5fl3sKgrqE/d7NKE0Wf2fpBnbFWYRMB34jYOyabp3C/6Yk5PLDuo00FZEf2x+W59Ocnr+4KNXVvSyEH6wXyYTUW7+Zaltk+3NYm0DrVq2I1PCgbk+8izOiNCdlBYDYBwE2V2a1b7h6omXDUkjCo9pa6FvOt1iS2O+ZcwPtHvX1OB4iQ9heY9DYVj/nVJkrCgorgHz43ZynP6MU8/lf6vXbp/ntpc8LBxlcoqr4RhXTAdWkM+nzMuFIVRXuJHohCkhQGM8EbLauxcNHUdOJHOFOTyIg5GNgn9uQqJjqfqONDO5U4YfFpNgPeBDIZI1Vy9KJprrSRuZYW+QgQJ8hq1h/qhSKQpbI+Sa6Z+22ZZoSDTXSrJ2PEp1feo1Gu9bP2KfSjgLopUzxvDsKX8UWFG9bsvoojKwaU3cW/A/1/CMG3/CX/qwIGtqpoknB8MnIqkLmbAZj0dXuV2URVhLANOKJem48J7lGqCepTlrg9IsOFsy6DZg6DoYutK+7FR/QdxO0cV0up31MB4/szvwZaCJ/br7S7eFukPpiIQXFbHZk9BSSu3duQ35OBqcIIj1SWIzzXHw64Xse/VhO3L/sGa7PV9SVkM919+6cqIyz7PG+dKfqg7TNJFdEsA+H2q2xSZXOQr55XBPbpOt40FzGg042FRPA8VCJPTmYIth+Kkf3DidW7mMzeUmfkwnJgsjpjPqNTMm+/ogFnEH+LhwVZ9WUIR5TGHXCAD1IMvC1uV8H8bjGMsIVfyk64RI/fVxOknSs/ODStJ2Qoy+AbaAwC4oGy9F/krl+bff0JUqxey2liuqAR91c4QEybruEt8fl7yntm9Vi1Pf/ZLc/CWoyX618xlfiBnamnjJpfmeMSPUzPimqGXjPV4UyTKQhDZIqE7gvFFI4V7z15TIhP+V5+KskhxV2wcNxy1kZPZetFX1H+wdBaxg9NIyuCYW1A7pdTa+Ku5PNva1Hu8QhxYskdk9JvphBU9sHJZ7pCAeGwCkzI3G6/+LlMwuPk91EjNpAQhCFPKWv0G7RSH4aYP8iqlcKF5AvajEmJvzN5tfwfqFvDstziqHAQdXEYsP46Y9kKYdP9gwmDIgoPTy+8rnvbxR1oBpDVAUosn0HwTIbHvpcrjfTcLZPMMsVDgeTgxxnC5s9Ouy0jPJQn60Gii/1WX8FUtQ9sn07vtBLwSWtGPLwRZvaF20DEnIhe9R+wtUtY7pvPXFg/lV243OkULEHtZk3Bvjr4qk/vw90JyfV1rMiwz9Zy3hB2A/OfnVeKanYr/md5h/PRjWyO+5ZwVhL7f4V8PZb10xjCZQS+yh9LZy+JFACH5PGxj/vQ2Lf5X/VGyX/pYMRY1g==";
const _U = "1yMcMuDGBlg0H3w8h4SsMVNP9eEA05pyII0y7ta1yITdlYkCAE3eyr3zxtNealy_SkEThRrhI_CV4wBFDLWCmzRHtme9sIQpTPmUs4bezxklGB3dKVY5nlLnEc7ReIGNA93wSLWCLLNXhsPfN93DGmWu6WArm1oBAsZChkekqjYzB0e46_Y7LoRzUM2dwANLPD86i4kc209AZyMm4Lh8GtpJ8PS-CHACBBR6_iULgfl0";
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
