
const ANIM_NAME_VALID = "valid";
const ANIM_NAME_WRONG = "wrong";

// HTML elements
let questionsElement;
let minElement;
let maxElement;
let difficultyLabelElement;
let spacedLabelElement;
let numberElement;
let answerElement;
// logics - options
let min;
let max;
let difficulty = 0;
let spaced;
// logics - inner
let numbers = [];
let exceptions = [];
let randomNumber;
let questionID = 0;
// feedbacks
let firstHalf;
let secondHalf;
let plain;

// les kanjis sont utilisés dans des livres dont l'écriture est verticale (à partir de 100, car en dessous ça peut tenir en une 'case')

document.addEventListener('DOMContentLoaded', function() {
    minElement = document.getElementById('min');
    maxElement = document.getElementById('max');
    difficultyLabelElement = document.getElementById('difficulty').nextElementSibling;
    spacedLabelElement = document.getElementById('spaced').nextElementSibling;
    numberElement = document.getElementById('number');
    answerElement = document.getElementById('answer');

    firstHalf = document.getElementById('firstHalf');
    secondHalf = document.getElementById('secondHalf');
    plain = document.getElementById('plain');

    clearInput();
    updateOptions();
    (async() => {
        await fetchCSVData();
        refreshQuestion(true, false);
    })();
});

function clearInput() {
    answerElement.value = '';
}

async function fetchCSVData() {
    // Use the fetch API to get the content of the file
    await fetch('./csv/numbers.csv')
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
    await fetch('./csv/exceptions.csv')
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

function updateOptions() {
    // ---- QUESTIONS -----
    questionsElement = document.querySelectorAll('#questions input[type="checkbox"]');
    questionsElement = Array.from(questionsElement).filter(function(checkbox) {
        return checkbox.checked;
      });

    // ------- MISC -------
    min = parseInt(minElement.value);
    max = parseInt(maxElement.value);
    spaced = document.getElementById('spaced').checked ? "\t" : "";
}

function changeDifficulty(button) {
    difficulty = (difficulty + 1) % 3;
    switch (difficulty) {
        case 0:
            button.value = "No timer";
            button.style.backgroundColor = "var(--color-1)";
            break;
        case 1:
            button.value = "Easy timer";
            button.style.backgroundColor = "limegreen";
            break;
        case 2:
            button.value = "Hard timer";
            button.style.backgroundColor = "crimson";
            break;
    }
}

function changeSpaced(checkbox) {
    if(checkbox.checked) {
        spacedLabelElement.value = "S p a c e d";
    } else {
        spacedLabelElement.value = "Spaced";
    }
}

function refreshQuestion(refreshNumber, refreshType) {
    // number to guess
    if (refreshNumber) {
        randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        console.log("New number to guess ", randomNumber);
    }

    if (refreshType) {
        questionID = Math.floor(Math.random() * questionsElement.length);
    }

    //which type of quetion
    switch(questionsElement[questionID].id) {
        case "numeric":
            let randomNumberSpaced = randomNumber.toString();
            if (spaced != "")
                randomNumberSpaced = randomNumberSpaced.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            numberElement.innerText = randomNumberSpaced;
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
    // Perform actions when "Enter" key is pressed
    if (event.keyCode === 13) {
        if (answerElement.value != randomNumber) {
            plain.style.webkitAnimation = 'none';
            plain.classList.add(ANIM_NAME_WRONG);
            setTimeout(function() {
                plain.style.webkitAnimation = '';
            }, 10);
            
            clearInput();
        } else {
            firstHalf.style.webkitAnimation = 'none';
            firstHalf.classList.add(ANIM_NAME_VALID);
            setTimeout(function() {
                firstHalf.style.webkitAnimation = '';
            }, 10);
            secondHalf.style.webkitAnimation = 'none';
            secondHalf.classList.add(ANIM_NAME_VALID);
            setTimeout(function() {
                secondHalf.style.webkitAnimation = '';
            }, 10);
    
            clearInput();
            refreshQuestion(true, true);
        }
    }
}

function checkAnswer() {
    if (answerElement.value == randomNumber) {
        firstHalf.style.webkitAnimation = 'none';
        firstHalf.classList.add(ANIM_NAME_VALID);
        setTimeout(function() {
            firstHalf.style.webkitAnimation = '';
        }, 10);
        secondHalf.style.webkitAnimation = 'none';
        secondHalf.classList.add(ANIM_NAME_VALID);
        setTimeout(function() {
            secondHalf.style.webkitAnimation = '';
        }, 10);

        clearInput();
        refreshQuestion(true, true);
    }
}