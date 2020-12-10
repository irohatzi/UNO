"use strict";


// let players = [''];
let gameId;
let playersCards = [];
let game = {};
let card = {};
let currentPlayer;

// modaler dialog funzt, damit erspart man sich das permanente eingeben:
let players = [''];
let player1 = 'Hansi';
let player2 = 'Helga';
let player3 = 'Wurschti';
let player4 = 'Greti';

players.push(player1,player2,player3,player4);
// // Modalen Dialog öffnen um Namen einzugeben
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

        // die klammern gehören auch zum modalen dialog 
    //      }

    // });

    playersCards.push(document.getElementById("p1cards").id);
    playersCards.push(document.getElementById("p2cards").id);
    playersCards.push(document.getElementById("p3cards").id);
    playersCards.push(document.getElementById("p4cards").id);

// unbedingt für mod dialog wieder einkommentieren!
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
        console.log(gameId);


    
        currentPlayer = result.NextPlayer;
        game.topCard = result.TopCard;

        console.log(currentPlayer);
        
        card.color = result.Color;
        card.text = result.Text;
        card.value = result.Value;
        card.score = result.Score;

        let firstCard = document.getElementById("decks");
        let img = new Image();
        img.src = "cards/" + game.topCard.Color + game.topCard.Value + ".png";
        img.height = 150;
        firstCard.appendChild(img);
        firstCard = game.topCard;

        // playerCards
        for (let i = 0; i < playersCards.length; i++) {

            for (let j = 0; j < 7; j++) {
                let cardDiv = document.createElement("div");
                cardDiv.setAttribute("id", "card2play" + j);
                cardDiv.setAttribute("onclick", "replyId(card.color + card.value)");
                let img = new Image();
                img.src = "cards/" + result.Players[i].Cards[j].Color + result.Players[i].Cards[j].Value + ".png";
                img.height = 100;
    //            cardDiv.addEventListener("click", removeCard());
                cardDiv.appendChild(img);
                document.getElementById(playersCards[i]).appendChild(cardDiv);
            }
        }

        let scores = [];
        scores.push(document.getElementById("score1").id);
        scores.push(document.getElementById("score2").id);
        scores.push(document.getElementById("score3").id);
        scores.push(document.getElementById("score4").id);

        for(let i = 0; i < scores.length; i++){
            document.getElementById("score" + i)
        //    let p = document.createElement("p");
         //   p.innerText = "Score";
            let score = document.createElement("p");
            score.innerText = "Score " + result.Players[i].Score;
            score.setAttribute("class", "scoreStyle");

            document.getElementById(scores[i]).appendChild(score);
        }

      //  getTopCard();
      // drawCard();
    }
    else {
        alert("HTTP-Error: " + response.status)
    }
}

// wenn modaler dialog auskommentiert! - da post aufrufen!
 post();

function replyId(clickedId){
    alert(clickedId);
}




async function getTopCard(){

    let response = await fetch("https://nowaunoweb.azurewebsites.net/api/game/topCard/" + gameId , {
        method: "GET",
        contentType: "application/json",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });

    if(response.ok){
        let result = await response.json();
        console.log(result);
        alert(JSON.stringify(result))
    }
    else{
        alert("HTTP-Error: " + response.status)
    }
}


// const btnDraw = document.getElementById('drawC');
// btnDraw.addEventListener("click", drawCard());

async function drawCard(){

    let response = await fetch("https://nowaunoweb.azurewebsites.net/api/game/drawCard/" + gameId , {
        method: "PUT",
        contentType: "application/json",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });

    if(response.ok){
        let result = await response.json();
        console.log(result);
        alert(JSON.stringify(result))

        if(result.Player == currentPlayer){
            let cardDiv = document.createElement("div");
                cardDiv.setAttribute("id", "card2play" + j);
                cardDiv.setAttribute("onclick", "replyId(card.color + card.value)");
                let img = new Image();
                img.src = "cards/" + result.Player.Card.Color + result.Player.Card.Value + ".png";
                img.height = 100;
                cardDiv.appendChild(img);
                document.getElementById(playersCards[i]).appendChild(cardDiv);
        }
    }
    else{
        alert("HTTP-Error: " + response.status)
    }
}

// function removeCard(event){
//     let cardDiv = event.target.parentElement;
//     cardDiv.parentElement.removeChild(cardDiv);
// }


async function playCard(){

    let response = await fetch("https://nowaunoweb.azurewebsites.net/api/game/playCard/" + gameId +
    "? playerName=Player " + nr, {
        method: "PUT",
        contentType: "application/json",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });

    if(response.ok){
        let result = await response.json();
        console.log(result);
        alert(JSON.stringify(result))
    }
    else{
        alert("HTTP-Error: " + response.status)
    }
}
