const path = require('path');
const fs = require('fs');
const configPath = path.join(__dirname, 'config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const apiKey = config.apiKey;

const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: apiKey });
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const messages = [];

async function getUserInput() {
    return new Promise((resolve) => {
        rl.question('You: ', (answer) => {
            resolve(answer);
        });
    });
}

async function main() {
    while (true) {
        const userResponse = await getUserInput();
        messages.push({ role: 'user', content: userResponse });

        const completion = await openai.chat.completions.create({
            messages,
            model: "gpt-3.5-turbo",
        });

        messages.push( completion.choices[0].message );
        console.log(messages);
    }
}

main();
