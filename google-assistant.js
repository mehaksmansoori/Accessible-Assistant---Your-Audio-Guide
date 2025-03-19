// assistant.js - Main functionality for Google-like voice assistant
// Add this before your other code
async function requestMicrophonePermission() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Microphone permission granted");
      // Stop tracks after permission granted
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (err) {
      console.error("Microphone permission denied:", err);
      assistantResponseDisplay.textContent = "Microphone access denied. Please allow access in your browser settings.";
      return false;
    }
  }
  
  // Call this when the page loads
  requestMicrophonePermission();
// Initialize SpeechRecognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

// Initialize SpeechSynthesis
const synth = window.speechSynthesis;

// DOM elements
const micButton = document.getElementById('mic-button');
const responseContainer = document.getElementById('response-container');
const userCommandDisplay = document.getElementById('user-command'); 
const assistantResponseDisplay = document.getElementById('assistant-response');

// State tracking
let isListening = false;

// Event listeners
micButton.addEventListener('click', toggleListening);

// Function to toggle listening state
function toggleListening() {
    if (isListening) {
        stopListening();
    } else {
        startListening();
    }
}

// Function to start listening
function startListening() {
    recognition.start();
    isListening = true;
    micButton.classList.add('listening');
    showResponseContainer();
    assistantResponseDisplay.textContent = 'Listening...';
    userCommandDisplay.textContent = '';
}

// Function to stop listening
function stopListening() {
    recognition.stop();
    isListening = false;
    micButton.classList.remove('listening');
}

// Function to show response container
function showResponseContainer() {
    responseContainer.style.display = 'block';
}

// Function to hide response container after delay
function hideResponseContainerWithDelay(delay = 5000) {
    setTimeout(() => {
        responseContainer.style.display = 'none';
    }, delay);
}

// Recognition result handling
recognition.onresult = (event) => {
    const command = event.results[0][0].transcript.toLowerCase().trim();
    userCommandDisplay.textContent = `You said: "${command}"`;
    
    // Process command through feature handlers
    processCommand(command);
};

// Process command by finding appropriate handler
function processCommand(command) {
    // Check if command matches any known patterns
    let handlerFound = false;
    
    // Search commands
    if (command.includes('search for') || command.includes('find')) {
        const query = command.replace(/search for|find/gi, '').trim();
        featureHandlers.search(query);
        handlerFound = true;
    } 
    // Navigation commands
    else if (command.includes('go to') || command.includes('navigate to')) {
        const destination = command.replace(/go to|navigate to/gi, '').trim();
        featureHandlers.navigate(destination);
        handlerFound = true;
    }
    // Media control commands
    else if (command.includes('play') || command.includes('pause') || command.includes('volume')) {
        featureHandlers.mediaControl(command);
        handlerFound = true;
    }
    // Information commands
    else if (command.includes('tell me about') || command.includes('help') || command.includes('information')) {
        const topic = command.replace(/tell me about|help|information/gi, '').trim();
        featureHandlers.getInformation(topic);
        handlerFound = true;
    }
    
    // If no handler found
    if (!handlerFound) {
        respondToUser("I'm sorry, I didn't understand. Please try again with a different command.");
    }
    
    // Reset listening state
    stopListening();
}

// Function to respond to user both visually and with speech
function respondToUser(message) {
    // Display message
    assistantResponseDisplay.textContent = message;
    
    // Speak message
    speakMessage(message);
    
    // Hide response after delay
    hideResponseContainerWithDelay(8000);
}

// Function to speak message using speech synthesis
function speakMessage(message) {
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = 'en-US';
    utterance.volume = 1;
    utterance.rate = 1;
    utterance.pitch = 1;
    
    synth.speak(utterance);
}

// Error handling
recognition.onerror = (event) => {
    assistantResponseDisplay.textContent = `Error occurred: ${event.error}`;
    stopListening();
    hideResponseContainerWithDelay();
};

// End of recognition session
recognition.onend = () => {
    if (isListening) {
        stopListening();
    }
};

// Export respond function for use by feature handlers
window.respondToUser = respondToUser;