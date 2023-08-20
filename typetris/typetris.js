// doc elements

var gameContainer;
var rowLength;
var gameHeight;
var loadingInfo;
var gameInput; 
var rowDivs;


// game variables 
var activeWords = [];
var tickCount = 0;
var gameInterval;
var gameTable = [];
var wordList = [];
var tickInterval = 500;

function processWords(array) {
    return array
            .filter(str => 7 > str.length && str.length >= 4)
            .map(str => str.toUpperCase())
            .filter(str => /^[A-Z*$]/.test(str))
}

async function loadEnglishText() {
    try {
      const response = await fetch('english.json');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const fileContent = await response.json();
      console.log(fileContent, typeof(fileContent))
      return processWords(fileContent);
    } catch (error) {
      console.error('Error loading English text:', error);
      return null;
    }
}

window.onload = function () {
    (async () => {
    const englishText = await loadEnglishText();
    if (englishText) {
        wordList = englishText;
        console.log(wordList);

        // load all elements 

        loadingInfo = document.getElementById('loadingInfo');
        gameContainer = document.getElementById('game');
        rowLength = document.getElementsByClassName('row')[0].innerHTML.length;
        gameHeight = document.getElementsByClassName('row').length;
        rowDivs = document.querySelectorAll('.row');
        gameInput = document.getElementById('gameInput')

        rowDivs.forEach(rowDiv => {
            gameTable.push(rowDiv.children);
            const rowText = rowDiv.textContent;
            const newRowContent = rowText
                .split('')
                .map(char => `<span>${char}</span>`)
                .join('');
            rowDiv.innerHTML = newRowContent;
        });

        gameInput.addEventListener('keypress', function(event) {
            if (event.key === "Enter") {
                event.preventDefault();
                submit(gameInput.value);
            }
        })

        loadingInfo.innerText = "finished loading!";
    }
    })();
}

function getCoordinates(x, y) {  
    x--;
    y--;
    if ((0 < y < gameTable.length) && (x < gameTable[0].length)) {
        return gameTable[y][x]
    }
    return null;
}

function setWord(wordObject) {
    for (var i = wordObject.x; i < wordObject.x + wordObject.word.length; i++) {
        var spanTag = getCoordinates(i, wordObject.y)
        var letter = wordObject.word[i - wordObject.x]
        spanTag.innerText = letter;
        if (wordObject.dead) 
            {spanTag.classList.add('red');}
        else 
            {spanTag.classList.add('black')}
        
    }
}

function getCellsCoveredByWord(word) {
    var cellsList = []
    for (var i = word.x; i < word.x + word.word.length; i++) {
        cellsList.push([i, word.y])
    }
    return cellsList
}

function resetWord(word) {
    for (const coords of getCellsCoveredByWord(word)) {
        var [x, y] = coords;
        if (y > 0) {
            var spanTag = getCoordinates(x, y);
            spanTag.innerText = ".";
            spanTag.classList = "";
        }
    }
}
function resetBoard() {
    for (const word of activeWords) {
        resetWord(word);
    }
}

function addWord() {
    var randomWord = wordList[Math.floor(Math.random() * wordList.length)];
    var randomX = Math.floor(Math.random() * rowLength);
    if (randomX + randomWord.length > rowLength) {
        randomX = randomX - randomWord.length;
    }
    if (randomX < 1) {randomX = 1}
    var wordObject = {
        'x': randomX,
        'y': 0,
        'word': randomWord,
        'dead': false,
    }
    activeWords.push(wordObject);
}


function willCollide(wordA) {
    var wordAStart = wordA.x;
    var wordAEnd = wordA.x + wordA.word.length - 1;
    for (const wordB of activeWords.filter(w => w.y == wordA.y + 1)){
        var wordBStart = wordB.x;
        var wordBEnd = wordB.x + wordB.word.length - 1;
        console.log(wordA.word, wordB.word, wordAStart, wordAEnd, wordBStart, wordBEnd);
        if (((wordAStart <= wordBStart) && (wordBStart <= wordAEnd)) || 
            ((wordBStart <= wordAStart) && (wordAStart <= wordBEnd))) {
            return true;
        }
    }
    return false;
}

function iterate() {

    resetBoard() 

    for (var i = 0; i < activeWords.length; i++) {
        var activeWord = activeWords[i];
        if (activeWord.y == gameHeight || willCollide(activeWord)) {
            activeWord.dead = true
            if (activeWord.y == 1) {
                // trigger game end
                activeWords = [];
                clearInterval(gameInterval);
                // animation
                gameTable.forEach(function (row) {
                    for (const cell of row) {
                        cell.innerText = "X";
                        cell.classList.add('red');
                    }
                })
            }
        } else {
            activeWord.y = activeWord.y + 1
        }
    }
    activeWords.forEach(activeWord => {
        setWord(activeWord)
    })
}


function start() {
    // reset everything
    activeWords = [];
    for (const row of gameTable) {
        for (const cell of row) {
            cell.classList = "";
            cell.innerText = ".";
        }
    }
    //
    gameInterval = setInterval(function() {
        tickCount++;
        if (tickCount % 2 == 0) {addWord()}
        iterate()
    }, tickInterval)
}

function stop() {
    clearInterval(gameInterval);
}

function submit(wordInput) {
    wordInput = wordInput.toUpperCase();
    for (var i = 0; i < activeWords.length; i++) {
        var activeWord = activeWords[i]
        console.log(activeWord)
        if (activeWord.word == wordInput && !activeWord.dead) {
            activeWords.splice(i, 1)
            resetWord(activeWord)
        }
    }
    gameInput.value = "";
}