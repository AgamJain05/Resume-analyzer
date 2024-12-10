const express = require('express');
require('dotenv').config();
const app = express();
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs').promises;
const path = require('path');
const pdf = require('pdf-parse');

const upload = multer({ 
    dest: 'uploads/', 
    limits: { fieldSize: 10 * 1024 * 1024 }
});

const genAi = new GoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/analyze', upload.single('resume'), async (req, res) => {
    try {
        const { jobDescription } = req.body;
        if (!jobDescription || !req.file) {
            return res.status(400).json({ message: 'Please provide job description and resume' });
        }

        const resumeBuffer = await fs.readFile(req.file.path);
        const pdfData = await pdf(resumeBuffer);
        const resumeText = pdfData.text;

        const model = genAi.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: "be short and concise",
        });

        const generationConfig = {
            temperature: 0.2,
            topP: 0.95,
            topK: 64,
            maxOutputTokens: 8192,
            responseMimeType: "text/plain",
        };

        const prompt = ` I will give you a resume and a job description. Compare and  analyze the resume and job description provide the following information:
Return only the following, each on a new line:
    - A single number score out of 10
    - Good points (in a single line)
    - Missing points (in a single line)
    - Possible additional points (in a single line)

Be concise and to the point.
`;

        const result = await model.generate(prompt, generationConfig);
        const response = await result.response;

        res.json({
            analysis: response
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});