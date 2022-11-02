fetch("words.json")
  .then((res) => res.json())
  .then((data) => {
    console.log(data['words'])
    var w = data['words']
  });

var game = false;
var game_display = document.getElementById('game');
var wordlist = new Set(w);
var prompts = {};
var suitable_prompts = [];
var cells = document.getElementsByClassName('cell');
var gameinput = document.getElementById('game-input');
var gamesubmit = document.getElementById('game-submit');
var time_delay = 2000;
var solution_limit = 200;

function generate_prompts() {
    for (const word of wordlist) {
        for (var i = 0; i < word.length - 2; i++) {
            var prompt = (word.slice(i, i + 3));
            if (!prompts.hasOwnProperty(prompt)) {
                prompts[prompt] = 0;
            }
            prompts[prompt]++;
            if (prompts[prompt] > solution_limit && !suitable_prompts.includes(prompt)) {
                suitable_prompts.push(prompt)
            }
        }
    }
}

function assign_prompt() {
    var cell = random_cell();
    var prompt = suitable_prompts[Math.floor(Math.random() * suitable_prompts.length)];
    cell.innerHTML = prompt;
    cell.classList.add('active');
}

function random_cell() {
    var inactive_cells = []
    for (const cell of cells) {
        if (!cell.classList.contains('active')) {
            inactive_cells.push(cell);
        }
    }       
    var cell = inactive_cells[Math.floor(Math.random() * inactive_cells.length)];
    return cell;
}

function submit() {
    input = gameinput.value.toLowerCase();
    gameinput.value = "";
    for (const cell of cells) {
        if (cell.classList.contains('active')) {
            if (input.includes(cell.innerHTML)) {
                cell.classList.remove('active');
                console.log(prompts[cell.innerHTML]);
                cell.innerHTML = "";
            }
        }
    }
}

function update_color() {
    input = gameinput.value.toLowerCase();
    for (const cell of cells) {
        if (cell.classList.contains('selected')) {
            cell.classList.remove('selected')
        }
        if (cell.classList.contains('active')) {
            if (input.includes(cell.innerHTML)) {
                cell.classList.add('seleced')
            }
        }

    }
}

gameinput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        gamesubmit.click();
    }
}
)

function make_faster() {
    if (time_delay > 1000) {
        time_delay -= 100;
    }
    clearInterval(game_timer);
    game_timer = window.setInterval(assign_prompt, time_delay);
}

game_display.style.display = "block";
game = true;
while (game) {
    console.log('true');
    generate_prompts();
    var game_timer = window.setInterval(assign_prompt, time_delay);
    window.setInterval(make_faster, 5000);
