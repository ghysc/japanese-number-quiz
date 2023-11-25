
let answerElement;
let numberElement;

document.addEventListener('DOMContentLoaded', function() {
    answerElement = document.getElementById('answer');
    numberElement = document.getElementById('number');

    clearInput();
    updateOptions();
    (async() => {
        await fetchCSVData();
        refreshQuestion(true);
    })();
});

function clearInput() {
    answerElement.value = '';
}

let numbers = [];
let exceptions = [];

async function fetchCSVData() {
    // Use the fetch API to get the content of the file
    await fetch('./numbers.csv')
        .then(response => response.text())
        .then(csvData => {
            // Parse the CSV data using Papa Parse
            Papa.parse(csvData, {
                complete: function(results) {
                    numbers = results.data;
                }
            });
        })
        .catch(error => console.error('Error fetching file:', error));

    // Use the fetch API to get the content of the file
    await fetch('./exceptions.csv')
        .then(response => response.text())
        .then(csvData => {
            // Parse the CSV data using Papa Parse
            Papa.parse(csvData, {
                complete: function(results) {
                    exceptions = results.data;
                }
            });
        })
        .catch(error => console.error('Error fetching file:', error));
}

let questions;
let min;
let max;
let spaced;

function updateOptions() {
    // ---- QUESTIONS -----
    questions = document.querySelectorAll('#questions input[type="checkbox"]');
    questions = Array.from(questions).filter(function(checkbox) {
        return checkbox.checked;
      });

    // ------- MISC -------
    min = parseInt(document.getElementById('min').value);
    max = parseInt(document.getElementById('max').value);
    spaced = document.getElementById('spaced').checked ? "\t\t" : "";
}

let randomNumber;

function refreshQuestion(refreshNumber) {
    // number to guess
    if (refreshNumber) {
        randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        console.log("New number to guess ", randomNumber);
    }

    //which type of quetion
    let questionID = Math.floor(Math.random() * questions.length);
    switch(questions[questionID].id) {
        case "numeric":
            numberElement.innerText = randomNumber;
        break;
        case "hiragana":
            numberElement.innerText = buildNumber(randomNumber, 2);
        break;
        case "kanji":
            numberElement.innerText = buildNumber(randomNumber, 3);
        break;
    }
}

// @param writingType is actually the column's number in the CSV (if we want hiragana, kanji...)
function buildNumber(number, writingType) {
    let result = "";

    let currentNumberDetail = [];
    currentNumberDetail.push({key: 10000,   value: Math.floor(number / 10000)});
    currentNumberDetail.push({key: 1000,    value: Math.floor((number % 10000) / 1000)});
    currentNumberDetail.push({key: 100,     value: Math.floor((number % 1000) / 100)});
    currentNumberDetail.push({key: 10,      value: Math.floor((number % 100) / 10)});
    currentNumberDetail.push({key: 1,       value: number % 10});

    for (let i=0; i < currentNumberDetail.length; i++) {
        result += numberConcatenation(i, writingType);
    }

    return result;

    function numberConcatenation(detail, type) {
        let key = currentNumberDetail[detail].key;
        let value = currentNumberDetail[detail].value;

        // if the detailed value is 0, no need to print anything 
        if (value == 0)
            return "";
        // if the detailed value is 1, no need to print いち
        else if (value == 1)
            return retrieveNumberData(key, type) + spaced;
        // else
        else {
            // if the detailed value's unit is == 1, no need to add it afterwards
            if (key == 1)
                return retrieveNumberData(value, type);
            // if the detailed value's unit is > 1, append unit afterwards
            else {
                let exception = retrieveExceptionData(key * value, type);
                // Exception way
                if (exception != null)
                    return exception + spaced;
                // Normal way
                else
                    return retrieveNumberData(value, type) + retrieveNumberData(key, type) + spaced;
            }
        }
    }

    function retrieveNumberData(numberToFind, dataID) {
        if (dataID == 0)
            return numberToFind;

        for (let i = 0; i < numbers.length; i++) {
            if (numbers[i][0] == numberToFind)
                return numbers[i][dataID];
        }

        return null;
    }

    function retrieveExceptionData(numberToFind, dataID) {
        if (dataID == 0)
        return numberToFind;

        for (let i = 0; i < exceptions.length; i++) {
            if (exceptions[i][0] == numberToFind)
                return exceptions[i][dataID];
        }

        return null;
    }
}

function validateAnswer(event) {
    // Check if the key pressed is the "Enter" key
    if (event.keyCode === 13) {
        // Perform actions when "Enter" key is pressed
        console.log(answerElement.value);
        if (answer != randomNumber) {
            answerElement.className = "wrong";
            setTimeout(() => {answerElement.className = "" }, 1000);
        }
    }
}

function checkAnswer() {
    let answer = answerElement.value;
    if (answer == randomNumber) {
        answerElement.className = "valid";
        setTimeout(() => {answerElement.className = "" }, 1000);

        clearInput();
        refreshQuestion(true);
    }
}