
const min = 0;
const max = 100000;
let numbers = [];

document.addEventListener('DOMContentLoaded', function() {
    clearInput();
    buildNumberQuizData();
    displayNumber();
});

function clearInput() {
    let answer = document.getElementById('answer');
    if (answer) {
        answer.value = '';
    }
}

function buildNumberQuizData() {
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