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
var initial_delay_slider = document.getElementById('initial-delay')
var initial_delay = initial_delay_slider.value;
var speedup_delay_slider = document.getElementById('speedup-delay')
var speedup_delay = speedup_delay_slider.value;
var solution_limit = 450;
var count = 0;
var input_length = 0;
var score = 0;
var speed_up;
var options = document.getElementById('options');
var word_history = [];
var history_element = document.getElementById('word-history');

function slider_update(id_label, id_slider) {
    var label = document.getElementById(id_label);
    label.innerHTML = `${id_label} = ${document.getElementById(id_slider).value}`
}

function toggle_options() {
    if (options.style.display == "none") {
        options.style.display = "block"
    } else {
        options.style.display = "none"
    }
}

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
        history_element.innerHTML = ""
        for (const word in word_history) {
            var li = document.createElement("li");
            li.innerHTML = `${word_history[word][0]} for ${word_history[word][1]} points`;
            history_element.append(li);
        }
        ending.style.display = "block";
        history_element.style.display = "block";
        clearInterval(game_timer);
        clearInterval(speed_up);
        document.documentElement.style.setProperty('--nice-blue', '#BB0000');
        ending.style.display = "block";
        ending.innerHTML = `game over! your final score was ${score}. click above to play again.`
        game = false;
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
    c = 0;
    if (game) {
        if (wordlist.has(input)) {
            game_score.innerHTML = `score: ${score}`
            for (const cell of cells) {
                if (input.includes(cell.innerHTML)) {
                    cell.classList.remove('active');
                    console.log(prompts[cell.innerHTML]);
                    cell.innerHTML = "";
                    c++;
                }
            }
            score += c * input.length;
            word_history.push([input, c * input.length]);
            game_input.value = "";
        } else {
            game_text.innerHTML = 'invalid word!';
            game_input.style.color = "red";
        }
    }
}

function update_on_press() {
    c = 0;
    game_input.style.color = "var(--nice-blue)"
    input = game_input.value.toLowerCase();
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
    game_text.innerHTML = `${c} * ${input.length} = ${c * input.length}`
}

game_input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        game_submit.click();
    }
}
)

function make_faster() {
    if (initial_delay > 500) {
        initial_delay -= 100;
    }
    clearInterval(game_timer);
    game_timer = window.setInterval(assign_prompt, initial_delay);
    assign_prompt();
    console.log(initial_delay)
}

function set_game() {
    if (!game) {
        ending.style.display = "none";
        history_element.style.display = "none";
        document.documentElement.style.setProperty('--nice-blue', 'rgb(63, 107, 166)');
        score = 0;
        game_input.value = "";
        initial_delay = initial_delay_slider.value;
        game_display.style.display = "block";
        game_score.innerHTML = `score: ${score}`
        game = true;
        word_history = [];
        window.location.href = "#input";
        game_timer = window.setInterval(assign_prompt, initial_delay);
        speed_up = window.setInterval(make_faster, speedup_delay);
        for (const cell of cells) {
            cell.innerHTML = "";
            if (cell.classList.contains('active')) {
                cell.classList.remove('active')
            } 
            if (cell.classList.contains('selected')) {
                cell.classList.remove('selected')
            }
        }
        assign_prompt()
        assign_prompt()
    }
}
