'use strict';


//**** global variables ****/  

let gameId;
let playersCards = [];
let scores = [];

let currentPlayer;
let currentNum;
let player;
let card = {};

let wildColor = '';
let pickedColor;
let colorRC;
let valueRC;

let img;
let topCard = {};
let currentCards;
let clickedId;
//* value that is needed to get the prev/next player
let direction = 1;
let colorCheck = '';




// modaler dialog funzt, damit erspart man sich das permanente eingeben:
let players = [];
// let player1 = 'Hansi';
// let player2 = 'Helga';
// let player3 = 'Wurschti';
// let player4 = 'Greti';

let player1;
let player2;
let player3;
let player4;


let redBtn = document.getElementById('red');
redBtn.addEventListener('click', function () {
    wildColor = 'Red';
    colorCheck = 'Red';
    $('#pickColor').modal('hide');
    // console.log(clickedId);
    playCard(clickedId);
});

let yellowBtn = document.getElementById('yellow');
yellowBtn.addEventListener('click', function () {
    wildColor = 'Yellow';
    colorCheck = 'Yellow';
    $('#pickColor').modal('hide');
  //  console.log(clickedId);
    playCard(clickedId);
});

let greenBtn = document.getElementById('green');
greenBtn.addEventListener('click', function () {
    wildColor = 'Green';
    colorCheck = 'Green';
    $('#pickColor').modal('hide');
 //   console.log(clickedId);
    playCard(clickedId);
});

let blueBtn = document.getElementById('blue');
blueBtn.addEventListener('click', function () {
    wildColor = 'Blue';
    colorCheck = 'Blue';
    $('#pickColor').modal('hide');
  //  console.log(clickedId);
    playCard(clickedId);
});

// players.push(player1, player2, player3, player4);



function startGame() {

    let startPic = document.createElement('img');
    startPic.setAttribute('class', 'starter');
    $('.show').hide();//hide
    $('#welcomeUno').modal();
}

 startGame();

const blaSub = document.getElementById('blaBtn');
blaSub.addEventListener('click', function (evt) {
    evt.preventDefault();
    $('#welcomeUno').modal('hide');
    $('#playerNames').modal('show');
});

//! Modalen Dialog öffnen um Namen einzugeben
// $('#playerNames').modal()

 document.getElementById('playerNamesForm').addEventListener('submit', function (evt) {
     console.log('submit')

     evt.preventDefault();


     player1 = document.getElementById('pn1').value;
     players.push(player1);


     player2 = document.getElementById('pn2').value;
     players.push(player2);


     player3 = document.getElementById('pn3').value;
     players.push(player3);


     player4 = document.getElementById('pn4').value;
     players.push(player4);


//* erstellt ein neues Array mit den Namen in kleinbuchstaben und ohne duplikate
let nameCheck = players.join(',').toLowerCase().split(',').sort().join(',').replace(/(([^,]+),)(?=\2)/g, '').split(',');

if (nameCheck.length < players.length) {
   // console.log(nameCheck);
   //! Animation für falsche Namen?
   // alert('Bitte 4 verschiedene Namen eingeben!');
    fehlerMeldung5();
    players = [];
    $('#playerNamesForm')[0].reset();
} else {
    $('#playerNames').modal('hide');
    $('.show').show();//Show Page Content
    document.body.className = document.body.className.replace('starter','');

    generateBackImg();
    startResponse();
}

});



async function startResponse() {
    let response = await fetch('https://nowaunoweb.azurewebsites.net/api/game/start', {
        method: 'POST',
        body: JSON.stringify(players),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    });

    if (response.ok) {
        let result = await response.json();
    //    console.log(result);

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
        pic.setAttribute('id', 'topCard');
        let center = document.getElementById('decks');
        center.appendChild(pic);


        document.getElementById('p1').innerText = player1;
        document.getElementById('p2').innerText = player2;
        document.getElementById('p3').innerText = player3;
        document.getElementById('p4').innerText = player4;

        playersCards.push(document.getElementById('p1cards').id);
        playersCards.push(document.getElementById('p2cards').id);
        playersCards.push(document.getElementById('p3cards').id);
        playersCards.push(document.getElementById('p4cards').id);

        // //* playerCards zuweisen & ins html einfügen
        // for (let i = 0; i < playersCards.length; i++) {

        //     for (let j = 0; j < result.Players[i].Cards.length; j++) {

        //         card = result.Players[i].Cards[j];
        //         img = generateCardImg(card);

        //         img.setAttribute('id', i + 'card' + j);
        //         img.setAttribute('onclick', 'cardCheck(this.id)');
        //         img.setAttribute('class', 'cards');

        //         document.getElementById(playersCards[i]).appendChild(img);
        //     }
        // }


        scores.push(document.getElementById('score1').id);
        scores.push(document.getElementById('score2').id);
        scores.push(document.getElementById('score3').id);
        scores.push(document.getElementById('score4').id);

        players.forEach(element =>
            getCards(element));


        // for (let i = 0; i < scores.length; i++) {
        //     let score = document.createElement('p');
        //     score.innerText = result.Players[i].Score;
        //     score.setAttribute('class', 'score');

        //     document.getElementById(scores[i]).appendChild(score);
        // }

    }
    else {
        alert('HTTP-Error: ' + response.status)
    }
}

//* ClickEvent für den Stapel zum Abheben
const btnDraw = document.getElementById('drawDeck');
// btnDraw.addEventListener('click', drawCard);
btnDraw.addEventListener('click', function (e) {
    e.preventDefault;

    btnDraw.classList.remove('wobble-hor-top');

    void btnDraw.offsetWidth;

    drawCard();

    btnDraw.classList.add('wobble-hor-top');
}, false);




//! wenn modaler dialog auskommentiert! - da post aufrufen!
//startResponse();

function showActivePlayer() {


    document.getElementById('activePlayer').innerText = currentPlayer;

    // let currP = currentIndex(),
    //    $active = $('#p' + currP + 'cards');

    // document.getElementById('activePlayer').classList.toggle('wobble-hor-bottom');

    //document.getElementById('drawDeck').classList.remove('wobble-hor-bottom');

    //  $('cardDiv').classList.remove('activeP'); +
    //  $active.classList.add('activeP');

    //  $('.cardDiv').css('transform', 'scale(1)'); +
    //  $active.css('transform', 'scale(1.1)');



    // let prevP = previousIndex();

    // let highlightField = document.getElementById('act'+ currP);
    // console.log('act'+ currP);
    // console.log('act' + (prevP));
    // let removeHighlight = document.getElementById('act' + (prevP));
    // $(removeHighlight).removeClass('highlight');
    // $(highlightField).addClass('highlight');



    //* ClickEvent für den Stapel zum Abheben

    // btnDraw.addEventListener('click', drawCard);

    animateActivePlayer(currentPlayer);


}

function animateActivePlayer(currentPlayer) {

    let helper = previousIndex();
    //console.log(helper);
    //let activeP = document.getElementById('p' + helper);

    //activeP.preventDefault;
    //  if(activeP.classList.contains('wobble-hor-top')){
    //      activeP.classList.remove('wobble-hor-top');
    //    }


    //   void activeP.offsetWidth;

  //  activeP.classList.add('wobble-hor-top');

}

function generateCardImg(card) {
    let pic = document.createElement('img');
    let color = card.Color;
    let value = card.Value;
    pic.src = 'cards/' + color + value + '.png';
    return pic;

}

function generateBackImg() {
    let picture = document.createElement('img');


}

async function getTopCard() {

    let response = await fetch('https://nowaunoweb.azurewebsites.net/api/game/topCard/' + gameId, {
        method: 'GET',
        contentType: 'application/json',
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    });


    if (response.ok) {
        let result = await response.json();

        // console.log(result);



        // console.log(result);
        card = result;

        if (card.Color == 'Black') {
            card.Color = colorCheck;

        }

        img = generateCardImg(card);
        let tcDom = document.getElementById('topCard');
        tcDom.replaceWith(img);
        img.setAttribute('id', 'topCard');
        // img.classList.toggle('swirl-in-fwd');

        //  img.classList.remove('swirl-in-fwd');


        /*      card = result;
              img = generateCardImg(card);
      
      
              tcDom.replaceWith(img);
              img.setAttribute('id', 'topCard');
              
      */
        //  img.classList.remove('swirl-in-fwd');


        if (card.Value == 12) {
            direction *= -1;
            console.log('Richtungswechsel abgespeichert! ', direction);
        }



        topCard = result;
    //    console.log(topCard);

    } else {
        ('HTTP-Error: ' + response.status)
    }
}

function currentIndex() {

    let domId = currentNum + direction;
    // let maxIdx = (players.length - 1);

    // if (domId < 0) {
    //     domId = maxIdx
    // }
    // else {
    //     if (domId > maxIdx) {
    //         domId = 0
    //     }
    // }

    return domId;

}

function previousIndex() {

    let oldIdx = players.indexOf(currentPlayer);
    let maxIdx = (players.length - 1);

    let prevIdx = oldIdx + direction;
    if (prevIdx < 0) {
        prevIdx = maxIdx
    }
    else {
        if (prevIdx > maxIdx) {
            prevIdx = 0
        }
    }
    return prevIdx;
}

async function drawCard() {

    let response = await fetch('https://nowaunoweb.azurewebsites.net/api/game/drawCard/' + gameId, {
        method: 'PUT',
        contentType: 'application/json',
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    });

    if (response.ok) {
        let result = await response.json();
        // console.log(result);

        // document.getElementById('drawDeck').classList.add('wobble-hor-bottom');
        // setTimeout('document.getElementById(\'drawDeck\').classList.remove(\'wobble-hor-bottom\');',100);

        // let check = players.indexOf(currentPlayer);
        // let arrCardSize = document.getElementById(playersCards[check]).childElementCount;
        // console.log(arrCardSize);
        // card = result.Card;
        // img = generateCardImg(card);
        // img.setAttribute('id', check + 'card' + arrCardSize);
        // img.setAttribute('onclick', 'cardCheck(this.id)');
        // img.setAttribute('class', 'cards');

        // document.getElementById(playersCards[check]).appendChild(img);

        // //* check muss eins größer als index vom array sein!
        // check++;
        // let newScore = document.getElementById('score' + check).innerText;

        // newScore = parseInt(newScore);
        // newScore += result.Card.Score;

        // document.getElementById('score' + check).innerText = newScore;


        //* Nächsten Spieler auf current setzen
        currentPlayer = result.NextPlayer;
        currentNum = players.indexOf(currentPlayer);
       //  console.log('Am Zug ist nun: ', currentPlayer);

        //* getCards holt die karten vom aktuellen spieler und weißt sie dem currentCardArr zu
        updatePlayground();

        //   console.log(result.NextPlayer);
        // das sollte auch nach dem ablegen einer karte gemacht werden!
        //  currentPlayer = result.NextPlayer;
        //  getCards();

        //  }
    }
    else {
        alert('HTTP-Error: ' + response.status)
    }
}



async function getCards(player) {


    let response = await fetch('https://nowaunoweb.azurewebsites.net/api/game/getCards/' + gameId
        + '?playerName=' + player, {
        method: 'GET',
        contentType: 'application/json',
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    });

    if (response.ok) {
        let result = await response.json();
       // console.log(result);
        let check = players.indexOf(player);

        let parentNode = document.getElementById(playersCards[check]);
        while (parentNode.firstChild) {
            parentNode.removeChild(parentNode.lastChild);
        }

        while (parentNode.childElementCount < result.Cards.length) {
            card = result.Cards[parentNode.childElementCount];
            img = generateCardImg(card);
            img.setAttribute('id', check + 'card' + (parentNode.childElementCount));
            //  console.log('id', check + 'card' + (parentNode.childElementCount));
            img.setAttribute('onclick', 'cardCheck(this.id)');
            img.setAttribute('class', 'cards');

            document.getElementById(playersCards[check]).appendChild(img);
        }




        //* Score im html aktualisieren
        document.getElementById('score' + (check + 1)).innerText = result.Score;


        //* currentCards für currentPlayer zwischenspeichern 
        if (player == currentPlayer) {
            currentCards = result.Cards;
        }

       // console.log(player + ' hat neu gemischte Karten');

    }
    else {
        alert('HTTP-Error: ' + response.status)
    }
}



async function updatePlayground() {

    let prev = previousIndex();

    players.forEach(function (elem) {
        let check = players.indexOf(elem);
        let current = players.indexOf(currentPlayer);
       // console.log(currentPlayer);


        // Etwas überlegen dass bei skip (val11) der current und der spieler 2 plätze weiter
        // und das da unten ist eben für den letzten der gespielt hat und den nächsten, bei skip werden die falschen karten aktualisiert
        // if(check == prev || check == current){
        // setTimeout(() => getCards(elem), 1000)
        getCards(elem)
        //   }

        // Etwas überlegen dass bei skip (val11) der current und der spieler 2 plätze weiter
        // und das da unten ist eben für den letzten der gespielt hat und den nächsten, bei skip werden die falschen karten aktualisiert
        // if(check == prev || check == current){
        //   }


    })

    getTopCard();


    showActivePlayer();


}


function cardCheck(clickedId) {

    let exists1 = document.getElementById('meldung2');

    if (exists1) {
        document.getElementById('meldung2').classList.remove('bounce-out-top');
        document.getElementById('warnings').removeChild(exists1);
    }

    let exists2 = document.getElementById('meldung1');

    if (exists2) {
        document.getElementById('meldung1').classList.remove('bounce-out-top');
        document.getElementById('warnings').removeChild(exists2);
    }

    let exists3 = document.getElementById('meldung3');

    if (exists3) {
        document.getElementById('meldung3').classList.remove('bounce-out-top');
        document.getElementById('warnings').removeChild(exists3);
    }

    let exists4 = document.getElementById('meldung4');

    if (exists4) {
        document.getElementById('meldung4').classList.remove('bounce-out-top');
        document.getElementById('warnings').removeChild(exists4);
    }

   // console.log('aktueller spieler', currentPlayer);
    // variable für richtiger player check
    let i2CheckPlayer = players.indexOf(currentPlayer);
    // indexNummer die an der ID angehängt ist mit substring rauslesen:
    let i4CardArr = clickedId.substring(5);

    //console.log(i4CardArr);
    // console.log(i2CheckPlayer);
    if (i2CheckPlayer == clickedId.charAt(0)) {
        // console.log(clickedId);


        let removeCard = currentCards[i4CardArr];
       // console.log(removeCard);
        colorRC = removeCard.Color;
        valueRC = removeCard.Value;


        let colorTC = topCard.Color;
        let valueTC = topCard.Value;


        if (topCard.Color == 'Black') {
          //  console.log(colorTC);
            colorTC = colorCheck;
        }

        if (topCard.Value == 13 || topCard.Value == 14) {
            if (valueRC == 13) {
                fehlerMeldung4();
               // alert("+4 darf nicht auf schwarz gespielt werden");
                return;
            } else {
                colorTC = colorCheck;
            }
        }

        if (colorRC == "Black") {
            if (valueRC == 14) {
                $('#pickColor').modal();
                animateCard(clickedId);
            } else if (valueRC == 13) {
                let bool = wildCardCheck();
                if (bool) {
                    $('#pickColor').modal();
                    animateCard(clickedId);
                } else {
                    fehlerMeldung3();
               //     alert("Ungültiger Spielzug, Sie haben noch passende Karten, bitte gültige Karte spielen!");
                }
            }
        } else if (valueRC == valueTC || colorRC == colorTC) {
            playCard(clickedId);
        } else {
            fehlerMeldung1();
           // alert("Bitte eine passende Karte spielen!");
            //getCards(currentPlayer);
        }
    } else {
        fehlerMeldung2();
       // alert("Falsche Kartenhand!");

    }
}

//         if (colorRC == 'Black') {
//             let bool = wildCardCheck();
//             if ((topCard.Value == 13 || topCard.Value == 14) && valueRC == 13) {
//                 alert("+4 darf nicht auf schwarz gespielt werden")
//                 return;
//             }else if (bool) {
//                 $('#pickColor').modal();
//                 animateCard(clickedId);
//             } else {
//                 //! Animation für +4, darf nur gespielt werden wenn keine passende karte oder topcard nicht schwarz ist 
//                 fehlerMeldung3();
//                 console.log("Fehlermeldung bei Falsch Schwarz spielen");
//                 return;
//             }           

//         } else if (valueRC == valueTC || colorRC == colorTC) {
//             playCard(clickedId);
//             animateCard(clickedId);
//         } else if (valueRC == 14){
//             $('#pickColor').modal();
//             animateCard(clickedId);
//         } else {
//             //! Animation für unpassende Farbe/Zahl
//             fehlerMeldung1();
//             console.log("Fehlermeldung bei unpassende Farbe/Zahl");
//         }
//     } else {
//         //! Animation für falsche Persönlichkeitskartenhand
//         fehlerMeldung2();
//         console.log("Fehlermeldung bei unpassende Kartenhand");

//     }
// }


// function wildCardCheck() {
//     let i = 0;
//     let bool;
//     while (i < currentCards.length) {
//         if (currentCards[i].Value == topCard.Value || currentCards[i].Color == topCard.Color) {
//             console.log('Karte gefunden.');
//             alert("Sie haben noch passende Karten auf der Hand!")
//             bool = false;
//             // break;
//         } else {
//             console.log(currentCards[i], topCard);
//             console.log('Karte stimmt nicht überein.');
//             i++;
//             bool = true;
//         }
//         return bool;
//     }
// }

function wildCardCheck() {
    let i = 0;
    while (i < currentCards.length) {
    //    console.log(currentCards);
        if (currentCards[i].Value == topCard.Value || currentCards[i].Color == topCard.Color) {
        //    console.log("Karte gefunden.", currentCards[i]);
            return false;
            // break;
        } else {
       //     console.log("Karte stimmt nicht überein.", i);
            i++;
        }
    } return true;

}

function animateCard(clickedId) {
    document.getElementById(clickedId).classList.add('slide-out-top');
}


async function playCard(clickedId) {


   // console.log(wildColor);
    //console.log(currentPlayer, '  CurrentPlayer in playCard');

    let response = await fetch('https://nowaunoweb.azurewebsites.net/api/game/playCard/' + gameId +
        '?value=' + valueRC + '&color=' + colorRC + '&wildColor=' + wildColor, {
        method: 'PUT',
        contentType: 'application/json',
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    });

    if (response.ok) {
        let result = await response.json();
  //      console.log(result);
        //   alert(JSON.stringify(result));

        // if (colorRC == 'Black') {
        //     $('#WCForm').modal()
        // }


        // let deleteCard = document.getElementById(clickedId);
        // let pic = deleteCard;
        // console.log(clickedId);
        // console.log(deleteCard.parentElement);
        // deleteCard.parentElement.removeChild(deleteCard);
        // let oldTc = document.getElementById('topCard');
        // console.log(oldTc);

        // oldTc.replaceWith(pic);
        // pic.setAttribute('id', 'topCard');

        // // Score anpassen nachdem Karte gespielt wurde

        // let pscore = clickedId.charAt(0);
        // pscore++;
        // console.log('Nummer für PlayerScore', pscore);

        // // clickedId = '';
        // let path = deleteCard.src;
        // let numPlus = path.replace(/^\D+/g, '');

        // let num = numPlus.replace('.png', '');


        // let newScore = document.getElementById('score' + pscore).innerText;
        // newScore = parseInt(newScore);
        // newScore -= num;
        // document.getElementById('score' + pscore).innerText = newScore;



        //* Nächsten Spieler auf current setzen
        currentPlayer = result.Player;
        currentNum = players.indexOf(currentPlayer);


        if (result.Score == 0) {
         //   console.log(result);
         //   console.log(currentPlayer + 'has won! Congratulations! The game has finished!');
          //  alert(currentPlayer + ' hat gewonnen!');
            winner(result.Player);
        }


        updatePlayground();

    }
    else {
        alert('HTTP-Error: ' + response.status)
    }
}

function winner(result) {
  
    let exitPic = document.createElement('img');
    exitPic.setAttribute('class', 'ball');
    $('.show').hide();//hide

    let winnerPlayer = document.createElement('h2');
    winnerPlayer.setAttribute('class', 'winnerPlayer');
    winnerPlayer.innerText = result + ' has won!';

    document.getElementById('winner').appendChild(winnerPlayer);
    endAnimation();
}

//FEHLERMELDUNGEN

//ungültige Karte gespielt, bitte andere Karte spielen
function fehlerMeldung1() {
    let meldung = document.createElement('h2');
    meldung.setAttribute('id', 'meldung1');
    meldung.innerText = 'This card doesn not match, please play a different one or draw one from the deck';
    document.getElementById('warnings').appendChild(meldung);
    document.getElementById('meldung1').classList.add('bounce-out-top');

}

//falsche HandKarte (falscher Spieler)
function fehlerMeldung2() {
    let meldung = document.createElement('h2');
    meldung.setAttribute('id', 'meldung2');
    meldung.innerText = 'It is not this Player\'s turn yet, please choose the correct personality to play';
    document.getElementById('warnings').appendChild(meldung);
    document.getElementById('meldung2').classList.add('bounce-out-top');

}

function fehlerMeldung3() {
    let meldung = document.createElement('h2');
    meldung.setAttribute('id', 'meldung3');
    meldung.innerText = 'Invalid move, you still have matching cards, please play a valid card!';
    document.getElementById('warnings').appendChild(meldung);
    document.getElementById('meldung3').classList.add('bounce-out-top');

}

function fehlerMeldung4() {
    let meldung = document.createElement('h2');
    meldung.setAttribute('id', 'meldung4');
    meldung.innerText = 'Invalid move, you play +4 on a black card!';
    document.getElementById('warnings').appendChild(meldung);
    document.getElementById('meldung4').classList.add('bounce-out-top');

}

function fehlerMeldung5() {
    let meldung = document.createElement('h2');
    meldung.setAttribute('id', 'meldung5');
    meldung.innerText = 'Please enter 4 different names';
    document.getElementById('playerNames').appendChild(meldung);
    document.getElementById('meldung5').classList.add('bounce-out-top');

}



function endAnimation() {
    const colors = ["#3CC157", "#2AA7FF", "#1B1B1B", "#FCBC0F", "#F85F36"];

    const numBalls = 50;
    const balls = [];

    for (let i = 0; i < numBalls; i++) {
        let ball = document.createElement("div");
        ball.classList.add("ball");
        ball.style.background = colors[Math.floor(Math.random() * colors.length)];
        ball.style.left = `${Math.floor(Math.random() * 100)}vw`;
        ball.style.top = `${Math.floor(Math.random() * 100)}vh`;
        ball.style.transform = `scale(${Math.random()})`;
        ball.style.width = `${Math.random()}em`;
        ball.style.height = ball.style.width;

        balls.push(ball);
        document.body.append(ball);
    }

    // Keyframes
    balls.forEach((el, i, ra) => {
        let to = {
            x: Math.random() * (i % 2 === 0 ? -11 : 11),
            y: Math.random() * 12
        };

        let anim = el.animate(
            [
                { transform: "translate(0, 0)" },
                { transform: `translate(${to.x}rem, ${to.y}rem)` }
            ],
            {
                duration: (Math.random() + 1) * 2000,
                direction: "alternate",
                fill: "both",
                iterations: Infinity,
                easing: "ease-in-out"
            }
        );
    });
}
