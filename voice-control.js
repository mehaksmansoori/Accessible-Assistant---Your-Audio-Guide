// Initialize speech recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.interimResults = false;

// Text-to-speech setup
const speechSynthesis = window.speechSynthesis;
let isListening = false;
let currentUtterance = null;

// DOM Elements
const feedbackArea = document.getElementById('feedback');
const startButton = document.getElementById('start-voice');
const stopButton = document.getElementById('stop-voice');

// Voice command handler
recognition.onresult = (event) => {
    const command = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
    processCommand(command);
};

// Process voice commands
function processCommand(command) {
    feedbackArea.textContent = `Command received: "${command}"`;
    
    // Navigation commands
    if (command.includes('navigate to home') || command.includes('go to home')) {
        window.location.href = '#main';
        speak('Navigating to home section');
    } 
    else if (command.includes('navigate to features') || command.includes('go to features')) {
        document.getElementById('features').scrollIntoView();
        speak('Navigating to features section');
    }
    else if (command.includes('navigate to guide') || command.includes('go to guide')) {
        document.getElementById('guide').scrollIntoView();
        speak('Navigating to guide section');
    }
    else if (command.includes('navigate to contact') || command.includes('go to contact')) {
        document.getElementById('contact').scrollIntoView();
        speak('Navigating to contact section');
    }
    
    // Feature commands
    else if (command.includes('open camera')) {
        openCameraFeature();
    }
    else if (command.includes('open document reader')) {
        openDocumentReader();
    }
    else if (command.includes('open navigation')) {
        openSmartNavigation();
    }
    else if (command.includes('open web reader')) {
        openWebAccessibility();
    }
    
    // Reading commands
    else if (command.includes('read page')) {
        const mainContent = document.getElementById('main').textContent;
        speak(mainContent);
    }
    else if (command.includes('stop reading')) {
        stopSpeaking();
        speak('Reading stopped');
    }
    
    // Help command
    else if (command.includes('help')) {
        const helpText = document.querySelector('.command-list').textContent;
        speak(helpText);
    }
    
    // Text size commands
    else if (command.includes('increase text size') || command.includes('larger text')) {
        const currentSize = parseInt(window.getComputedStyle(document.body).fontSize);
        document.body.style.fontSize = (currentSize + 2) + 'px';
        speak('Text size increased');
    }
    else if (command.includes('decrease text size') || command.includes('smaller text')) {
        const currentSize = parseInt(window.getComputedStyle(document.body).fontSize);
        document.body.style.fontSize = (currentSize - 2) + 'px';
        speak('Text size decreased');
    }
    
    // Contrast command
    else if (command.includes('high contrast') || command.includes('toggle contrast')) {
        document.body.classList.toggle('high-contrast-mode');
        speak('High contrast mode toggled');
    }
    
    // Support commands
    else if (command.includes('call support')) {
        speak('Initiating support call. Please wait while we connect you.');
        setTimeout(() => speak('This is a simulation. In a real implementation, this would connect to a support line.'), 2000);
    }
    else if (command.includes('send email')) {
        speak('Opening email form. You can dictate your message after the beep.');
        setTimeout(() => speak('This is a simulation. In a real implementation, this would open an email composition form.'), 2000);
    }
    
    // Close features
    else if (command.includes('close camera')) {
        closeCameraFeature();
    }
    else if (command.includes('close document reader')) {
        closeDocumentReader();
    }
    else if (command.includes('close navigation')) {
        closeSmartNavigation();
    }
    else if (command.includes('close web reader')) {
        closeWebAccessibility();
    }
    // Google Assistant specific commands handled in google-assistant.js
    else if (command.includes('explain this page') || 
             command.includes('what can i do here') || 
             command.includes('explain screen')) {
        if (typeof explainCurrentScreen === 'function') {
            explainCurrentScreen();
        }
    }
    else if (command.includes('explain camera feature') || command.includes('how does camera work')) {
        if (typeof explainFeature === 'function') {
            explainFeature('camera');
        }
    }
    else if (command.includes('explain document reader') || command.includes('how does document reader work')) {
        if (typeof explainFeature === 'function') {
            explainFeature('document');
        }
    }
    else if (command.includes('explain navigation') || command.includes('how does navigation work')) {
        if (typeof explainFeature === 'function') {
            explainFeature('navigation');
        }
    }
    else if (command.includes('explain web reader') || command.includes('how does web reader work')) {
        if (typeof explainFeature === 'function') {
            explainFeature('web');
        }
    }
    else {
        // If we have Google Assistant integrated, try routing through it
        if (window.googleAssistant && typeof handleAssistantCommand === 'function') {
            const handled = handleAssistantCommand(command);
            if (!handled) {
                speak('Command not recognized. Say "help" for a list of available commands.');
            }
        } else {
            speak('Command not recognized. Say "help" for a list of available commands.');
        }
    }
}

// Text-to-speech function
function speak(text) {
    stopSpeaking();
    currentUtterance = new SpeechSynthesisUtterance(text);
    
    // If we have the Google Assistant indicator, show speaking state
    const indicator = document.getElementById('google-assistant-indicator');
    if (indicator) {
        indicator.classList.add('assistant-speaking');
        currentUtterance.onend = () => {
            indicator.classList.remove('assistant-speaking');
        };
    }
    
    speechSynthesis.speak(currentUtterance);
}

function stopSpeaking() {
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
        
        // Reset indicator if it exists
        const indicator = document.getElementById('google-assistant-indicator');
        if (indicator) {
            indicator.classList.remove('assistant-speaking');
        }
    }
}

// Button event listeners for voice control
startButton.addEventListener('click', () => {
    try {
        recognition.start();
        isListening = true;
        feedbackArea.textContent = 'Voice control activated. Try saying "Help" for available commands.';
        speak('Voice control activated. Say "Help" for available commands.');
    } catch (error) {
        console.error('Error starting recognition:', error);
        feedbackArea.textContent = 'Could not start voice recognition. Please try again.';
    }
});

stopButton.addEventListener('click', () => {
    recognition.stop();
    isListening = false;
    feedbackArea.textContent = 'Voice control deactivated.';
    speak('Voice control deactivated.');
});

// Error handling for speech recognition
recognition.onerror = (event) => {
    console.error('Speech recognition error', event.error);
    feedbackArea.textContent = `Error: ${event.error}. Please try again.`;
};

// Automatically start voice control after page load (optional)
window.addEventListener('load', () => {
    // Uncomment the line below to auto-start voice control
    // startButton.click();
    
    // Initial welcome message
    speak('Welcome to the Accessible Assistant. Press the Start Voice Control button or tab to it and press Enter to begin using voice commands.');
});

// Make functions available globally
window.speak = speak;
window.stopSpeaking = stopSpeaking;
window.processCommand = processCommand;