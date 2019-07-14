const Caver = require("caver-js");
const fs = require('fs')


const config = {
  rpcURL: 'https://api.baobab.klaytn.net:8651'
}
const cav = new Caver(config.rpcURL);
const DEPLOYED_ABI = JSON.parse(fs.readFileSync("./EmojiContestContractABI.json", 'utf8'));
const DEPLOYED_ADDRESS = "0xf7eAd1878fCd37e6b0e54A92e4830f885ccD0A20";
const emojiContestContract = new cav.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS);

// TODO: 사용자 PK가 들어가도록 수정.
const privateKey = "USER'S PRIVATE KEY";
const walletInstance = cav.klay.accounts.privateKeyToAccount(privateKey);


// vote: 실행 안됨.
// function vote(id) {
//     emojiContestContract.methods.vote(id).send({
//         from: walletInstance.address,
//         gas: '25000'
//     }).then((receipt) => {
//         console.log("success");
//     }).catch((err) => {
//         console.log(err);
//         // console.log("fail");
//     });
// }

function cmp(a, b) {
    return b[1] - a[1];
}

async function getRank() {
    const rank = [];  // 응모자 id, 잔액

    await emojiContestContract.methods.getEntries().call()
    .then(async entries => {
        for (let id in entries) {
            await emojiContestContract.methods.balanceOf(entries[id]).call()    // 주소로 잔액 가져오기
            .then((balance) => {
                rank.push([parseInt(id), parseInt(balance)]);
            })
            .catch(err => {
                console.log(err);
            });
        }
    })
    .catch(err => {
        console.log(err);
    });
    
    rank.sort(cmp);     // sorting

    return rank;
}

// getRank();