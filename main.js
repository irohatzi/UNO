"use strict";


// Modalen Dialog öffnen um Namen einzugeben
$('#playerNames').modal()


const log = document.getElementById('log');
const players = [''];

document.getElementById('playerNamesForm').addEventListener('submit', function(evt){
    console.log('submit')
  
    evt.preventDefault()
  
    // Element Spieler erzeugen und Input des Users zuweisen
    let para1 = document.createElement('p');
    // Userinput in den paragraph setzen
    para1.innerText = document.getElementById('pn1').value;
    players.push(para1.innerText);
    document.getElementById('p1').appendChild(para1);
  
    let para2 = document.createElement('p');
    para2.innerText = document.getElementById('pn2').value;
    players.push(para2.innerText);
    document.getElementById('p2').appendChild(para2);
  
    let para3 = document.createElement('p');
    para3.innerText = document.getElementById('pn3').value;
    players.push(para3.innerText);
    document.getElementById('p3').appendChild(para3);
  
    let para4 = document.createElement('p');
    para4.innerText = document.getElementById('pn4').value;
    players.push(para4.innerText);
    document.getElementById('p4').appendChild(para4);
  
    $('#playerNames').modal('hide')
    post();
  
  })


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

    }
    else{
        alert("HTTP-Error: " + response.status)
    }
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