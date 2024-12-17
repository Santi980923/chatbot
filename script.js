import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = 'AIzaSyAoKjmGDzzui5XQjmQ7_A7To4LKNk7sN8U';
const genAI = new GoogleGenerativeAI(API_KEY);

const chatContainer = document.getElementById('chatContainer');
const inputContainer = document.querySelector('.input-container');
let isFirstMessage = true;

// Rol
const rolePrompt = "Eres un experto en política colombiana, especializado en la ciudad de Tunja y el departamento de Boyacá. Tu conocimiento abarca los actores políticos más importantes, las dinámicas regionales, los problemas sociales, económicos y culturales más relevantes, así como el impacto de las políticas públicas en la región. Analizas temas políticos con un enfoque crítico, preciso y contextualizado, explicando de manera clara y accesible los retos y oportunidades que enfrenta Boyacá en el panorama político actual.";

document.getElementById('generateButton').addEventListener('click', async () => {
    const inputText = document.getElementById('inputText').value;
    if (!inputText.trim()) return;

    if (isFirstMessage) {
        chatContainer.classList.add('visible');
        inputContainer.classList.add('moved');
        isFirstMessage = false;
    }

    addMessage(inputText, 'user-message');

    const generateButton = document.getElementById('generateButton');
    generateButton.disabled = true;

    document.getElementById('inputText').value = '';

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

        // Concatenamos el prompt de rol con la entrada del usuario
        const fullPrompt = `${rolePrompt}\n\nUsuario: ${inputText}\nAbogado:`;

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const responseText = await response.text();

        addMessage('', 'ai-message', responseText, true);

    } catch (error) {
        console.error('Error al generar contenido:', error);
        addMessage('Hubo un error al generar la respuesta.', 'ai-message');
    } finally {
        generateButton.disabled = false;
    }
});


function addMessage(text, className, fullText = '', isTyping = false) {
    const chatContainer = document.getElementById('chatContainer');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${className}`;
    messageElement.innerText = text;
    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    if (isTyping && fullText) {
        typeWriterEffect(fullText, messageElement);
    }
}

function typeWriterEffect(text, element, speed = 2) {
    let index = 0;

    function typeChar() {
        if (index < text.length) {
            element.innerText += text.charAt(index);
            index++;
            setTimeout(typeChar, speed);
        }
    }

    typeChar();
}

const inputText = document.getElementById('inputText');
inputText.addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
});

inputText.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        document.getElementById('generateButton').click();
    }
});
