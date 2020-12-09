"use strict";






const log = document.getElementById('log');
let players = [''];
const gameId = {};


// Modalen Dialog öffnen um Namen einzugeben
    $('#playerNames').modal()
    
    document.getElementById('playerNamesForm').addEventListener('submit', function(evt){
        console.log('submit')
      
        evt.preventDefault()
      

        let pl1 = document.getElementById('pn1').value;
        players.push(pn1);
        document.getElementById('p1').innerText = pl1;
      
        let pl2 = document.getElementById('pn2').value;
        players.push(pn2);
        document.getElementById('p2').innerText = pl2;

        let pl3 = document.getElementById('pn3').value;
        players.push(pn3);
        document.getElementById('p3').innerText = pl3;

        let pl4 = document.getElementById('pn4').value;
        players.push(pn4);
        document.getElementById('p4').innerText = pl4;

        let playersCards = [];
            playersCards.push(document.getElementById("oben").id);
            handkartenDivNames.push(document.getElementById("rechts").id);
            handkartenDivNames.push(document.getElementById("unten").id);
            handkartenDivNames.push(document.getElementById("links").id);
        
        $('#playerNames').modal('hide');
      })
    



function checkIfDuplicateExists(players){
    return new Set(players).size !== players.length 
}

function hasDuplicates() {
    var valuesSoFar = Object.create(null);
    for (var i = 0; i < array.length; ++i) {
        var value = players[i];
        if (value in valuesSoFar) {
            return true;
        }
        valuesSoFar[value] = true;
    }
    return false;
}

async function post(){
    let response = await fetch("https://nowaunoweb.azurewebsites.net/api/game/start", {
        method: "POST",
        body: JSON.stringify(players),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });

    if(response.ok){
        let result = await response.json();
        // alert(JSON.stringify(result))

        const gameId = document.createElement('p');
        gameId.innerText = result.Id;
        document.getElementById('gId').appendChild(gameId);

        // let player1 = createElement('p');
        // player1.innerText = result.Players[1];
        // document.getElementById('p1').appendChild(player1.Cards[1])
        // const player2 = result.player2;
        // const player3 = {};
        // const player4 = {};


    }
    else{
        alert("HTTP-Error: " + response.status)
    }
}
post();

if(checkIfDuplicateExists){
    document.getElementById('pn1').value = "";
    document.getElementById('pn2').value = "";
    document.getElementById('pn3').value = "";
    document.getElementById('pn4').value = "";


} else {
    


}


// post();

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