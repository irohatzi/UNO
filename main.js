"use strict";


// let players = [''];
const gameId = {};
let playersCards = [];

// modaler dialog funzt, damit erspart man sich das permanente eingeben:
let players = [''];
let player1 = 'Hansi';
let player2 = 'Helga';
let player3 = 'Wurschti';
let player4 = 'Greti';

players.push(player1,player2,player3,player4);
// Modalen Dialog öffnen um Namen einzugeben
//$('#playerNames').modal()

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


//     let uniq = players.map((name) => {
//       return {
//         count: 1,
//         name: name
//       }
//     })
//     .reduce((a, b) => {
//       a[b.name] = (a[b.name] || 0) + b.count
//       return a
//     }, {})
  
//   let duplicates = Object.keys(uniq).filter((a) => uniq[a] > 1)
  
//   console.log(duplicates) // [ 'Nancy' ]

    // players.forEach(function (value, index, arr){

    //     let first_index = arr.indexOf(value);
    //     let last_index = arr.lastIndexOf(value);

    //      if(first_index !== last_index){

    //      console.log('Duplicate item in array ' + value);
    //      $('#playerNames').modal('show');

    //      }else{

    //      console.log('unique items in array ' + value);

         document.getElementById('p1').innerText = player1;
         document.getElementById('p2').innerText = player2;
         document.getElementById('p3').innerText = player3;
         document.getElementById('p4').innerText = player4;

         // die klammern gehören glaub ich auch zum modalen dialog, bin ma aber nimma sicher :D 
    //      }

    // });

    playersCards.push(document.getElementById("p1cards").id);
    playersCards.push(document.getElementById("p2cards").id);
    playersCards.push(document.getElementById("p3cards").id);
    playersCards.push(document.getElementById("p4cards").id);


    $('#playerNames').modal('hide');
    post();
// unbedingt für mod dialog wieder einkommentieren!
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


        let game = {};
        game.Id = result.Id;


    
        game.nextPlayer = result.NextPlayer;
        game.topCard = result.TopCard;



        let card = {};
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
                cardDiv.setAttribute("class", "cardDiv2Style" + i) //Klassen Attribut, falls wir es brauchen
                let img = new Image();
                img.src = "cards/" + result.Players[i].Cards[j].Color + result.Players[i].Cards[j].Value + ".png";
                img.height = 100;
                cardDiv.appendChild(img);
                document.getElementById(playersCards[i]).appendChild(cardDiv);
            }
        }

    }
    else {
        alert("HTTP-Error: " + response.status)
    }
}


post();


// async function getTopCard(){
//     let response = await fetch("https://nowaunoweb.azurewebsites.net/api/game/start", {
//         method: "POST",
//         body: JSON.stringify(names),
//         headers: {
//             "Content-type": "application/json; charset=UTF-8"
//         }
//     });

//     if(response.ok){
//         let result = await response.json();
//         alert(JSON.stringify(result))
//     }
//     else{
//         alert("HTTP-Error: " + response.status)
//     }
// }
//post();