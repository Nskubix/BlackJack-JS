`use strict`;

let isPlaying = false;
//pregame
const confirmBtn = document.querySelector(".confirmbtn");
const placeBetsList = document.querySelectorAll(".tokensplacebet");
const preGame = document.querySelector(".pregame");
const totalTokensEl = document.querySelector(".playertokens")
let totalTokens = 50;
let totalBet = 0;

for (let i = 0; i < 4; i++) {
    placeBetsList[i].addEventListener("click",function(){
        if(totalTokens - Number(placeBetsList[i].classList[1]) >= 0){
            totalBet += Number(placeBetsList[i].classList[1]);
            totalTokens -= Number(placeBetsList[i].classList[1]);
            totalTokensEl.textContent = `TOKENS: ${totalTokens}`;
            document.querySelector(".totalv").textContent = totalBet;
        }
    });
}
//game
const game = document.querySelector(".game");
let playerCardSum = 0;
let dealerCardSum = 0;
let knownDealerSum = 0;
let playerdraw = 0;
let dealerdraw = 0;
const playerCardsEl = document.querySelectorAll(".player-card");
const dealerCardsEl = document.querySelectorAll(".dealer-card");
function genRandomNum() {
    return Math.trunc(Math.random() * 12) + 2;
}
function genRandomLetter(){
    randomnum = Math.random();
    if(randomnum < 0.25){
        return "c";
    }
    else if( randomnum > 0.25 && randomnum < 0.5){
        return "d";
    }
    else if( randomnum > 0.5 && randomnum < 0.75){
        return "h";
    }
    else{
        return "s";
    }
} 
function whoWon() {
    if (dealerCardSum > playerCardSum && dealerCardSum <= 21) {
        document.querySelector(".dealer-header").textContent = `YOU LOSE ${totalBet} TOKENS`;
        dealerCardsEl[0].src = `img/karty/${StarterArr[4]}_of_${StarterArr[5]}.svg`; 
    }
    else if(dealerCardSum < playerCardSum || dealerCardSum > 21){
        document.querySelector(".dealer-header").textContent = `YOU WIN ${totalBet * 2} TOKENS`;
        dealerCardsEl[0].src = `img/karty/${StarterArr[4]}_of_${StarterArr[5]}.svg`;
        totalTokens += totalBet*2;
    }
    else{
        document.querySelector(".dealer-header").textContent = `PUSH`;
        dealerCardsEl[0].src = `img/karty/${StarterArr[4]}_of_${StarterArr[5]}.svg`;
        totalTokens += totalBet;
    }
}
function playerBustOrWin() {
    if(playerCardSum > 21 || dealerCardSum == 21){    
        document.querySelector(".dealer-header").textContent = `YOU LOSE ${totalBet} TOKENS`;
        dealerCardsEl[0].src = `img/karty/${StarterArr[4]}_of_${StarterArr[5]}.svg`; 
        isPlaying = false;
    }
    else if(playerCardSum == 21){
        document.querySelector(".dealer-header").textContent = `YOU WIN ${totalBet * 2} TOKENS`;
        dealerCardsEl[0].src = `img/karty/${StarterArr[4]}_of_${StarterArr[5]}.svg`;
        isPlaying = false;
        totalTokens += totalBet*2;
    }
}
function checkIfRoyalFamily(card) {
    if(card>11){
        return 10;
    }
    else{
        return card;
    }
}
function updateHeader(s) {
    document.querySelector(".dealer-header").textContent = `DEALER: ${s}`;
    document.querySelector(".player-header").textContent = `PLAYER: ${playerCardSum}`;
}
confirmBtn.addEventListener("click",function(){
    if (totalBet > 0) {
        isPlaying = true;
        preGame.classList.add("hidden");
        game.classList.remove("hidden");
        document.querySelector(".annotation").classList.remove("hidden");
        totalTokensEl.classList.add("hidden");
        //obliczamy randomowe wartości kart
        StarterArr = [
            //first player card
            genRandomNum(),
            genRandomLetter(),
            //second player card
            genRandomNum(),
            genRandomLetter(),
            //second dealer card
            genRandomNum(),
            genRandomLetter(),
            //first hidden dealer card
            genRandomNum(),
            genRandomLetter(),
        ]
        //tutaj odkrywamy 3 karty 
        playerCardsEl[0].src = `img/karty/${StarterArr[0]}_of_${StarterArr[1]}.svg`;
        playerCardsEl[1].src = `img/karty/${StarterArr[2]}_of_${StarterArr[3]}.svg`;    
        dealerCardsEl[1].src = `img/karty/${StarterArr[6]}_of_${StarterArr[7]}.svg`;
        //obliczamy początkową sume gracza i dilera
        playerCardSum = checkIfRoyalFamily(StarterArr[0]) + checkIfRoyalFamily(StarterArr[2]);
        dealerCardSum = checkIfRoyalFamily(StarterArr[4])+ checkIfRoyalFamily(StarterArr[6]);
        knownDealerSum = checkIfRoyalFamily(StarterArr[6]);
        
        updateHeader(knownDealerSum);
        playerBustOrWin();
    }
});
document.querySelector(".hit").addEventListener("click",function(){
    //add a new card to the game
    if (isPlaying) {
        playerdraw++;
        playerCardsEl[1+playerdraw].classList.remove("hidden");
        const thisRandomNum = genRandomNum();
        playerCardsEl[1+playerdraw].src = `img/karty/${thisRandomNum}_of_${genRandomLetter()}.svg`;
        playerCardSum += checkIfRoyalFamily(thisRandomNum); 
        updateHeader(knownDealerSum);
        //check if player busted all over me 
        playerBustOrWin();
    }
});

document.querySelector(".stand").addEventListener("click",function(){
    if (isPlaying) {
        while (Number(dealerCardSum) < 17 && dealerdraw <= 4) {
            dealerdraw++;
            dealerCardsEl[1+dealerdraw].classList.remove("hidden");
            const thisdealerRandomNum = genRandomNum();
            dealerCardsEl[1+dealerdraw].src = `img/karty/${thisdealerRandomNum}_of_${genRandomLetter()}.svg`;
            dealerCardSum += checkIfRoyalFamily(thisdealerRandomNum);
            updateHeader(dealerCardSum);
        }
        whoWon();
        isPlaying = false;
    }
});

document.addEventListener("keydown", function(){
    game.classList.add("hidden");
    dealerCardsEl[0].src = "img/karty/back.svg";
    dealerCardsEl[2].classList.add("hidden");
    dealerCardsEl[3].classList.add("hidden");
    dealerCardsEl[4].classList.add("hidden");
    dealerCardsEl[5].classList.add("hidden");
    playerCardsEl[2].classList.add("hidden");
    playerCardsEl[3].classList.add("hidden");
    playerCardsEl[4].classList.add("hidden");
    playerCardsEl[5].classList.add("hidden");
    preGame.classList.remove("hidden");
    totalTokensEl.classList.remove("hidden");
    totalTokensEl.textContent = `TOKENS: ${totalTokens}`
    totalBet = 0;
    document.querySelector(".totalv").textContent = totalBet;
    document.querySelector(".annotation").classList.add("hidden");
    playerdraw = 0;
    dealerdraw = 0;
});


