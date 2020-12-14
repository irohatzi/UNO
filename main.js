"use strict";


let gameId;
let playersCards = [];

let card = {};
let currentPlayer;


let wildColor = "";
let colorRC;
let valueRC;

let img;
let topCard;
let cardArr;


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

async function post() {
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



        gameId = result.Id;
        //   console.log(gameId);

        // im response von post ist der nächste Player der erste zu spielende
        currentPlayer = result.NextPlayer;
        cardArr = result.Players[0].Cards;
        console.log(cardArr);

        console.log(currentPlayer);

        let center = document.getElementById("decks");
        //  console.log(result.TopCard.Color);
        card = result.TopCard;
        let pic = generateCard(card);
        pic.setAttribute("id", "topCard");
        center.appendChild(pic);


        // if(result.TopCard.Text == "Draw2"){
        //     drawCard();
        //     drawCard();
        // }



        // //* playerCards
        for (let i = 0; i < playersCards.length; i++) {

            for (let j = 0; j < result.Players[i].Cards.length; j++) {

                card = result.Players[i].Cards[j];
                img = generateCard(card);
                img.setAttribute("id", i + "card2play" + j);
                img.setAttribute("onclick", "replyId(this.id)");
                img.setAttribute("class", "cards");

                document.getElementById(playersCards[i]).appendChild(img);
            }
        }

        let scores = [];
        scores.push(document.getElementById("score1").id);
        scores.push(document.getElementById("score2").id);
        scores.push(document.getElementById("score3").id);
        scores.push(document.getElementById("score4").id);

        for (let i = 0; i < scores.length; i++) {
            let idString = i + 1;
            document.getElementById("score" + idString);
            console.log("TEST FÜR SCORE: " + "score" + idString);
            // für Score evtl ein div im index.html einbauen, mir is das zu stressig zum aufrufen
            //   let p = document.createElement("p");
            //   p.innerText = "Score";
            let score = document.createElement("p");
            score.innerText = result.Players[i].Score;
            score.setAttribute("class", "score");

            document.getElementById(scores[i]).appendChild(score);
        }

        //  getTopCard();
        // drawCard();



        //    cardArr = getCards();
        //    topCard = getTopCard();
    }
    else {
        alert("HTTP-Error: " + response.status)
    }
}
const btnDraw = document.getElementById('drawDeck');
btnDraw.addEventListener("click", drawCard);



//! wenn modaler dialog auskommentiert! - da post aufrufen!
post();

function game() {

    getTopCard();
    // wenn +2 oder +4 aufliegt, kartenhand neu generieren vom aktuellen spieler
    //klick auf play oder drawCard
    //

    playCard(clickedId);
    // solange der nächste spieler noch karten hat, ruf game auf
}

function generateCard(card) {
    console.log(card);
    console.log(card.Color);

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
        //  alert(JSON.stringify(result))
        if (topCard.Text == "Draw2" || topCard.Text == "Draw4") {
            let cardArrSize = cardArr.length;
            let helper = topCard.text.charAt(length - 1);
            console.log(helper);
            while ((cardArrSize + helper) > cardArr.length) {
                generateCards();
            }
        }


        // TOPCARD value aus result rausspeichern - DAS FUNKTIONIERT -NICHT LÖSCHEN!!!!!!!!
        topCard = result;
        // return topCard;

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
        let cardDiv = document.createElement("div");
        let check = players.indexOf(currentPlayer);
        let arrCardSize = document.getElementById(playersCards[check]).childElementCount;
        console.log(arrCardSize);
        cardDiv.setAttribute("id", check + "card2play" + arrCardSize);
        cardDiv.setAttribute("onclick", "replyId(this.id)");
        cardDiv.setAttribute("class", "cards");


        card = result.Card;
        img = generateCard(card);
        img.setAttribute("id", i + "card2play" + j);
        img.setAttribute("onclick", "replyId(this.id)");
        img.setAttribute("class", "cards");

        document.getElementById(playersCards[i]).appendChild(img);


        // Hilfsvariable um auf richtigen player zuzugreifen (index vom array ≙ +1 von id -->weil ich die ids ab p1 und nicht p0 vergeben habe)

        check += 1;
        console.log("p" + check + "cards");
        document.getElementById("p" + check + "cards").appendChild(img);

        //   console.log(result.Card.Score);
        //  console.log(document.getElementById("score" + check).innerText);
        let newScore = document.getElementById("score" + check).innerText;
        //     console.log(newScore);

        newScore = parseInt(newScore);
        newScore += result.Card.Score;
        //      console.log(newScore);
        document.getElementById("score" + check).innerText = newScore;


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


        //     console.log(result);

        // CardArr values aus result rausspeichern - DAS FUNKTIONIERT -NICHT LÖSCHEN!!!!!!!!
        cardArr = result.Cards;
        // !!!!!!CHECK OB IM RESULTARRAY MEHR KARTEN ALS IM SPIELFELD(WEGEN +4 / +2)      


        // for(let i=0; i<result.Cards.length;i++){
        //     cardArr[i] =  {card: {
        //         val : result.Cards[i].Value,
        //         col : result.Cards[i].Color,
        //         sco : result.Cards[i].Score
        //     }
        //         };
        //     }

        //    console.log(card);

        // try later:
        // cardArr = [];



    }
    else {
        alert("HTTP-Error: " + response.status)
    }
}

// function removeCard(event){
//     let cardDiv = event.target.parentElement;
//     cardDiv.parentElement.removeChild(cardDiv);
// }kinds o


function replyId(clickedId) {



    // let anotherTest = document.getElementById(clickedId);
    // console.log(anotherTest.getAttribute(val));


    // check ob von richtiger Kartenhand gespielt:
    cardCheck(clickedId);


}


function cardCheck(clickedId) {

    // variable für richtiger player check
    let i2CheckPlayer = players.indexOf(currentPlayer);
    // indexNummer die an der ID angehängt ist rauslesen:
    let i4CardArr = clickedId.charAt(clickedId.length - 1);

    console.log(i4CardArr);
    console.log(i2CheckPlayer);
    if (i2CheckPlayer == clickedId.charAt(0)) {
        alert(clickedId);
        //  getCards();
        //console.log(cardArr.pop());
        let removeCard = cardArr.splice(i4CardArr, 1);
        colorRC = removeCard[0].Color;
        valueRC = removeCard[0].Value;
        //      console.log(colorRC);

        //     console.log(cardArr);
        //check ob karte gespielt werden darf:
        // let cardX = Object.assign({},cardArr[i4CardArr]);
        let colorTC = topCard.Color;
        let valueTC = topCard.Value;

        if (colorRC == "Black" || valueRC == valueTC || colorRC == colorTC) {
            alert("Valid CarD!");

            //      playCard(clickedId);
        }
    } else {
        alert("Falsche Kartenhand!");
        if (removeCard === defined) {
            cardArr.push(removeCard);
            // check if removeCard in cardArr
            //         console.log(cardArr);
        }

    }
}


async function playCard(clickedId) {

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
        //  console.log(result);
        //   alert(JSON.stringify(result));

        if (colorRC == "Black") {
            $('#WCForm').modal()
        }

        let deleteCard = document.getElementById(clickedId);
        //    console.log(clickedId);
        deleteCard.parentElement.removeChild(deleteCard);
        clickedId = "";

        let newTC = document.getElementById("topCard").childNodes;
        console.log(newTC);

        //    document.getElementById("topCard").removeChild(img);


        let imgNew = new Image();
        imgNew.src = "cards/" + colorRC + valueRC + ".png";
        // imgNew.height = 161;


        document.getElementById("topCard").replaceChild(imgNew, img);
        img = imgNew;

        //   console.log(result.Player);

        currentPlayer = result.Player;
        //  console.log(currentPlayer);
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