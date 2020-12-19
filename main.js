"use strict";


//**** global variables ****/  

let gameId;
let playersCards = [];
let scores = [];

let currentPlayer;
let currentNum;
let player;
let card = {};

let wildColor = "";
let pickedColor;
let colorRC;
let valueRC;

let img;
let topCard = {};
let currentCards;
let clickedId;
//* value that is needed to get the prev/next player
let direction = 1;
let colorCheck = "";




// modaler dialog funzt, damit erspart man sich das permanente eingeben:
let players = [];
let player1 = 'Hansi';
let player2 = 'Helga';
let player3 = 'Wurschti';
let player4 = 'Greti';

// let player1 = 'p1';
// let player2 = 'p2';
// let player3 = 'p3';
// let player4 = 'p4';




let redBtn = document.getElementById("red");
redBtn.addEventListener("click", function () {
    wildColor = "Red";
    colorCheck = "Red";
    $('#pickColor').modal('hide');
    console.log(clickedId);
    playCard(clickedId);
});

let yellowBtn = document.getElementById("yellow");
yellowBtn.addEventListener("click", function () {
    wildColor = "Yellow";
    colorCheck = "Yellow";
    $('#pickColor').modal('hide');
    console.log(clickedId);
    playCard(clickedId);
});

let greenBtn = document.getElementById("green");
greenBtn.addEventListener("click", function () {
    wildColor = "Green";
    colorCheck = "Green";
    $('#pickColor').modal('hide');
    console.log(clickedId);
    playCard(clickedId);
});

let blueBtn = document.getElementById("blue");
blueBtn.addEventListener("click", function () {
    wildColor = "Blue";
    colorCheck = "Blue";
    $('#pickColor').modal('hide');
    console.log(clickedId);
    playCard(clickedId);
});



players.push(player1, player2, player3, player4);
//! Modalen Dialog öffnen um Namen einzugeben
// $('#playerNames').modal()

// document.getElementById('playerNamesForm').addEventListener('submit', function (evt) {
//     console.log('submit')

//     evt.preventDefault()


//     let player1 = document.getElementById('pn1').value;
//     players.push(player1);


//     let player2 = document.getElementById('pn2').value;
//     players.push(player2);


//     let player3 = document.getElementById('pn3').value;
//     players.push(player3);


//     let player4 = document.getElementById('pn4').value;
//     players.push(player4);


/*     let uniq = players.map((name) => {
      return {
        count: 1,
        name: name
      }
    })
    .reduce((a, b) => {
      a[b.name] = (a[b.name] || 0) + b.count
      return a
    }, {})
  
  let duplicates = Object.keys(uniq).filter((a) => uniq[a] > 1)
  
  console.log(duplicates) // [ 'Nancy' ]

    players.forEach(function (value, index, arr){

        let first_index = arr.indexOf(value);
        let last_index = arr.lastIndexOf(value);

         if(first_index !== last_index){

         console.log('Duplicate item in array ' + value);
         $('#playerNames').modal('show');

         }else{

         console.log('unique items in array ' + value); */

document.getElementById('p1').innerText = player1;
document.getElementById('p2').innerText = player2;
document.getElementById('p3').innerText = player3;
document.getElementById('p4').innerText = player4;

//! die klammern gehören auch zum modalen dialog 
//      }

// });

playersCards.push(document.getElementById("p1cards").id);
playersCards.push(document.getElementById("p2cards").id);
playersCards.push(document.getElementById("p3cards").id);
playersCards.push(document.getElementById("p4cards").id);

//! unbedingt für mod dialog wieder einkommentieren!
// $('#playerNames').modal('hide');
// post();

// })






// function hasDuplicates() {
//     var valuesSoFar = Object.create(null);
//     for (var i = 0; i < array.length; ++i) {
//         var value = players[i];
//         if (value in valuesSoFar) {
//             return true;
//         }
//         valuesSoFar[value] = true;
//     }
//     return false;
// }


async function startResponse() {
    let response = await fetch("https://nowaunoweb.azurewebsites.net/api/game/start", {
        method: "POST",
        body: JSON.stringify(players),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });

    if (response.ok) {
        let result = await response.json();
        // alert(JSON.stringify(result))
        console.log(result);

        //* gameID in globale Variable speichern
        gameId = result.Id;

        //* im response von post ist der nächste Player der erste zu spielende, 
        //* wenn +2 aufliegt oä ist der p2 als NextPlayer im response - 
        //* daher nur player und net current cards, die werden dann mit der getCard
        // * geholt 
        currentPlayer = result.NextPlayer;
        currentNum = players.indexOf(currentPlayer);
        currentCards = result.Players[currentNum].Cards;
        showActivePlayer();



        //* TC globaleVariable zuweisen & ins html einfügen
        topCard = result.TopCard;
        let pic = generateCardImg(topCard);
        pic.setAttribute("id", "topCard");
        let center = document.getElementById("decks");
        center.appendChild(pic);



        //* playerCards zuweisen & ins html einfügen
        for (let i = 0; i < playersCards.length; i++) {

            for (let j = 0; j < result.Players[i].Cards.length; j++) {

                card = result.Players[i].Cards[j];
                img = generateCardImg(card);

                img.setAttribute("id", i + "card" + j);
                img.setAttribute("onclick", "cardCheck(this.id)");
                img.setAttribute("class", "cards");

                document.getElementById(playersCards[i]).appendChild(img);
            }
        }


        scores.push(document.getElementById("score1").id);
        scores.push(document.getElementById("score2").id);
        scores.push(document.getElementById("score3").id);
        scores.push(document.getElementById("score4").id);



        for (let i = 0; i < scores.length; i++) {
            let score = document.createElement("p");
            score.innerText = result.Players[i].Score;
            score.setAttribute("class", "score");

            document.getElementById(scores[i]).appendChild(score);
        }

        // check if +2/skip or whatever to have set the right current player for next turn --> notwendig?
        getTopCard();


    }
    else {
        alert("HTTP-Error: " + response.status)
    }
}

//* ClickEvent für den Stapel zum Abheben
const btnDraw = document.getElementById('drawDeck');
btnDraw.addEventListener("click", drawCard);



//! wenn modaler dialog auskommentiert! - da post aufrufen!
startResponse();

function showActivePlayer() {
    // let highlightField = document.getElementById("act"+(direction+currentNum));


    // for(let el of document.querySelectorAll("active")){
    //     if(el.id == highlightField){
    //         $(highlightField).classlist.toggle("highlight");

    //     }
    // }
    // console.log("Erste id ", "act"+(direction+currentNum));


    document.getElementById("activePlayer").innerText = currentPlayer;






}

function generateCardImg(card) {
    // console.log(card);
    // console.log(card.Color);

    let pic = document.createElement("img");
    let color = card.Color;
    let value = card.Value;
    pic.src = "cards/" + color + value + ".png";
    return pic;

}

async function getTopCard() {

    let response = await fetch("https://nowaunoweb.azurewebsites.net/api/game/topCard/" + gameId, {
        method: "GET",
        contentType: "application/json",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });


    if (response.ok) {
        let result = await response.json();
        console.log(result);
        card = result;


        let tcDom = document.getElementById("topCard");
        console.log(tcDom);


        img = generateCardImg(card);



        tcDom.replaceWith(img);
        img.setAttribute("id", "topCard");

        // if (card.Color == "Black") {
        //     pickedColor = wildColor;
        //     wildColor = "";
        // }

        if (card.Value == 12) {
            direction *= -1;
            console.log("Richtungswechsel abgespeichert! ", direction);
        }

        // if(card.Value == 13 || card.Value == 10){
        //     correctCards();

        // }





        // if(tcDom.Value != result.Value){
        //     card = result;
        //     let newTC = generateCard(card);
        //     newTC.setAttribute("id", "topCard");
        //     tcDom.replaceWith(newTC);
        // }

        // TOPCARD value aus result rausspeichern - DAS FUNKTIONIERT -NICHT LÖSCHEN!!!!!!!!
        topCard = result;

        console.log(topCard);
        // for(let el of players){
        //     getCards(el);
        // }



    }
    else {
        alert("HTTP-Error: " + response.status)
    }
}

function previousPlayer() {


    let oldIdx = players.indexOf(currentPlayer);
    let maxIdx = (players.length - 1);

    let newIdx = oldIdx - direction;
    if (newIdx < 0) {
        newIdx = maxIdx
    }
    else {
        if (newIdx > maxIdx) {
            newIdx = 0
        }
    }
    let previousPlayer = players[newIdx];
    console.log(previousPlayer);
    return previousPlayer;
}

async function drawCard() {

    let response = await fetch("https://nowaunoweb.azurewebsites.net/api/game/drawCard/" + gameId, {
        method: "PUT",
        contentType: "application/json",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });

    if (response.ok) {
        let result = await response.json();
        console.log(result);
        // alert to check response
        // alert(JSON.stringify(result))
        // console.log(currentPlayer);
        // console.log(result.Player);

        //  if(result.Player === currentPlayer){

        let check = players.indexOf(currentPlayer);
        let arrCardSize = document.getElementById(playersCards[check]).childElementCount;
        console.log(arrCardSize);
        card = result.Card;
        img = generateCardImg(card);
        img.setAttribute("id", check + "card" + arrCardSize);
        // img.setAttribute("onclick", "replyId(this.id)");
        img.setAttribute("onclick", "cardCheck(this.id)");
        img.setAttribute("class", "cards");

        document.getElementById(playersCards[check]).appendChild(img);

        //! check muss eins größer als index vom array sein!
        check++;
        let newScore = document.getElementById("score" + check).innerText;

        newScore = parseInt(newScore);
        newScore += result.Card.Score;

        document.getElementById("score" + check).innerText = newScore;


        //! Nächsten Spieler auf current setzen
        currentPlayer = result.NextPlayer;
        currentNum = players.indexOf(currentPlayer);
        console.log("Am Zug ist nun: ", currentPlayer);
        showActivePlayer();
        //! getCards holt die karten vom aktuellen spieler und weißt sie dem currentCardArr zu
        getCards(currentPlayer);
        //   console.log(result.NextPlayer);
        // das sollte auch nach dem ablegen einer karte gemacht werden!
        //  currentPlayer = result.NextPlayer;
        //  getCards();

        //  }
    }
    else {
        alert("HTTP-Error: " + response.status)
    }
}


// async function getCards() {


//     let response = await fetch("https://nowaunoweb.azurewebsites.net/api/game/getCards/" + gameID
//         + "?playerName=" + currentPlayer, {
//         method: "GET",
//         contentType: "application/json",
//         headers: {
//             "Content-type": "application/json; charset=UTF-8"
//         }
//     });

//     if (response.ok) {
//         let result = await response.json();
//         //   console.log(result.Cards[2].Value);


//         let check = players.indexOf(currentPlayer);
//         let arrCardSize = document.getElementById(playersCards[check]).childElementCount;

//         console.log(arrCardSize);




//         while (arrCardSize != result.Cards.length){
//             card = result.Cards[arrCardSize];
//             img = generateCard(card);
//             img.setAttribute("id", check + "card2play" + arrCardSize);
//             // img.setAttribute("onclick", "replyId(this.id)");
//             img.setAttribute("onclick", "cardCheck(this.id)");
//             img.setAttribute("class", "cards");

//             document.getElementById(playersCards[check]).appendChild(img);
//         }

//         //     console.log(result);

//         //! CardArr values aus result rausspeichern 
//         currentCards = result.Cards;
//         currentPlayer = result.Player;



//     }
//     else {
//         alert("HTTP-Error: " + response.status)
//     }
// }


async function getCards(player) {


    let response = await fetch("https://nowaunoweb.azurewebsites.net/api/game/getCards/" + gameId
        + "?playerName=" + player, {
        method: "GET",
        contentType: "application/json",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });

    if (response.ok) {
        let result = await response.json();
        //   console.log(result.Cards[2].Value);


        let check = players.indexOf(player);

        let myNode = document.getElementById(playersCards[check]);
        while (myNode.firstChild) {
            myNode.removeChild(myNode.lastChild);
        }
        // console.log(myNode.childElementCount);
        // console.log(result.Cards.length);


        while (myNode.childElementCount < result.Cards.length) {
            card = result.Cards[myNode.childElementCount];
            img = generateCardImg(card);
            img.setAttribute("id", check + "card" + (myNode.childElementCount));
            console.log("id", check + "card" + (myNode.childElementCount));
            img.setAttribute("onclick", "cardCheck(this.id)");
            img.setAttribute("class", "cards");

            //console.log(img);
            document.getElementById(playersCards[check]).appendChild(img);
        }



        let newScore = result.Score;

        document.getElementById("score" + (check + 1)).innerText = newScore;

        //     console.log(result);

        //! CardArr values aus result rausspeichern 
        if (player == currentPlayer) {
            currentCards = result.Cards;
        }



    }
    else {
        alert("HTTP-Error: " + response.status)
    }
}

function updatePlayground() {
    players.forEach(async ele => {
        let val = await new Promise(rsv => setTimeout(() => rsv(ele), 1000));


        // if(val == currentPlayer || val == prePlayer){
        getCards(val);
        console.log(val);
        // }

    });


    console.log("Ende kartenausteilen");

    getTopCard();

}


function cardCheck(clickedId) {

    console.log("aktueller spieler", currentPlayer);
    // variable für richtiger player check
    let i2CheckPlayer = players.indexOf(currentPlayer);
    // indexNummer die an der ID angehängt ist rauslesen:
    let i4CardArr = clickedId.charAt(clickedId.length - 1);

    console.log(i4CardArr);
    console.log(i2CheckPlayer);
    if (i2CheckPlayer == clickedId.charAt(0)) {
        console.log(clickedId);
        //  getCards();

        let removeCard = currentCards.splice(i4CardArr, 1);
        console.log(removeCard);
        colorRC = removeCard[0].Color;
        valueRC = removeCard[0].Value;
        console.log(colorRC);
        console.log(valueRC);
        console.log(currentPlayer);

        //     console.log(cardArr);
        //check ob karte gespielt werden darf:
        // let cardX = Object.assign({},cardArr[i4CardArr]);
        let colorTC = topCard.Color;
        let valueTC = topCard.Value;

        // else if (colorTc == "Black") {
        //     if (colorRC == wildColor) {
        //         playCard(clickedId);
        //     } else {
        //         alert("Bitte die gewünschte Farbe -->" + wildColor + " spielen!");
        //     }
        // }
        if(topCard.Color == "Black"){
            colorTC = colorCheck;
        }



        console.log(topCard.Color);
        if (colorRC == "Black") {
            $('#pickColor').modal();
        } else if (valueRC == valueTC || colorRC == colorTC) {
            // alert("Valid CarD!");
            playCard(clickedId);
        } else {
            alert("Bitte eine passende Karte spielen!");
            getCards(currentPlayer);
        }
    } else {
        alert("Falsche Kartenhand!");

    }
}


async function playCard(clickedId) {


    console.log(wildColor);
    console.log(currentPlayer, "  CurrentPlayer in playCard");

    let response = await fetch("https://nowaunoweb.azurewebsites.net/api/game/playCard/" + gameId +
        "?value=" + valueRC + "&color=" + colorRC + "&wildColor=" + wildColor, {
        method: "PUT",
        contentType: "application/json",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });

    if (response.ok) {
        let result = await response.json();
        console.log(result);
        //   alert(JSON.stringify(result));

        // if (colorRC == "Black") {
        //     $('#WCForm').modal()
        // }




        // let deleteCard = document.getElementById(clickedId);
        // let pic = deleteCard;
        // console.log(clickedId);
        // console.log(deleteCard.parentElement);
        // deleteCard.parentElement.removeChild(deleteCard);
        // let oldTc = document.getElementById("topCard");
        // console.log(oldTc);

        // oldTc.replaceWith(pic);
        // pic.setAttribute("id", "topCard");

        // // Score anpassen nachdem Karte gespielt wurde

        // let pscore = clickedId.charAt(0);
        // pscore++;
        // console.log("Nummer für PlayerScore", pscore);

        // // clickedId = "";
        // let path = deleteCard.src;
        // let numPlus = path.replace(/^\D+/g, '');

        // let num = numPlus.replace('.png', '');


        // let newScore = document.getElementById("score" + pscore).innerText;
        // newScore = parseInt(newScore);
        // newScore -= num;
        // document.getElementById("score" + pscore).innerText = newScore;


        // //* Methode die nach +2 / +4 die neuen Karten gleich ins html einfügt
        // if(valueRC == 10){
        //     correctCards();
        // } 



        // colorRC = "";
        // colorRC = "";

        // Im Result für playCard() steckt der nächste Spieler +spielerhand
        //
        console.log(result);

        //! Nächsten Spieler und seine Kartenhand zuweisen 
        currentPlayer = result.Player;
        console.log(currentPlayer, result.Player, " da sollte das gleiche ste");
        currentNum = players.indexOf(currentPlayer);
        showActivePlayer();


        // versuch getCards mal vorher als die topcard vor der getcard aufrufen 
        // getTopCard();
        // das war vor änderung von getCard noch drinnen
        // //! Nächsten Spieler und seine Kartenhand zuweisen 
        // currentPlayer = result.Player;
        // currentCards = result.Cards;
        // console.log("playCard response Spieler:", currentPlayer);

        updatePlayground();


        // getCards();


    }
    else {
        alert("HTTP-Error: " + response.status)
    }
}



