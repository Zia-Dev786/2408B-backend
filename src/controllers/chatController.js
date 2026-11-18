let groqSdk = require('groq-sdk')
require('dotenv').config()

const client = new groqSdk({
    apiKey: process.env.GROQ_API // This is the default and can be omitted
});
exports.chatbot = async (req, res) => {
    try {
        const chatCompletion = await client.chat.completions.create({
            messages: [{ role: 'user', content: req.body.query }],
            model: 'openai/gpt-oss-20b',
        });
        console.log(chatCompletion.choices[0])
        res.json({
            message: 'success', response: chatCompletion.choices[0].message
        })

    } catch (e) {
        res.status(500).json({ message: "server error", error: e })
    }
}