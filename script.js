
document.addEventListener('DOMContentLoaded', function() {
    clearInput();
    fetchCSVData();
    updateOptions();
});

function clearInput() {
    let answer = document.getElementById('answer');
    if (answer) {
        answer.value = '';
    }
}

let numbers = [];

function fetchCSVData() {
    // Use the fetch API to get the content of the file
    fetch('./numbers.csv')
        .then(response => response.text())
        .then(csvData => {
            // Parse the CSV data using Papa Parse
            Papa.parse(csvData, {
                complete: function(results) {
                    numbers = results.data;
                    console.log(numbers);
                }
            });
        })
        .catch(error => console.error('Error fetching file:', error));
}

let numeric;
let hiragana;
let kanji;
let min;
let max;

function updateOptions() {
    numeric = document.getElementById('numeric').checked;
    hiragana = document.getElementById('hiragana').checked;
    kanji = document.getElementById('kanji').checked;
    min = parseInt(document.getElementById('min').value);
    max = parseInt(document.getElementById('max').value);
    refreshNumber();
}

function refreshNumber() {
    let number = document.getElementById('number');
    
    if (number) {
        let random = Math.floor(Math.random() * (max - min + 1)) + min;
        number.innerText = random;
    }
}

function checkAnswer(element) {
    let answer = element.value;
}