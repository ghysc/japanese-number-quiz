
const min = 0;
const max = 100000;

document.addEventListener('DOMContentLoaded', function() {
    displayNumber();
    clearInput();
});

function clearInput() {
    let answer = document.getElementById('answer');
    if (answer) {
        answer.value = '';
    }
}

function displayNumber() {
    let number = document.getElementById('number');
    
    if (number) {
        let random = Math.floor(Math.random() * (max - min + 1)) + min;
        number.innerText = random;
    }
}

function checkAnswer(element) {
    let answer = element.value;
}