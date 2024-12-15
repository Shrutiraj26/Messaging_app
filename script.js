const socket = io("http://localhost:3000");

// DOM elements for Sender
const senderInput = document.getElementById("sender-input");
const senderSendBtn = document.getElementById("sender-send-btn");
const senderWindow = document.getElementById("sender-window");
const senderEmojiBtn = document.getElementById("sender-emoji-btn");

// DOM elements for Receiver
const receiverInput = document.getElementById("receiver-input");
const receiverSendBtn = document.getElementById("receiver-send-btn");
const receiverWindow = document.getElementById("receiver-window");
const receiverEmojiBtn = document.getElementById("receiver-emoji-btn");

// Emoji Picker
const emojiPicker = document.getElementById("emoji-picker");
const emojiOverlay = document.getElementById("emoji-overlay");

// Utility function to add messages
function addMessage(windowElement, message, isSender) {
    const msgElement = document.createElement("div");
    msgElement.classList.add("message");
    msgElement.textContent = message;
    msgElement.classList.add(isSender ? "sender" : "receiver");
    windowElement.appendChild(msgElement);
    windowElement.scrollTop = windowElement.scrollHeight; // Auto-scroll
}

// Toggle Emoji Picker
function toggleEmojiPicker(targetInput) {
    const isHidden = emojiPicker.hidden;
    emojiPicker.hidden = !isHidden;
    emojiOverlay.hidden = !isHidden;

    // Add event listener for selecting emoji
    if (!isHidden) {
        document.querySelectorAll(".emoji").forEach((emoji) => {
            emoji.removeEventListener("click", selectEmoji);
        });
    } else {
        document.querySelectorAll(".emoji").forEach((emoji) => {
            emoji.addEventListener("click", () => selectEmoji(targetInput, emoji.textContent));
        });
    }
}

// Function to select an emoji and add to the input field
function selectEmoji(inputElement, emoji) {
    inputElement.value += emoji;
    toggleEmojiPicker(); // Close the picker
}

// Close emoji picker when overlay is clicked
emojiOverlay.addEventListener("click", () => {
    emojiPicker.hidden = true;
    emojiOverlay.hidden = true;
});

// Event listeners for Sender
senderSendBtn.addEventListener("click", () => {
    const message = senderInput.value.trim();
    if (message) {
        addMessage(senderWindow, message, true);
        socket.emit("message", message);
        senderInput.value = ""; // Clear input
    }
});

senderEmojiBtn.addEventListener("click", () => toggleEmojiPicker(senderInput));

// Event listeners for Receiver
receiverSendBtn.addEventListener("click", () => {
    const message = receiverInput.value.trim();
    if (message) {
        addMessage(receiverWindow, message, false);
        socket.emit("message", message);
        receiverInput.value = ""; // Clear input
    }
});

receiverEmojiBtn.addEventListener("click", () => toggleEmojiPicker(receiverInput));

// Listening for incoming messages
socket.on("message", (message) => {
    // Display messages on both chat windows
    addMessage(senderWindow, message, false);
    addMessage(receiverWindow, message, true);
});
