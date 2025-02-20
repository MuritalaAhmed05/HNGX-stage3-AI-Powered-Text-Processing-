<a><img src='https://i.imgur.com/LyHic3i.gif'/></a>
<h1 align="center"> AI-Powered Text Processing Interface </h1>
<a><img src='https://i.imgur.com/LyHic3i.gif'/></a>

![Project Preview](https://i.ibb.co/T6FVLpz/30bec062-3b72-4eff-8dd0-f37306b8ed0a.png)

[![Typing SVG](https://readme-typing-svg.herokuapp.com?font=Rockstar-ExtraBold&color=blue&lines=𝓐𝓘-𝓟𝓞𝓦𝓔𝓡𝓔𝓓+𝓣𝓔𝓧𝓣+𝓟𝓡𝓞𝓒𝓔𝓢𝓢𝓘𝓝𝓖+𝓘𝓝𝓣𝓔𝓡𝓕𝓐𝓒𝓔)](https://git.io/typing-svg)

## Overview
The AI-Powered Text Processing Interface is a web application that enables users to process text through summarization, translation, and language detection. The interface is designed with accessibility, responsiveness, and efficiency in mind, offering a seamless user experience.

## Core Features
### Text Processing
- **Language Detection:** Automatically detect the input text's language.
- **Summarization:** Summarize texts that are in English and exceed 150 characters.
- **Translation:** Convert text into English, Portuguese, Spanish, Russian, Turkish, and French.

### User Interface
- Chat-like interface for seamless interactions.
- Intuitive input and output display.
- Error handling for invalid or unsupported inputs.

### Accessibility
- Full support for screen readers.
- Keyboard-friendly navigation.
- Clear visual cues for focus and hover states.

### State Persistence
- User input and results persist using IndexedDB or local storage.
- Ensures a smooth experience even after page refresh.

### Responsive Design
- Optimized layout for mobile, tablet, and desktop.
- Ensures readability and usability across all screen sizes.

## Acceptance Criteria
### Input Handling
- Users should enter text in a designated input field.
- The system should detect the language before processing.
- Summarization should only work for English texts longer than 150 characters.
- Translation should only be available for supported languages.
- Display appropriate error messages for invalid inputs.

### Output Generation
- Summarized text should be concise and meaningful.
- Detected language should be displayed clearly.
- Translated text should be accurate and formatted properly.

### State Persistence
- Inputs and outputs should remain available even after a page refresh.

### Accessibility
- All UI components should be screen-reader-friendly.
- Users should be able to navigate using only the keyboard.

### Responsive Design
- The interface should adapt gracefully across various screen sizes.

### Code Quality
- Modular and well-structured code using React hooks (`useState`, `useEffect`, `useRef`).
- Maintainable and readable logic for text processing functions.

## Installation & Setup
```sh
# Clone the repository
git clone https://github.com/MuritalaAhmed05/HNGX-stage3-AI-Powered-Text-Processing-.git

# Navigate to the project directory
cd ai-text-processing

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Technologies Used
- **Next.js** – Server-side rendering and static generation.
- **TypeScript** – Ensures type safety and improved development experience.
- **Tailwind CSS** – Utility-first CSS framework for styling.
- **Chrome AI APIs** – For text summarization, translation, and language detection.
- **IndexedDB / Local Storage** – To persist user inputs and results.

## Contributing
If you'd like to contribute, feel free to fork the repository and submit a pull request with your improvements.

## License
This project is licensed under the [MIT License](LICENSE).

