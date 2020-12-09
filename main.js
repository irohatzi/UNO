"use strict";


let players = [''];
const gameId = {};


// Modalen Dialog öffnen um Namen einzugeben
$('#playerNames').modal()

document.getElementById('playerNamesForm').addEventListener('submit', function (evt) {
    console.log('submit')

    evt.preventDefault()


    let player1 = document.getElementById('pn1').value;
    players.push(player1);
    document.getElementById('p1').innerText = player1;

    let player2 = document.getElementById('pn2').value;
    players.push(player2);
    document.getElementById('p2').innerText = player2;

    let player3 = document.getElementById('pn3').value;
    players.push(player3);
    document.getElementById('p3').innerText = player3;

    let player4 = document.getElementById('pn4').value;
    players.push(player4);
    document.getElementById('p4').innerText = player4;

    let playersCards = [];
    playersCards.push(document.getElementById("p1").id);
    playersCards.push(document.getElementById("p2").id);
    playersCards.push(document.getElementById("p3").id);
    playersCards.push(document.getElementById("p4").id);

    $('#playerNames').modal('hide');
    post();

})





// function checkIfDuplicateExists(players){
//     return new Set(players).size !== players.length 
// }

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
        let test = document.createElement('p');
        test.innerText = result.Id;
        document.getElementById('gId').appendChild(test);

    
        game.nextPlayer = result.NextPlayer;
        game.topCard = result.TopCard;


        let card = {};
        card.color = result.Color;
        card.text = result.Text;
        card.value = result.Value;
        card.score = result.Score;

        let firstCard = document.getElementById("gId");
        let img = new Image();
        img.src = "cards/" + result.TopCard.Color + result.TopCard.Value + ".png";
        img.height = 200;
        firstCard.appendChild(img);
        firstCard = game.topCard;

    }
    else {
        alert("HTTP-Error: " + response.status)
    }
}


// playerCards
for (let i = 0; i < playersCards.length; i++) {

    for (let j = 0; j < 7; j++) {
        let card = document.createElement("div");
        Karte.setAttribute("class", "pcards" + i) //Klassen Attribut, falls wir es brauchen
        let img = new Image();
        img.src = "cards/" + game.TopCard.Color + game.TopCard.Value + ".png";
        img.height = 90;
        startkarte.appendChild(img);
        document.getElementById(playersCards[i]).appendChild(Karte);
    }
}


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