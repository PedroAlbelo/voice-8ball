const texts = {
    pt: {
        output: "Pergunte algo...",
        button: "Faça sua pergunta",
        perguntaBox: "Sua pergunta aparecerá aqui..."
    },
    en: {
        output: "Ask something...",
        button: "Ask your question",
        perguntaBox: "Your question will appear here..."
    }
};

document.getElementById("languageSelect").addEventListener("change", function() {
    const lang = this.value === "pt-BR" ? "pt" : "en";
    updateTexts(lang);
});

const languageSelect = document.getElementById("languageSelect");
const savedLang = localStorage.getItem("language");
if (savedLang) {
    languageSelect.value = savedLang;
    updateTexts(savedLang === "pt-BR" ? "pt" : "en");
}
languageSelect.addEventListener("change", function() {
    localStorage.setItem("language", this.value);
    updateTexts(this.value === "pt-BR" ? "pt" : "en");
});


function updateTexts(lang) {
    const output = document.getElementById("output");
    const perguntaBox = document.getElementById("perguntaBox");
    const questionButton = document.getElementById("askButton"); 

    output.innerText = texts[lang].output;
    perguntaBox.innerText = texts[lang].perguntaBox;
    questionButton.innerText = texts[lang].button; 
}

function startListening() {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
        alert("Seu navegador não suporta reconhecimento de voz. Tente usar o Google Chrome.");
        return;
    }
    
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    const languageSelect = document.getElementById("languageSelect");
    recognition.lang = languageSelect.value;
    recognition.interimResults = false;
    recognition.continuous = false;
    
    const output = document.getElementById("output");
    const perguntaBox = document.getElementById("perguntaBox");
    output.innerText = languageSelect.value === "pt-BR" ? "Ouvindo..." : "Listening...";
    
    recognition.onresult = function(event) {
        const fala = event.results[0][0].transcript;
        console.log("Pergunta reconhecida:", fala);
        perguntaBox.innerText = fala;
        const resposta = gerarResposta(languageSelect.value); 
        output.innerText = resposta;
        falar(resposta, languageSelect.value); 
    };
    
    recognition.onerror = function(event) {
        console.error("Erro no reconhecimento de voz:", event.error);
        output.innerText = languageSelect.value === "pt-BR" ? "Erro ao ouvir" : "Error listening";
    };
    
    recognition.start();
}

function gerarResposta(lang) {
    const respostasPT = [
        "Sim.", "Não.", "Talvez.", "Provavelmente sim.", "Provavelmente não.",
        "Quem sabe?", "Acho que sim.","Com certeza!"
    ];

    const respostasEN = [
        "Yes.", "No.", "Maybe.", "Probably yes.", "Probably not.",
        "Who knows?", "I think so.", "Definitely!","I can't tell right now."
    ];

    return lang === "pt-BR" ? respostasPT[Math.floor(Math.random() * respostasPT.length)] : respostasEN[Math.floor(Math.random() * respostasEN.length)];
}

function falar(texto, lang) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = lang; 
    synth.speak(utterance);
}

output.classList.remove("show");
setTimeout(() => {
    output.innerText = resposta;
    output.classList.add("show");
}, 100);