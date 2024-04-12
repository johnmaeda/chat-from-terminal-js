import blessed from 'blessed';
import axios from 'axios';
import clipboardy from 'clipboardy';

// Create a screen object.
const screen = blessed.screen({
    smartCSR: true,
    title: 'Chat Application',
});

var apiKey = '';

// Create a chatBox to display messages.
const chatBox = blessed.box({
    top: 0,
    left: 0,
    width: '100%',
    height: '90%',
    content: '',
    tags: true,
    scrollable: true,
    alwaysScroll: true,
    scrollbar: {
        ch: ' ',
        inverse: true,
    },
    mouse: true, // Enable mouse support
});

// Create an input box for user input at the bottom of the screen.
const inputBox = blessed.textbox({
    bottom: 0,
    height: '10%',
    left: 0,
    width: '100%',
    inputOnFocus: true,
    style: {
        fg: 'white',
        bg: '#0080ff',
        focus: {
            bg: '#303030',
            fg: '#00ffff'
        },  
    },
    
});

// Debug box for logging debug messages.
const debugBox = blessed.box({
    top: 0,
    left: '33%',
    width: '67%',
    height: '100%',
    content: 'Debug Console (Toggle by pressing "d")\n---',
    scrollable: true,
    alwaysScroll: true,
    mouse: true,
    scrollbar: {
        ch: '@',
        inverse: true,
    },
    tags: true,
    border: {
      type: 'line'
    },
    style: {
      border: {
        fg: 'yellow'
      }
    }
  });
  
// Function to add debug messages
function addDebugMessage(message) {
    debugBox.insertBottom(message);
    debugBox.setScrollPerc(100);
    screen.render();
  }

// Append elements to the screen.
screen.append(chatBox);
screen.append(inputBox);
screen.append(debugBox);
// Initially focus the chatBox
chatBox.focus();

// Setup key bindings for scrolling
chatBox.key(['up'], () => {
    chatBox.scroll(-1);
    screen.render();
});
chatBox.key(['down'], () => {
    chatBox.scroll(1);
    screen.render();
});

screen.key('i', () => {
    if (debugBox.visible) {
        debugBox.hide();
    }
    screen.render();
    inputBox.focus();
});

screen.key('k', () => {
    formBox.toggle();
    if (screen.children.includes(formBox)) {
        formBox.focus();
    }   
    screen.render();
});

screen.key('d', () => {
    debugBox.toggle();
    if (screen.children.includes(debugBox)) {
        debugBox.focus();
    }
    screen.render();
});

// Function to send messages and handle response
async function sendMessage(message) {
    updateChatBox(`{gray-fg}{bold}You:{/bold} ${message}{/gray-fg}`);
    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: message }]
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`, // Replace YOUR_API_KEY with your actual API key
                'Content-Type': 'application/json'
            }
        });

        const reply = response.data.choices[0].message.content.trim();
        updateChatBox(`{cyan-fg}{bold}AI:{/bold}{/cyan-fg} ${reply}`);
    } catch (error) {
        console.error('Error communicating with OpenAI:', error);
        updateChatBox('Error: Could not fetch response.');
    }
}

// Setup the input box to handle user input
inputBox.on('submit', (text) => {
    sendMessage(text);
    inputBox.clearValue();  // Clear input after submitting
    chatBox.focus();  // Refocus the chatBox after submit
    chatBox.setScrollPerc(100); // Ensure the scroll bar is at the bottom
    screen.render();
});

// Update chat box and scroll to the bottom
function updateChatBox(text) {
    chatBox.setContent(`${chatBox.getContent()}${text}\n`);
    chatBox.setScrollPerc(100); // Ensure the scroll bar is at the bottom
    screen.render();
}

// Quit on 'escape', 'q', or 'Control-C'.
screen.key(['escape', 'q', 'C-c'], () => process.exit(0));

addDebugMessage('{yellow-fg}Press "i" to insert new chat message{/yellow-fg}');
addDebugMessage('{yellow-fg}Press "d" to toggle this debug console{/yellow-fg}');
addDebugMessage('{yellow-fg}Press "c" to copy chat to clipboard{/yellow-fg}');
addDebugMessage('{yellow-fg}Press "ctrl-c" to exit from this app{/yellow-fg}');
addDebugMessage('---');

var formBox = blessed.form({
    parent: screen,
    keys: true,
    left: 'center',
    top: 'center',
    width: '50%',
    height: 8,
    bg: 'white',
    autoNext: true,
    content: 'Enter OpenAI Key'
});

var apiKeyBox = blessed.Textbox({
    parent: formBox,
    top: 3,
    height: 1,
    left: 2,
    right: 2,
    bg: 'black',
    keys: true,
    inputOnFocus: true,
    content: apiKey,
});

var submit = blessed.button({
    parent: formBox,
    mouse: true,
    keys: true,
    shrink: true,
    padding: {
        left: 1,
        right: 1
    },
    left: 10,
    bottom: 2,
    name: 'submit',
    content: 'submit',
    style: {
        bg: 'blue',
        focus: {
            bg: 'green'
        },
        hover: {
            bg: 'green'
        }
    }
});

var useenv = blessed.button({
    parent: formBox,
    mouse: true,
    keys: true,
    shrink: true,
    padding: {
        left: 1,
        right: 1
    },
    left: 20,
    bottom: 2,
    name: 'use env',
    content: 'use env',
    style: {
        bg: 'gray',
        focus: {
            bg: 'green'
        },
        hover: {
            bg: 'green'
        }
    }
});

let lastAction = 'submit'; // Default action

submit.on('press', function() {
    lastAction = 'submit';
    formBox.submit();
});

useenv.on('press', function() {
    lastAction = 'useenv';
    formBox.submit();
});

apiKeyBox.setValue(apiKey);

formBox.on('submit', function(action) {
    let printedApiKey = 'None';
    
    // get the apikeybox
    if (lastAction === 'useenv') {
        // Logic to use environment variable
        apiKey = process.env.OPENAI_API_KEY;  // Assuming your API key is stored in an environment variable
        // want to only include the first 5 characters of the key then ...
        // be sure to check it is that long first
        if (apiKey.length > 5) {
            printedApiKey = apiKey.substring(0, 5);
        }
        addDebugMessage(`API Key set to ENV: ${printedApiKey}...`);
    } else {
        apiKey = apiKeyBox.getValue();
        // Logic to use the value from apiKeyBox
        if (apiKey.length > 5) {
            printedApiKey = apiKey.substring(0, 5);
        }
        addDebugMessage(`API Key set to INPUT ${printedApiKey}`);
    }
    formBox.destroy();
    chatBox.focus();
    screen.render();    
});

screen.key('q', function() {
    process.exit(0);
});

// Function to copy text
function copyToClipboard(text) {
    const strippedText = text.replace(/\x1B\[[0-9;]*[a-zA-Z]/g, ''); // Regex to strip ANSI codes
    clipboardy.writeSync(strippedText);
    addDebugMessage('Text copied to clipboard!');
}

// Example usage within an event handler or function
screen.key('c', () => {
    // Assuming you want to copy the entire content of chatBox or a selected text
    copyToClipboard(chatBox.getContent());
});

apiKeyBox.focus();

// Render the screen.
screen.render();
