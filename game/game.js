var w = "";
var wordlist = new Set();
var qb = document.getElementById('game-button')
var loading = document.getElementById('loading')

function get_words() {
    fetch("https://raw.githubusercontent.com/xioxet/xioxet.github.io/main/game/words.json")
    .then((res) => res.json())
    .then((data) => {
        console.log('done');
        w = data['words'];
        wordlist = new Set(w);
        generate_prompts();
        loading.style.display = "none";
        qb.style.display = "inline-block";
    });
}

get_words();
var game = false;
var game_display = document.getElementById('game');
var game_text = document.getElementById('game-text');
var game_score = document.getElementById('score')
var prompts = {};
var suitable_prompts = [];
var cells = document.getElementsByClassName('cell');
var game_input = document.getElementById('game-input');
var game_submit = document.getElementById('game-submit');
var game_board = document.getElementById('cell-board');
var ending = document.getElementById('ending');
var time_delay = 2000;
var solution_limit = 450;
var count = 0;
var input_length = 0;
var score = 0;
var speed_up;

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

function game_over() {
    var inactive_cells = get_inactive_cells();
    if (inactive_cells.length == 0) {
        ending.style.display = "block";
        clearInterval(game_timer);
        clearInterval(speed_up);
        document.documentElement.style.setProperty('--nice-blue', '#BB0000');
        ending.style.display = "block";
        ending.innerHTML = `game over! your final score was ${score}. click above to play again.`
        game = false;
    }
}

function set_cells(color) {
    for (const cell of cells) {
        cell.style.backgroundColor = color;
    }
}

function assign_prompt() {
    var cell = random_cell();
    if (cell == 0) {
        setTimeout(game_over, 100)
    }
    var prompt = suitable_prompts[Math.floor(Math.random() * suitable_prompts.length)];
    cell.innerHTML = prompt;
    cell.classList.add('active');
}

function get_inactive_cells() {
    var inactive_cells = []
    for (const cell of cells) {
        if (!cell.classList.contains('active')) {
            inactive_cells.push(cell);
        }
    }
    return inactive_cells
}

function random_cell() {
    var inactive_cells = get_inactive_cells()
    if (inactive_cells.length == 0) {
        return 0;
    } else {
    var cell = inactive_cells[Math.floor(Math.random() * inactive_cells.length)];
    return cell;
    }
}

function submit() {
    input = game_input.value.toLowerCase();
    if (wordlist.has(input)) {
        score += c * input_length;
        game_score.innerHTML = `score: ${score}`
        game_input.value = "";
        for (const cell of cells) {
            if (cell.classList.contains('active')) {
                if (input.includes(cell.innerHTML)) {
                    cell.classList.remove('active');
                    console.log(prompts[cell.innerHTML]);
                    cell.innerHTML = "";
                }
            }
        }
    } else {
        game_text.innerHTML = 'invalid word!';
    }
}

function update_on_press() {
    c = 0;
    input = game_input.value.toLowerCase();
    input_length = input.length;
    for (const cell of cells) {
        if (cell.classList.contains('selected')) {
            cell.classList.remove('selected');
        }
        if (cell.classList.contains('active')) {
            if (input.includes(cell.innerHTML)) {
                cell.classList.add('selected');
                c++;
            }
        }
    }
    game_text.innerHTML = `${c} * ${input_length} = ${c * input_length}`
}

game_input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        game_submit.click();
    }
}
)

function make_faster() {
    if (time_delay > 500) {
        time_delay -= 100;
    }
    clearInterval(game_timer);
    game_timer = window.setInterval(assign_prompt, time_delay);
}

function set_game() {
    if (!game) {
        ending.style.display = "none";
        document.documentElement.style.setProperty('--nice-blue', 'rgb(63, 107, 166)');
        score = 0;
        time_delay = 2000;
        game_display.style.display = "block";
        game_score.innerHTML = `score: ${score}`
        game = true;    
        game_timer = window.setInterval(assign_prompt, time_delay);
        speed_up = window.setInterval(make_faster, 2000);
        for (const cell of cells) {
            cell.innerHTML = "";
            if (cell.classList.contains('active')) {
                cell.classList.remove('active')
                console.log('yes')
            }
        }
        assign_prompt()
        assign_prompt()
    }
}
