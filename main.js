"use strict";


let gameId;
let playersCards = [];
let scores = [];

let currentPlayer;
let card = {};

let wildColor = "";
let colorRC;
let valueRC;

let img;
let topCard = {};
let currentCards;
let clickedId;


// modaler dialog funzt, damit erspart man sich das permanente eingeben:
let players = [];
// let player1 = 'Hansi';
// let player2 = 'Helga';
// let player3 = 'Wurschti';
// let player4 = 'Greti';

let player1 = 'p1';
let player2 = 'p2';
let player3 = 'p3';
let player4 = 'p4';






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

        // TODO VERSUCH, den currentplayer erst nach aufruf topcard festzulegen
         //* im response von post ist der nächste Player der erste zu spielende, 
         //* wenn +2 aufliegt oä ist der p2 als NextPlayer im response - 
        //* daher nur player und net current cards, die werden dann mit der getCard
        // * geholt weil man eh nur den current player übergibt
         currentPlayer = result.NextPlayer;



        //* TC globaleVariable zuweisen & ins html einfügen
        topCard = result.TopCard;
        let pic = generateCardImg(topCard);
        pic.setAttribute("id", "topCard");
        let center = document.getElementById("decks");
        center.appendChild(pic);
        console.log("TC ZUWEISUNG: ", pic);


        //* playerCards zuweisen & ins html einfügen
        for (let i = 0; i < playersCards.length; i++) {

            for (let j = 0; j < result.Players[i].Cards.length; j++) {

                card = result.Players[i].Cards[j];
                img = generateCardImg(card);

                img.setAttribute("id", i + "card" + j);
                // img.setAttribute("onclick", "replyId(this.id)");
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
            let idString = i + 1;
            document.getElementById("score" + idString);
            //console.log("TEST FÜR SCORE: " + "score" + idString);
            // für Score evtl ein div im index.html einbauen, mir is das zu stressig zum aufrufen
            //   let p = document.createElement("p");
            //   p.innerText = "Score";
            let score = document.createElement("p");
            score.innerText = result.Players[i].Score;
            score.setAttribute("class", "score");

            document.getElementById(scores[i]).appendChild(score);
        }

    // check if +2/skip or whatever to have set the right current player for next turn
         getTopCard();

    }
    else {
        alert("HTTP-Error: " + response.status)
    }
}

// ClickEvent für den Stapel zum Abheben
const btnDraw = document.getElementById('drawDeck');
btnDraw.addEventListener("click", drawCard);



//! wenn modaler dialog auskommentiert! - da post aufrufen!
startResponse();
// ? Keine Ahnung ob die Methode überhaupt notwendig is, weil man evtl rekursion oder a schleife braucht
// function game() {

//     getTopCard();
//     // wenn +2 oder +4 aufliegt, kartenhand neu generieren vom aktuellen spieler
//     //klick auf play oder drawCard
//     //

//     playCard(clickedId);
//     // solange der nächste spieler noch karten hat, ruf game auf
// }

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

        let tcDom = document.getElementById("topCard");
        console.log(tcDom);

        card = result;
        img = generateCardImg(card);


       
        tcDom.replaceWith(img);
        img.setAttribute("id", "topCard");

        // if(tcDom.Value != result.Value){
        //     card = result;
        //     let newTC = generateCard(card);
        //     newTC.setAttribute("id", "topCard");
        //     tcDom.replaceWith(newTC);
        // }

        // TOPCARD value aus result rausspeichern - DAS FUNKTIONIERT -NICHT LÖSCHEN!!!!!!!!
        topCard = result;

        console.log(topCard);
        getCards();
    }
    else {
        alert("HTTP-Error: " + response.status)
    }
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
        console.log("Am Zug ist nun: ",currentPlayer);
        //! getCards holt die karten vom aktuellen spieler und weißt sie dem currentCardArr zu
        getCards();
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


async function getCards() {


    let response = await fetch("https://nowaunoweb.azurewebsites.net/api/game/getCards/" + gameId
        + "?playerName=" + currentPlayer, {
        method: "GET",
        contentType: "application/json",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });

    if (response.ok) {
        let result = await response.json();
        //   console.log(result.Cards[2].Value);


        let check = players.indexOf(currentPlayer);
        // let displayedCards = document.getElementById(playersCards[check]).childElementCount;

        let myNode = document.getElementById(playersCards[check]);
        while (myNode.firstChild) {
          myNode.removeChild(myNode.lastChild);
        }
        console.log(myNode.childElementCount);
        console.log(result.Cards.length);
        

        let i = 0;
        while (myNode.childElementCount < result.Cards.length){
            card = result.Cards[i];
            img = generateCardImg(card);
            img.setAttribute("id", check + "card" + myNode.childElementCount);
            // img.setAttribute("onclick", "replyId(this.id)");
            img.setAttribute("onclick", "cardCheck(this.id)");
            img.setAttribute("class", "cards");

            console.log(img);
            document.getElementById(playersCards[check]).appendChild(img);
            i++;
        }

        //     console.log(result);

        //! CardArr values aus result rausspeichern 
        currentCards = result.Cards;
        currentPlayer = result.Player;

        console.log(currentCards);
        console.log(currentPlayer);


    }
    else {
        alert("HTTP-Error: " + response.status)
    }
}

// 
// function removeCard(event){
//     let cardDiv = event.target.parentElement;
//     cardDiv.parentElement.removeChild(cardDiv);
// }kinds o


// function replyId(clickedId) {

//     let ausgabe = document.getElementById(clickedId);
//     console.log(ausgabe);

//     // let anotherTest = document.getElementById(clickedId);
//     // console.log(anotherTest.getAttribute(val));


//     // check ob von richtiger Kartenhand gespielt:
//     cardCheck(clickedId);


// }



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


        if (colorRC == "Black" || valueRC == valueTC || colorRC == colorTC) {
            alert("Valid CarD!");

                  playCard(clickedId);
        } else {
            alert("Bitte eine passende Karte spielen!");
            
        }
    } else {
        alert("Falsche Kartenhand!");
        if (removeCard != defined) {
            currentCards.push(removeCard);
            // check if removeCard in cardArr
            //         console.log(cardArr);
        }

    }
}


async function playCard(clickedId) {

     //console.log(await getTopCard());
     console.log("kartenhand von der gespielt wird: ", currentCards);
     

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




        let deleteCard = document.getElementById(clickedId);
        let pic = deleteCard;
        console.log(clickedId);
        console.log(deleteCard.parentElement);
        deleteCard.parentElement.removeChild(deleteCard);
        let oldTc = document.getElementById("topCard");
        console.log(oldTc);
       
        oldTc.replaceWith(pic);
        pic.setAttribute("id", "topCard");

        // Score anpassen nachdem Karte gespielt wurde

        let pscore = clickedId.charAt(0);
        pscore ++;
        console.log("Nummer für PlayerScore", pscore);

        // clickedId = "";
        let path = deleteCard.src;
        let numPlus = path.replace( /^\D+/g, ''); 

        let num = numPlus.replace('.png', '');
 

        let newScore = document.getElementById("score" + pscore).innerText;
        newScore = parseInt(newScore);
        newScore -= num;
        document.getElementById("score" + pscore).innerText = newScore;


        // colorRC = "";
        // colorRC = "";

        // Im Result für playCard() steckt der nächste Spieler +spielerhand
        console.log(result);
        
                //! Nächsten Spieler und seine Kartenhand zuweisen 
                currentPlayer = result.Player;



                // die topcard vor der getcard aufrufen 
                getTopCard();
        // das war vor änderung von getCard noch drinnen
        // //! Nächsten Spieler und seine Kartenhand zuweisen 
        // currentPlayer = result.Player;
        // currentCards = result.Cards;
        // console.log("playCard response Spieler:", currentPlayer);
        //getTopCard();
        // getCards();

    }
    else {
        alert("HTTP-Error: " + response.status)
    }
}


document.getElementById('WCForm').addEventListener('submit', function (evt) {
    console.log('submit')

    evt.preventDefault();


    document.getElementById('red').value;
    topCard.Color = "Red";


    document.getElementById('green').value;
    topCard.Color = "Green";


    document.getElementById('blue').value;
    topCard.Color = "Blue";



    document.getElementById('yellow').value;
    topCard.Color = "Yellow";


});