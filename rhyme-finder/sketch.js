// Function to fetch the wordlist.txt
async function loadWordList() {
    var response = await fetch('wordlist.txt');
    var text = await response.text();
    return text.split('\n');
}

// Function to load the cmuDict.txt
async function loadCMUDict() {
    var response = await fetch('cmudict.txt');
    var text = await response.text();
    var lines = text.split('\n');
    var cmuDict = {};
    lines.forEach(line => {
        var parts = line.split(' ');
        var word = parts[0].toLowerCase();
        var phonemes = parts.slice(1).join(' ');
        if (word && phonemes) {
            cmuDict[word] = phonemes;
        }
    });

    return cmuDict;
}

//Function to check if the input word is in the wordlist
function checkwordList(word) {
    var wordList = checkWordList(); 
    return wordList.includes(word.toLowerCase());
}

// Function to get the phonetic representation of the input word
function getPhonetics(word, cmuDict) {
    var lowercaseWord = word.toLowerCase();
    for (let dictWord in cmuDict) {
        if (dictWord === lowercaseWord) {
            return cmuDict[dictWord];
        }
    }
    
    return null; 
}

// Function to extract the suffix of the phonetic representation
function getSuffix(phoneticRepresentation) {
    var phonemes = phoneticRepresentation.split(' ');
    var stack = [];
    if (phonemes.length >= 2) {
        stack.push(phonemes[phonemes.length - 2]);
        stack.push(phonemes[phonemes.length - 1]);
        var secondLast = stack.pop();
        var last = stack.pop();
        var suffix = secondLast + ' ' + last;
        return suffix;
    } else {
        return null; 
    }
}

// Function to find words that rhyme with the input word
function findRhymingWords(suffix, cmuDict) {
    var rhymingWords = [];
    for (var word in cmuDict) {
        var phoneticRep = cmuDict[word];
        var wordSuffix = getSuffix(phoneticRep);
        if (wordSuffix === suffix) {
            rhymingWords.push(word);
        }
    }
    return rhymingWords;
}

// Function to get and return the rhyme
function getRhymes(inputWord) {
    return loadWordList().then(wordList => {
        return loadCMUDict().then(cmuDict => {
            var phoneticRep = getPhonetics(inputWord, cmuDict);
            if (!phoneticRep) {
                return []; 
            }
            var suffix = getSuffix(phoneticRep);
            return findRhymingWords(suffix, cmuDict);
        });
    });
}

// Function to find and display rhymes
function findRhymes() {
    var inputWord = document.getElementById('inputWord').value;
    var rhymeBox = document.getElementById('rhymeBox');
    var message = document.getElementById('message');
    rhymeBox.innerHTML = '';

    getRhymes(inputWord).then(rhymes => {
        if (rhymes.length === 0) {
            message.innerHTML = "No rhymes found.";
        } else {
            message.innerHTML = "Rhymes:";
            rhymeBox.innerHTML = rhymes.join(', ');
        }
    });
}

