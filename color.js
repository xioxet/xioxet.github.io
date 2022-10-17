function randomColor() {
    var r_c = Math.floor(Math.random()*16777215).toString(16);
    document.documentElement.style.setProperty('--nice-blue', r_c);
}