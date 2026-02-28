const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
    try {
        const genAI = new GoogleGenerativeAI('AIzaSyCKLE-ku6pi5-XT6uRTQov5XmSyHX8vWh8');
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: "System instructions test" }],
                },
                {
                    role: "model",
                    parts: [{ text: "Understood" }],
                },
            ]
        });

        const result = await chat.sendMessage("Hello");
        console.log("Success:", result.response.text());
    } catch (err) {
        console.error("Gemini Error:", err.message);
    }
}
test();
