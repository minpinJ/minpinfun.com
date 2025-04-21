document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const greetingForm = document.getElementById('greeting-form');
    const lastnameForm = document.getElementById('lastname-greeting-form');
    const initialForm = document.getElementById('initial-form');
    const lastnameFormDiv = document.getElementById('lastname-form');
    const greetingResult = document.getElementById('greeting-result');
    const greetingMessage = document.getElementById('greeting-message');
    const restartBtn = document.getElementById('restart-btn');
    const franciscoPrompt = document.getElementById('francisco-prompt');
    
    // Handle the main greeting form submission
    greetingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nameInput = document.getElementById('name');
        const name = nameInput.value.trim();
        
        if (!name) {
            showError(nameInput, 'Please enter your name');
            return;
        }
        
        // Check if first letter is capitalized
        if (name.charAt(0) !== name.charAt(0).toUpperCase()) {
            showError(nameInput, 'First letter must be capitalized');
            return;
        }
        
        // Get personalized greeting
        const greetingData = getPersonalizedGreeting(name);
        
        if (greetingData.needsLastname) {
            // Show the lastname form for Francisco
            initialForm.classList.add('d-none');
            lastnameFormDiv.classList.remove('d-none');
            franciscoPrompt.textContent = greetingData.greeting;
        } else {
            // Show the greeting directly
            showGreeting(greetingData.greeting);
        }
    });
    
    // Handle the lastname form submission (for Francisco)
    lastnameForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const lastnameInput = document.getElementById('lastname');
        const lastname = lastnameInput.value.trim();
        
        if (!lastname) {
            showError(lastnameInput, 'Please enter your last name');
            return;
        }
        
        // Get Francisco's specific greeting
        const greeting = getFranciscoGreeting(lastname);
        showGreeting(greeting);
    });
    
    // Restart button to try again
    restartBtn.addEventListener('click', function() {
        // Reset forms
        greetingForm.reset();
        lastnameForm.reset();
        
        // Show initial form
        initialForm.classList.remove('d-none');
        lastnameFormDiv.classList.add('d-none');
        greetingResult.classList.add('d-none');
    });
    
    // Helper function to show error on input
    function showError(inputElement, message) {
        // Remove any existing error message
        const existingError = inputElement.parentElement.querySelector('.invalid-feedback');
        if (existingError) {
            existingError.remove();
        }
        
        // Add error class and message
        inputElement.classList.add('is-invalid');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        errorDiv.textContent = message;
        inputElement.parentElement.appendChild(errorDiv);
        
        // Focus the input
        inputElement.focus();
    }
    
    // Helper function to display the greeting
    function showGreeting(message) {
        // Hide forms
        initialForm.classList.add('d-none');
        lastnameFormDiv.classList.add('d-none');
        
        // Show greeting
        greetingMessage.textContent = message;
        greetingResult.classList.remove('d-none');
        
        // Apply a random color to the greeting text for fun
        const colors = [
            'text-primary', 'text-success', 'text-info', 
            'text-warning', 'text-danger'
        ];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        greetingMessage.className = `greeting-text fs-3 mb-0 ${randomColor}`;
    }
    
    // Add input validation for name input
    const nameInput = document.getElementById('name');
    nameInput.addEventListener('input', function() {
        nameInput.classList.remove('is-invalid');
        const feedback = nameInput.parentElement.querySelector('.invalid-feedback');
        if (feedback) {
            feedback.remove();
        }
    });
    
    // Add input validation for lastname input
    const lastnameInput = document.getElementById('lastname');
    if (lastnameInput) {
        lastnameInput.addEventListener('input', function() {
            lastnameInput.classList.remove('is-invalid');
            const feedback = lastnameInput.parentElement.querySelector('.invalid-feedback');
            if (feedback) {
                feedback.remove();
            }
        });
    }
    
    // FUNCTIONS TO REPLACE BACKEND LOGIC
    
    // Function to get personalized greeting based on name
    function getPersonalizedGreeting(name) {
        if (name === "Francisco") {
            return {
                greeting: "Hello Francisco! What is your last name?",
                needsLastname: true
            };
        } else if (name === "Maria") {
            return {
                greeting: "Hey MM, love your smile today!",
                needsLastname: false
            };
        } else if (name === "Laia") {
            return {
                greeting: "Hola Laia, cómo estás?",
                needsLastname: false
            };
        } else if (name === "Celia") {
            return {
                greeting: `Hola ${name}! You look great today!`,
                needsLastname: false
            };
        } else if (name === "Giulia") {
            return {
                greeting: `Ciao ${name}! Buongiorno!`,
                needsLastname: false
            };
        } else if (["Lucas", "Mateo", "Sebastian", "Tomás", "Tomas", "Sandro", 
                   "Francisco", "Leonardo", "Orhan", "Charles", "Pedro", 
                   "Benjamin", "Johnny", "Simon", "Bernardo", "Simón", "Benjamin"].includes(name)) {
            return {
                greeting: `Hello ${name}! I believe you're going to score 30 goals during break today!`,
                needsLastname: false
            };
        } else if (["Francisca", "Valeria", "Isabella", "Beatriz", "Diana", 
                  "Clara", "Olivia", "Alma", "Victoria", "Inês", "Dunya", "Kayla"].includes(name)) {
            return {
                greeting: `Hello ${name}, how are you feeling today? Ready to learn?`,
                needsLastname: false
            };
        } else if (["Arad", "Manuel", "Alexandre", "Thomas", "Jude", "Aadi"].includes(name)) {
            return {
                greeting: `Hello ${name}! Are you feeling full of energy? Let's make lots of fun activities today!`,
                needsLastname: false
            };
        } else if (name === "Samantha") {
            return {
                greeting: "Hello, Ms. Daunt, we love having you as our teacher! Thank you for your patience and kindness!",
                needsLastname: false
            };
        } else if (name === "Emanuela") {
            return {
                greeting: "Hello, Mrs. Cruz, thank you for being such a passionate, kind and energetic teacher!",
                needsLastname: false
            };
        } else if (name === "James") {
            return {
                greeting: "Hello, Mr. Harrison, you're the best!",
                needsLastname: false
            };
        } else {
            // Random greeting for unknown names
            const friendly_greetings = [
                `Hello ${name}! Welcome to our class! Your smile brightens the room!`,
                `Hi there, ${name}! It's so nice to meet you! Ready for a fun day of learning?`,
                `Welcome, ${name}! You're going to have an amazing day full of discoveries!`,
                `Hey ${name}! You look awesome today! Let's learn something new together!`,
                `Hi ${name}! I'm so happy you're here today! You're going to do great things!`,
                `${name}! What a wonderful name! I bet you're as awesome as your name sounds!`,
                `Hello ${name}! Your positive energy is contagious! Let's have a fantastic day!`,
                `Welcome ${name}! I can tell you're super smart and creative!`,
                `Hi ${name}! I'm excited to see what incredible ideas you have today!`,
                `Hello wonderful ${name}! You're going to make today special, I just know it!`
            ];
            
            return {
                greeting: friendly_greetings[Math.floor(Math.random() * friendly_greetings.length)],
                needsLastname: false
            };
        }
    }
    
    // Function to get Francisco-specific greeting based on last name
    function getFranciscoGreeting(lastname) {
        if (lastname === "Carluccio") {
            return "Hello Fran, you look like you had 3 bowls full of Chocapic this morning!";
        } else if (lastname === "Gomes") {
            return "Hello Fran, you look like you had a yogurt with honey and granola this morning! Let's score some nice goals in the break!";
        } else {
            // Random greeting for unknown Francisco last names
            const francisco_greetings = [
                `Hello Francisco ${lastname}! What a fantastic last name you have!`,
                `Hi Francisco ${lastname}! Are you ready to have an amazing day?`,
                `Francisco ${lastname}! That's a super cool name! Let's have fun learning today!`,
                `Hello Francisco ${lastname}! I bet you're going to have the best day ever!`,
                `Francisco ${lastname}, it's great to meet you! You look full of energy today!`
            ];
            
            return francisco_greetings[Math.floor(Math.random() * francisco_greetings.length)];
        }
    }
});