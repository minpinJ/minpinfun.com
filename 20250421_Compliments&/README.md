# Class Greeting Machine

A simple, child-friendly web application that provides personalized greetings to primary school students and teachers. This application doesn't require any backend server and can be hosted directly on GitHub Pages.

## Features

- Simple form for students/teachers to enter their name
- Personalized greetings based on the name entered
- Special handling for "Francisco" who gets asked for their last name
- Child-friendly design with animations and colors
- Mobile-responsive interface
- Random positive greetings for new names

## How to Use

1. Open the application in a web browser
2. Enter your first name with the first letter capitalized
3. Click "Get My Greeting" to receive a personalized message
4. If your name is "Francisco", you'll be asked to enter your last name for an even more personalized greeting
5. After viewing your greeting, you can click "Try Another Name" to start over

## How to Deploy on GitHub Pages

1. Create a new repository on GitHub
2. Upload the three files in this folder (`index.html`, `styles.css`, and `script.js`) to your repository
3. Go to your repository settings
4. Scroll down to the "GitHub Pages" section
5. Select the branch containing your files as the source
6. Click "Save"
7. Wait a few moments for GitHub to build your site
8. Access your deployed application at the provided GitHub Pages URL (typically `https://[your-username].github.io/[repository-name]/`)

## Customization

You can easily customize this application by:

- Adding more names and greetings in the `getPersonalizedGreeting` function in `script.js`
- Adding more Francisco-specific greetings in the `getFranciscoGreeting` function
- Modifying the styling in `styles.css` to change colors, animations, or layout
- Adding or changing the icons and animation elements in the HTML

## Credits

- This application uses [Bootstrap](https://getbootstrap.com/) for styling
- Icons provided by [Font Awesome](https://fontawesome.com/)
- Inspired by a simple Python console application for classroom greetings