const path = require('path');
const fsconf = require('fs');
const configPath = path.join(__dirname, 'config.json');
const config = JSON.parse(fsconf.readFileSync(configPath, 'utf8'));
const apiKey = config.apiKey;

const fs = require('fs/promises');
const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: apiKey });

async function readInputFromFile(fileName) {
    try {
        const inputText = await fs.readFile(fileName, 'utf-8');
        return inputText.trim();  // Trim any leading/trailing whitespaces
    } catch (error) {
        console.error('Error reading input file:', error.message);
        process.exit(1);
    }
}

async function writeOutputToFile(outputText) {
    try {
        await fs.writeFile('output.txt', outputText);
        console.log('AI response written to output.txt');
    } catch (error) {
        console.error('Error writing output file:', error.message);
        process.exit(1);
    }
}

async function main() {
    const userResponse = await readInputFromFile('input.txt');
    const systemContent = `Summarize the text ${userResponse}`;

    const completion = await openai.chat.completions.create({
        messages: [
            { role: 'system', content: systemContent },
            { role: 'user', content: userResponse }
        ],
        model: "gpt-3.5-turbo",
        temperature: 0
    });

    const aiResponse = completion.choices[0].message.content;

    await writeOutputToFile(aiResponse);
}

main();
