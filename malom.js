
document.body.addEventListener('click', newPoint)
document.addEventListener('DOMContentLoaded', nextTurn)

var num = 1
var steps = 13
var playerNum = 1
var currIdArray =[]
var player = 2
var nextPlayer

function newPoint(event) {  //Pont lehelyezes
    //ha nem ures helyre teszi, akkor ujra lephet
    if (num < steps && event.target.className !== 'points') {
        window.alert('Üres helyre tehetsz csak le babut!')
        return
    }

    var x = event.clientX
    var y = event.clientY
    var radius = Number(radius || 40)

    if (num < steps) {
        event.target.setAttribute('class', 'player' + playerNum + 'Point')
        if (winCheck(event.target)) {
            setTimeout(function () {
                window.alert('Malom! Levehetsz egy babut a masik jatekostol!')
            }, 100)
            document.body.removeEventListener('click', newPoint)
            document.body.addEventListener('click', remove)
        }
        if (num === steps - 1 && !canStep(event.target)) {
            setTimeout(function () {

                window.alert('Nem tudsz lepni tobbet. Nyert ' +  + ' jatekos!')
            }, 100)
        }
    }
    if (num >= steps) {
        play(event)
        if (!canStep(event.target)) {
            setTimeout(function () {
                window.alert('Nem tudsz lepni tobbet. Nyert ' + playerNum + ' jatekos!')
            }, 100)
        }
    }
    else {
        nextTurn(nextPlayer)
        playerNum = 3 - playerNum
        num += 1
    }
}

var currentPointToRemove

function play(event) {
    currIdArray = getId(event.target)//aktualis id-t array-ban kiadja
    //babuk mozgatasa
    var x = event.clientX
    var y = event.clientY
    var radius = Number(radius || 40)

    if (num % 2 === 1 ) {    //athelyezendo babu kivalsztasa
        if (event.target.className !== 'player' + playerNum + 'Point') {
            window.alert('Csak a saját bábudat mozgathatod!')
            return
        }
        else {  //csak a sajatjat tudja athelyezni
            event.target.setAttribute('class', 'player' + playerNum + 'PointRemove')
            currentPointToRemove = event.target
            num +=1
            return
        }
    }
    if (num % 2 === 0) {        //uj helyre babu lerakas
        //ha megsem azzal a babuval szeretne lepni tegye vissza
        if (event.target.className === 'player' + playerNum + 'PointRemove') {
            event.target.setAttribute('class', 'player' + playerNum + 'Point')
            num += 1
            return
        }
        if (event.target.className !== 'points') {
            window.alert('Csak üres helyre léphetsz!')
            return
        }
        else {
            //elozo id array
            var removeIdArray = getId(currentPointToRemove)
            //csak szomszedos mezokre lephessen
            if (!stepCheck(currIdArray, removeIdArray) && !canFly(playerNum)) {
                window.alert('Csak egyet léphetsz!')
                return
            }
            //ha jo helyre tette, atmozgatja a babut
            else {
                event.target.setAttribute('class', 'player' + playerNum + 'Point')
                currentPointToRemove.setAttribute('class', 'points')

                if (winCheck(event.target)) {
                    setTimeout(function () {
                        window.alert('Malom! Levehetsz egy babut a masik jatekostol!')
                    }, 100)
                    document.body.removeEventListener('click', newPoint)
                    document.body.addEventListener('click', remove)
                }
                if (!canStep(event.target)) {
                    setTimeout(function () {
                        window.alert('Nem tudsz lepni tobbet. Nyert ' + playerNum + ' jatekos!')
                    }, 100)
                }
                nextTurn(playerNum)
                playerNum = 3 - playerNum
                num += 1
                return
            }
        }
    }
}

function canFly(currPlayerNum) {     //ha kevesebb babuja van mint 4, akkor atallitja a canFly -t true-ra
    var playerPoint = document.getElementsByClassName('player' + currPlayerNum + 'Point')
    if (playerPoint.length < 4 && num >= (steps - 1)) {
        return true
    }
    else {
        return false
    }
}

function nextTurn(player) { //jatek level + jatekos kiiratasa
    nextPlayer = 3 - playerNum
    var gameLevel = document.getElementById("gameLevel")

    if (num < (steps - 1) && !canFly(nextPlayer)) {
        gameLevel.innerHTML = 'Babuk lerakasa'
        gameLevel.setAttribute('class', 'text')
    }
    else {
        if (canFly(nextPlayer)) {
            gameLevel.innerHTML = 'Tudsz repulni'
            gameLevel.setAttribute('class', 'text')
        }
        else {
            gameLevel.innerHTML = 'Lepegetes'
            gameLevel.setAttribute('class', 'text')
        }
    }
    document.getElementById("nextPlayer").innerHTML = getPlayerName(playerNum) + ' játékos következik'
}

function getPlayerName(playerNum) {
    //kiirja mellyik jatekos a kovetkezo
    if (playerNum === 2) {
        return "A piros"
    }
    if (playerNum === 1 && player === 1) {
        return "A kék"
    }
    else {
        player = 1
        return "A piros"
    }
}

function getId(point) { //adott pont ID-jat kiadja tombben
    var currElementId = point.id.split('-')
    var currIdArray = []

    for (currIdI = 0; currIdI < currElementId.length; currIdI += 1) {
        if (currIdI < 1) {
            currIdArray.push(currElementId[currIdI])
        }
        else {
            currIdArray.push(parseInt(currElementId[currIdI]))
        }
    }
    return currIdArray
}

function stepCheck(currPoint, stepPoint) {  //ellenorzi, hogy jo helyre teszi-e le a babut
    if (currPoint[1] === stepPoint[1]
        && currPoint[2] === stepPoint[2]
    ) {
            if (currPoint[2] === 2 && currPoint[1] === 1) {
                return true
            }
            if (currPoint[2] === 0 && currPoint[1] === 1) {
                return true
            }
            if (currPoint[2] === 1 && currPoint[1] === 0) {
                return true
            }
            if (currPoint[2] === 1 && currPoint[1] === 2) {
                return true
            }
            else {
                return false
            }
        }
    if (currPoint[0] === stepPoint[0]
        && currPoint[1] === stepPoint[1]
        && Math.abs(currPoint[2] - stepPoint[2]) === 1
        || currPoint[0] === stepPoint[0]
        && currPoint[2] === stepPoint[2]
        && Math.abs(currPoint[1] - stepPoint[1]) === 1) {
            return true
    }
    else {
        return false
    }
}

function remove(event) {        //nyert malom eseten babu levetel
    var removePointArray = document.getElementsByClassName('player' + playerNum + 'Point')
    var removedSucceed = false
    //nezze vegig, hogy a masik babujara kattintott-e?
    if (justMills(event.target)) {
        setTimeout(function (){
            window.alert('Sajnos nem tudsz elvenni a masiktol babut, mert mindegyik malomban van!')
        }, 100)
        document.body.addEventListener('click', newPoint)
        document.body.removeEventListener('click', remove)
        return
    }
    if (event.target.className === 'player' + playerNum + 'Point' ||
        event.target.className === 'player' + nextPlayer + 'Point' ||
        event.target.className === 'points'
        ) {
        for (var i = 0; i < removePointArray.length; i += 1) {
            var removePoint = removePointArray[i]
            // ha a masik jatekos babujara kattintott & nincs malomban az adott babu vegye le a kivalasztott babut & nem csak malomban levo babui vannak  masiknak
            if (removePoint.id === event.target.id && !winCheck(event.target)) {
                removePoint.setAttribute('class', 'points') //pont levetel
                removedSucceed = true
                break
            }
        }
        if (!removedSucceed) {  //csak a masiket tudja levenni
            if (winCheck(event.target)) {   //ha malombol venne le, jelzi
                setTimeout(function (){
                    window.alert('Malombol nem tudsz babut elvenni!')
                }, 100)
                document.body.addEventListener('click', remove)
                return
            }
            else {
                setTimeout(function (){
                    window.alert('A masik babujat tudod csak levenni!')
                }, 100)
                document.body.addEventListener('click', remove)
                return
            }
        }
        else {  // allitsa vissza, h clickre a newPoint function kovetkezzen
            document.body.addEventListener('click', newPoint)
            document.body.removeEventListener('click', remove)
            if (didPlayerWon(event.target)) {
                setTimeout(function () {
                    window.alert('Nyert a ' + playerNum + ' jatekos')
                }, 100)
            }
            return
        }
    }
    else {
        return
    }
}

function winCheck(currPoint) {      //ellenorzi, hogy van-e malom az adott lepesnel
    var currIdArr = getId(currPoint)

    if (currIdArr[2] !== 1) {  //horizontalisan vizsgal
        //letre hozza azokat a pontokat, ahol malom lehet
        var checkpoint1 = [currIdArr[0], 0, currIdArr[2]]
        var checkpoint2 = [currIdArr[0], 1, currIdArr[2]]
        var checkpoint3 = [currIdArr[0], 2, currIdArr[2]]

        checkpoint1 = document.getElementById([currIdArr[0] + '-' + 0 + '-' + currIdArr[2]])
        checkpoint2 = document.getElementById([currIdArr[0] + '-' + 1 + '-' + currIdArr[2]])
        checkpoint3 = document.getElementById([currIdArr[0] + '-' + 2 + '-' + currIdArr[2]])

        //ha megegyezik a class, ugyanolyan szinuek a pontok akkor igazzal ter vissza
        if (checkpoint1.className === checkpoint2.className &&
        checkpoint2.className === checkpoint3.className && checkpoint2.className !== 'points') {
            return true
        }
    }
    if (currIdArr[1] !== 1) { //vertikalisan vizsgal
        var checkpoint1 = [currIdArr[0], currIdArr[1], 0]
        var checkpoint2 = [currIdArr[0], currIdArr[1], 1]
        var checkpoint3 = [currIdArr[0], currIdArr[1], 2]

        checkpoint1 = document.getElementById([currIdArr[0] + '-' + currIdArr[1] + '-' + 0])
        checkpoint2 = document.getElementById([currIdArr[0] + '-' + currIdArr[1] + '-' + 1])
        checkpoint3 = document.getElementById([currIdArr[0] + '-' + currIdArr[1] + '-' + 2])

        return checkpoint1.className === checkpoint2.className &&
            checkpoint2.className === checkpoint3.className &&
            checkpoint2.className !=='points'
    }
    else {
        return false
    }
}

function didPlayerWon (currPlayer) {    //hany babuja van a soron kovetkezo jatekosnak?
    var currPlayerPieces = document.getElementsByClassName('player' + playerNum + 'Point')
    if (currPlayerPieces.length < 3 && num >= steps) {
        return true
    }
    else {
        return false
    }
}

function justMills(currPlayer) {    //ellenorzi, h minden babuja malomban van-e
    var currPlayerPieces = document.getElementsByClassName('player' + playerNum + 'Point')
    var inMill = true
    //vegig kell neznie az osszes pontot, ha mindegyik malomban van akkor igaz h csak malomban levo babui lehetnek
    for (var i = 0; i < currPlayerPieces.length; i += 1) {
        //ha barmelyik elemere igaz h nincs malomban lepj ki false-szal
        if (!winCheck(currPlayerPieces[i])) {
            return false
        }
    }
    return true
}
//ha nem tud lepni a masik Nyert
function canStep(actualPoint) {
    nextPlayer = 3 - playerNum
    var currPlayerPointsList = document.getElementsByClassName('player' + nextPlayer + 'Point')
    var eachFreePointsList = document.getElementsByClassName('points')
    for (var i = 0; i < currPlayerPointsList.length; i += 1) {
        var currPlayerPoint = currPlayerPointsList[i]
        var currCheckPieceId = getId(currPlayerPoint)
        //az osszes Points classu pontot csekkolja, h oda lephet e
        //ha lephetne oda akkor true val ter vissza, ha nem talal ilyet akkor false-szal
        for (var j = 0; j < eachFreePointsList.length; j += 1) {
            var currFreePoint = eachFreePointsList[j]
            var currFreePointId = getId(currFreePoint)
            if (stepCheck(currCheckPieceId, currFreePointId)) {
                return true
            }
        }
    }
    return false
}
