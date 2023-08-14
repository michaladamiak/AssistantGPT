// here put your OpenAI API key
const API_KEY = '';

const submitButton = document.querySelector('#submit');
const outPutElement = document.querySelector('#output');
const inputElement = document.querySelector('input')
const historyElement = document.querySelector('.history')
const start = document.querySelector('#start')
const landingPage = document.querySelector('.landing')
const mainPage = document.querySelector('.main')
const przycisk = document.querySelector('#but')

// chatGPT API
async function getMessage() {
    console.log('clicked')
    const options = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: inputElement.value}],
            max_tokens: 150
        })
    }
    try {
        outPutElement.textContent = "";
        const response = await fetch('https://api.openai.com/v1/chat/completions', options)
        const data = await response.json()
        console.log(data)
        // outPutElement.textContent = data.choices[0].message.content
        // let i = 0;
        // let text = data.choices[0].message.content;
        // typeWriter()
        new TypeIt(outPutElement, {
            strings: data.choices[0].message.content,
            speed: 40,
            waitUntilVisible: true,
          }).go();
        if (data.choices[0].message.content) {
            const pElement = document.createElement('p')
            pElement.textContent = inputElement.value
            pElement.addEventListener('click', () => changeInput(pElement.textContent))
            historyElement.append(pElement)
            clearInput()
            const toSpeak = new SpeechSynthesisUtterance(data.choices[0].message.content)
            // setTimeout(tts.speak(toSpeak), 1);
            tts.speak(toSpeak);
        }
    }
    catch (error) {
        console.error(error)
    }
}

function clearInput () {
    inputElement.value = '';
}

function changeInput (value) {
    inputElement.value = value;
}

submitButton.addEventListener('click', () => {
    if (inputElement.value != '') {
        getMessage();
    }
})

inputElement.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && inputElement.value != '') {
      getMessage();
    }
  });


// speechRecognition

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new window.SpeechRecognition();
recognition.interimResults = true;

recognition.addEventListener('result', (e) => {
    const text = Array.from(e.results).map(result => result[0]).map(result => result.transcript).join('');
    inputElement.value = text;
})

start.addEventListener('click', () => {
    mainPage.style.display = 'flex';
    landingPage.style.display = 'none';
    recognition.start();
})

recognition.addEventListener('end', () => {
    getMessage()
    setTimeout(recognition.start(), 1000)
})


// text to speech

const tts = window.speechSynthesis;
voices = tts.getVoices();
tts.lang = 'pl-PL';
tts.rate = 0.8;
tts.voice = voices[1];
tekscior = "cześć, jestem nowym głosem"

submitButton.addEventListener('click', () => {
    tts.speak(tekscior)
})

// typing animation

let i = 0;
let text = "";
const speed = 50;

function typeWriter() {
    console.log(text)
    console.log('dsadsa')
    if (i < text.length) {
        outPutElement.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
  }
}