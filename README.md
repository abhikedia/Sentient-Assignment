# AI Playground

AI Playground is an interactive web application that allows users to engage with Google's Generative AI model. This project is built using Next.js, React, and the Google Generative AI SDK.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- Node.js (version 14 or later)
- npm (usually comes with Node.js)
- Git

## Installation

1. Clone the repository
2. Run `npm install`
3. Set up environment variables:
    Create a `.env.local` file in the root directory of your project. Add the following line to the file:
   ```
   GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
   ```
   Replace `your_api_key_here` with your actual Google Generative AI API key. If you don't have an API key yet, follow these steps to obtain one:

   a. Go to the [Google AI Studio](https://makersuite.google.com/app/apikey) \
   b. Sign in with your Google account \
   c. Click on "Create API Key" \
   d. Copy the generated API key \
   e. Paste the API key into your `.env.local` file
4. To start the application run: `npm run dev`
5. Open your web browser and navigate to [http://localhost:3000](http://localhost:3000) to see the application running locally.
6. (Optional) Run tests:
To ensure everything is working correctly, you can run the test suite: `npm test`

