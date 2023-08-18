var gameContainer = document.getElementById('game');
var rowLength = document.getElementsByClassName('row')[0].innerHTML.length;
var gameHeight = document.getElementsByClassName('row').length
var activeWords = [];
var wordList = [
    'AAAAA',
    'BBBBB'
]
const rowDivs = gameContainer.querySelectorAll('.row');
var tickCount = 0;
var gameInterval;

// give all row characters their own span tag
rowDivs.forEach(rowDiv => {
    const rowText = rowDiv.textContent;
    const newRowContent = rowText
        .split('')
        .map(char => `<span>${char}</span>`)
        .join('');
    rowDiv.innerHTML = newRowContent;
});


var gameTable = []
gameContainer.querySelectorAll('div').forEach(row =>
    gameTable.push(row.children)
)

function getCoordinates(x, y) {
    x--;
    y--;
    if ((y < gameTable.length) && (x < gameTable[0].length)) {
        return gameTable[y][x]
    }
    return null;
}

function setWord(wordObject) {
    for (var i = wordObject.x; i < wordObject.x + wordObject.word.length; i++) {
        var spanTag = getCoordinates(i, wordObject.y)
        console.log(wordObject)
        var letter = wordObject.word[i - wordObject.x]
        spanTag.innerText = letter;
        if (wordObject.dead) 
            {spanTag.classList.add('red');}
        else 
            {spanTag.classList.add('black')}
        
    }
}

function resetBoard() {
    rowDivs.forEach(rowDiv => {
        const spanTags = rowDiv.querySelectorAll('span');
        spanTags.forEach(spanTag => {
            spanTag.classList = [];
            spanTag.innerText = '.';
        })
    });
}

function addWord() {
    var randomWord = wordList[Math.floor(Math.random() * wordList.length)];
    var randomX = Math.floor(Math.random() * rowLength);
    if (randomX == 0) {randomX = 1}
    if (randomX + randomWord.length > rowLength) {
        randomX = randomX - randomWord.length;
    }
    var wordObject = {
        'x': randomX,
        'y': 0,
        'word': randomWord,
        'dead': false,
    }
    activeWords.push(wordObject);
}


function willCollide(wordObject) {
    var cellsBelowWord = [];
    var found = false;
    for (var i = wordObject.x; i < wordObject.x + wordObject.word.length; i++) {
        cellsBelowWord.push([i, wordObject.y + 1])
    }
    cellsBelowWord = JSON.stringify(cellsBelowWord)
    activeWords
    .filter(w => w.y == wordObject.y + 1)
    .forEach(activeWord => {
        for (var i = activeWord.x; i < activeWord.x + activeWord.word.length; i++) {
            var coords = JSON.stringify([i, activeWord.y]);
            if (cellsBelowWord.indexOf(coords) != -1) {
                found = true;
            }
        }
    })
    return found;
}

function iterate() {
    for (i = 0; i < activeWords.length; i++) {
        var activeWord = activeWords[i];
        if (activeWord.y == gameHeight || willCollide(activeWord)) {
            activeWord.dead = true
            if (activeWord.y == 1) {
                // trigger game end
                alert('Game ended!');
                activeWords = [];
                clearInterval(gameInterval);
            }
        } else {
            activeWord.y = activeWord.y + 1
        }
    }
    resetBoard()
    activeWords.forEach(activeWord => {
        setWord(activeWord)
    })
}

function start() {
    gameInterval = setInterval(function() {
        tickCount++;
        console.log(tickCount);
        if (tickCount % 2 == 0) {addWord()}
        iterate()
    }, 500)
}