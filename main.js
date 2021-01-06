'use strict';

// Kommentar zum pushen damit wir nochmal alles neu löschen können
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

let players = [];

let player1;
let player2;
let player3;
let player4;


let redBtn = document.getElementById('red');
redBtn.addEventListener('click', function () {
    wildColor = 'Red';
    colorCheck = 'Red';
    $('#pickColor').modal('hide');
    playCard(clickedId);
});

let yellowBtn = document.getElementById('yellow');
yellowBtn.addEventListener('click', function () {
    wildColor = 'Yellow';
    colorCheck = 'Yellow';
    $('#pickColor').modal('hide');
    playCard(clickedId);
});

let greenBtn = document.getElementById('green');
greenBtn.addEventListener('click', function () {
    wildColor = 'Green';
    colorCheck = 'Green';
    $('#pickColor').modal('hide');
    playCard(clickedId);
});

let blueBtn = document.getElementById('blue');
blueBtn.addEventListener('click', function () {
    wildColor = 'Blue';
    colorCheck = 'Blue';
    $('#pickColor').modal('hide');
    playCard(clickedId);
});

function startGame() {

    let startPic = document.createElement('img');
    startPic.setAttribute('class', 'starter');
    $('.show').hide();
    $('#welcomeUno').modal();
}

 startGame();

const blaSub = document.getElementById('blaBtn');
blaSub.addEventListener('click', function (evt) {
    evt.preventDefault();
    $('#welcomeUno').modal('hide');
    $('#playerNames').modal('show');
});

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

    fehlerMeldung5();
    players = [];
    $('#playerNamesForm')[0].reset();
} else {
    $('#playerNames').modal('hide');
    $('.show').show();//Show Page Content
    document.body.className = document.body.className.replace('starter','');
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

        scores.push(document.getElementById('score1').id);
        scores.push(document.getElementById('score2').id);
        scores.push(document.getElementById('score3').id);
        scores.push(document.getElementById('score4').id);

        players.forEach(element =>
            getCards(element));
    }
    else {
        alert('HTTP-Error: ' + response.status)
    }
}

//* ClickEvent für den Stapel zum Abheben
const btnDraw = document.getElementById('drawDeck');
btnDraw.addEventListener('click', function (e) {
    e.preventDefault;

    btnDraw.classList.remove('wobble-hor-top');

    void btnDraw.offsetWidth;

    drawCard();

    btnDraw.classList.add('wobble-hor-top');
}, false);


function showActivePlayer() {

    document.getElementById('activePlayer').innerText = currentPlayer;
}

function generateCardImg(card) {
    let pic = document.createElement('img');
    let color = card.Color;
    let value = card.Value;
    pic.src = 'cards/' + color + value + '.png';
    return pic;
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

        card = result;

        if (card.Color == 'Black') {
            card.Color = colorCheck;

        }

        img = generateCardImg(card);
        let tcDom = document.getElementById('topCard');
        tcDom.replaceWith(img);
        img.setAttribute('id', 'topCard');

        if (card.Value == 12) {
            direction *= -1;
            console.log('Richtungswechsel abgespeichert! ', direction);
        }

        topCard = result;

    } else {
        ('HTTP-Error: ' + response.status)
    }
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

        //* Nächsten Spieler auf current setzen
        currentPlayer = result.NextPlayer;
        currentNum = players.indexOf(currentPlayer);

        //* getCards holt die karten vom aktuellen spieler und weißt sie dem currentCardArr zu
        updatePlayground();
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
        let check = players.indexOf(player);

        let parentNode = document.getElementById(playersCards[check]);
        while (parentNode.firstChild) {
            parentNode.removeChild(parentNode.lastChild);
        }

        while (parentNode.childElementCount < result.Cards.length) {
            card = result.Cards[parentNode.childElementCount];
            img = generateCardImg(card);
            img.setAttribute('id', check + 'card' + (parentNode.childElementCount));
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
        getCards(elem)
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

    // variable für richtiger player check
    let i2CheckPlayer = players.indexOf(currentPlayer);
    // indexNummer die an der ID angehängt ist mit substring rauslesen:
    let i4CardArr = clickedId.substring(5);

    if (i2CheckPlayer == clickedId.charAt(0)) {

        let removeCard = currentCards[i4CardArr];

        colorRC = removeCard.Color;
        valueRC = removeCard.Value;


        let colorTC = topCard.Color;
        let valueTC = topCard.Value;


        if (topCard.Color == 'Black') {
            colorTC = colorCheck;
        }

        if (topCard.Value == 13 || topCard.Value == 14) {
            if (valueRC == 13) {
                fehlerMeldung4();
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
                }
            }
        } else if (valueRC == valueTC || colorRC == colorTC) {
            playCard(clickedId);
        } else {
            fehlerMeldung1();
        }
    } else {
        fehlerMeldung2();
    }
}


function wildCardCheck() {
    let i = 0;
    while (i < currentCards.length) {
        if (currentCards[i].Value == topCard.Value || currentCards[i].Color == topCard.Color) {
            return false;
        } else {
            i++;
        }
    } return true;

}

function animateCard(clickedId) {
    document.getElementById(clickedId).classList.add('slide-out-top');
}


async function playCard(clickedId) {

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

        //* Nächsten Spieler auf current setzen
        currentPlayer = result.Player;
        currentNum = players.indexOf(currentPlayer);

        if (result.Score == 0) {
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
    $('.show').hide();

    let winnerPlayer = document.createElement('h2');
    winnerPlayer.setAttribute('class', 'winnerPlayer');
    winnerPlayer.innerText = result + ' has won!';

    document.getElementById('winner').appendChild(winnerPlayer);
    endAnimation();
}

//FEHLERMELDUNGEN

function fehlerMeldung1() {
    let meldung = document.createElement('h2');
    meldung.setAttribute('id', 'meldung1');
    meldung.innerText = 'This card doesn not match, please play a different one or draw one from the deck';
    document.getElementById('warnings').appendChild(meldung);
    document.getElementById('meldung1').classList.add('bounce-out-top');

}

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