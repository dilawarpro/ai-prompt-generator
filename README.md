# AI Prompt Generator

A modern, clean, and professional web application for generating AI prompts from user input and images. Built with JavaScript, Bootstrap, and Font Awesome.

## Features

- **Text to Prompt Conversion**: Transform your regular text into optimized AI prompts
- **Image to Prompt Conversion**: Upload images and generate descriptive prompts
- **Multiple Templates**: Choose from various prompt templates (Creative, Academic, Business, Technical)
- **Customization Options**: Adjust tone, detail level, and other parameters
- **Prompt History**: Save and reuse your favorite prompts
- **Responsive Design**: Works on desktop and mobile devices
- **No Backend Required**: Fully client-side application

## Technologies Used

- **HTML5/CSS3**: Modern markup and styling
- **JavaScript**: Client-side functionality
- **Bootstrap 5**: Responsive UI components
- **Font Awesome 6**: Beautiful icons
- **Local Storage**: For saving prompt history

## How to Use

1. **Open the application** in your web browser
2. **Choose a mode**:
   - Text to Prompt: Enter your message and customize options
   - Image to Prompt: Upload an image and add optional context
3. **Select a template** from the sidebar (optional)
4. **Click "Generate Prompt"**
5. **View, edit, copy** or save the generated prompt
6. **Access your history** from the sidebar

## Image to Prompt Feature

The image-to-prompt feature works by:
1. Uploading an image file
2. Extracting basic file information (name, type, size)
3. Combining with user-provided context
4. Generating a descriptive prompt template

*Note: In a production environment, this would typically use an AI vision API for image analysis. This demo version simulates the functionality client-side.*

## Installation

No installation required! Simply download the files and open `index.html` in your web browser.

```
git clone https://github.com/yourusername/ai-prompt-generator.git
cd ai-prompt-generator
```

Then open `index.html` in your browser.

## Customization

You can easily customize the application by:

- Modifying the CSS in `styles.css` to change the appearance
- Adding new templates in the `promptTemplates` object in `script.js`
- Extending functionality by adding new options or features

## License

MIT License - Feel free to use, modify, and distribute this code for personal or commercial projects.

## Acknowledgements

- [Bootstrap](https://getbootstrap.com/)
- [Font Awesome](https://fontawesome.com/) 