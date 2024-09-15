const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const cors = require('cors');
const axios = require('axios');

let googleApiKey = ''
let openaiApiKey = '';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const path = require('path');
const app = express();
const port = 3000;

app.use(cors());


app.post('/extract-pdf', upload.single('pdfFile'), async (req, res) => {
    const apiselect = req.body.apiselect;
    let apiKey = req.body.apiKey;
    
    if (!apiKey) {
        return res.status(400).json({ message: 'API key is missing' });
    }
    if (!req.file) {
        return res.status(400).json({ message: 'No PDF file uploaded' });
    }

    if (apiselect === 'google_gemini')
    {
      googleApiKey = String(apiKey);
    }
    else
    {
      openaiApiKey = String(apiKey);
    }


    try {
        const data = await pdfParse(req.file.buffer);
        const extractedText = data.text;

        let generatedResume;
        if (apiselect === 'google_gemini') {

          const {
            GoogleGenerativeAI
          } = require("@google/generative-ai");
          
          const genAI = new GoogleGenerativeAI(googleApiKey);
          
          const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-pro',
          });
          
          const generationConfig = {
            temperature: 1,
            topP: 0.95,
            topK: 64,
            maxOutputTokens: 10000,
            responseMimeType: 'text/plain',
          };

            const message = `You are a helpful assistant that generates HTML resumes from LinkedIn PDF content. \n You Do not provide any explaination or any thing extra just the HTML code.\n\nGenerate a HTML resume with the following details:\n${extractedText}`;

            const chatSession = model.startChat({
                generationConfig,
                history: [],
            });

            const result = await chatSession.sendMessage(message);
            generatedResume = result.response.text().replace(/```html|```/g, '');
        } else if (apiselect === 'open_ai') {
            async function getOpenAIResponse(extractedText) {
              const message = `Generate a HTML resume with the following details and provide the HTML code:\n${extractedText}`;
              
              try {
                const response = await axios.post(
                  'https://api.openai.com/v1/chat/completions',
                  {
                    model: 'gpt-4o',
                    messages: [
                      { role: 'system', content: 'You are a helpful assistant that generates HTML+CSS resumes from LinkedIn PDF content.' },
                      { role: 'user', content: message },
                    ],
                  },
                  {
                    headers: {
                      'Authorization': `Bearer ${openaiApiKey}`,
                      'Content-Type': 'application/json',
                    },
                  }
                );
                
                return response.data.choices[0].message.content;
              } catch (error) {
                console.error('Error with OpenAI API:', error.response ? error.response.data : error.message);
                throw error;
              }
            }
            generatedResume = await getOpenAIResponse(extractedText);
        } else {
            return res.status(400).json({ message: 'Invalid API key provided' });
        }

        res.json({ htmlResume: generatedResume });

    } catch (err) {
        res.status(500).json({ message: 'Error processing PDF or AI request', error: err.message });
    }
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
