# TL;DR AI - Intelligent Text Analysis Tool

This application uses Google AI (Gemini) to summarize text and answer questions about it.

## ⚠️ Required Setup: Google AI API Key

Before you can run this app, you must configure your Google AI API key.

1. **Get a Google AI API Key:** Go to [Google AI Studio](https://makersuite.google.com/app/apikey) and create an API key.
2. **Set Environment Variable:** Add your API key to your environment:
   ```bash
   export GEMINI_API_KEY="your-api-key-here"
   ```
   Or create a `.env` file in the root directory:
   ```
   GEMINI_API_KEY=your-api-key-here
   ```

## Features

- **Text Analysis:** Paste any text to get AI-powered summaries and key points
- **One-Sentence Summary:** Get a concise overview of the entire text
- **Key Points Extraction:** Automatically identify 3-5 most important points
- **Interactive Q&A:** Ask specific questions about the analyzed text
- **Real-time Processing:** See loading indicators while AI processes your requests
- **Dark Theme:** Modern, professional dark UI design
- **Responsive:** Works on desktop and mobile devices

## How to Run This Project

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Set up Google AI API Key** (see above)

3. **Start the Application:**
   ```bash
   npm run dev
   ```

4. **Open the App:** Navigate to `http://localhost:5000`

## How to Use

1. **Paste Text:** Enter any article, report, email, or document in the large text area
2. **Analyze:** Click "Analyze Text" to get an AI-generated summary and key points
3. **Ask Questions:** Use the Q&A panel to ask specific questions about your text
4. **Get Answers:** The AI will answer based only on the content you provided

## Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Express.js, Node.js
- **AI Integration:** Google AI (Gemini 2.5 Flash)
- **State Management:** TanStack Query
- **Styling:** Tailwind CSS with custom dark theme

## API Endpoints

- `POST /api/analyze` - Analyze text and return summary + key points
- `POST /api/ask` - Answer questions based on provided context

## Environment Variables

- `GEMINI_API_KEY` - Your Google AI API key (required)
- `PORT` - Server port (defaults to 5000)

## Limitations

- Text input is limited to 50,000 characters
- Q&A answers are based only on the provided text context
- Requires active internet connection for AI processing

## Support

If you encounter any issues:
1. Ensure your Google AI API key is valid and has sufficient quota
2. Check that all dependencies are installed correctly
3. Verify your internet connection for AI API calls

For technical issues, please check the browser console and server logs for error messages.
