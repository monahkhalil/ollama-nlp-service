import express from 'express';
import ollama from 'ollama'; // Assuming correct import based on the library's structure

const app = express();
const port = 3010;

// Function to query Ollama for intent and named entity extraction
async function extractIntentAndEntities(conversation, res) {
    try {
        // Crafting a prompt that instructs the model to extract intents and entities
        const prompt = `Given the following customer support conversation, analyze and identify the main intent and any named entities involved. Format the response as JSON with the structure {"data": [{"intent": "intent1", "entities": [{"type": "entity type", "value": "entity value"}]},{"intent": "intent2", "entities": [{"type": "entity type", "value": "entity value"}]}]}. JSON supports an array of intents as the conversation can have more than one intent. Limit output JUST to JSON:\n\nCustomer Support Conversation:\n${conversation}`;

        // Enable streaming if you expect a long response or want to handle real-time data
        const stream = await ollama.chat({
            model: 'llama2', // Ensure this model is suitable for the task or use a specialized model
            messages: [{ role: 'user', content: prompt }],
            stream: true,
        });

        // Stream the response back to the client
        for await (const part of stream) {
            if (part.message && part.message.content) {
                res.write(part.message.content);
            }
        }
        res.end(); // End the response when streaming is complete
    } catch (error) {
        console.error(`Error: ${error.toString()}`);
        res.status(500).send("An error occurred while processing your request.");
    }
}

app.get('/extract-intent', async (req, res) => {
    const { conversation } = req.query;
    if (!conversation) {
        return res.status(400).send('Please provide a conversation query parameter.');
    }

    // Use the conversation as the input for intent and entity extraction
    await extractIntentAndEntities(conversation, res);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


// import express from 'express';
// import ollama from 'ollama'; // Assuming this is the correct way to import based on the library's structure

// const app = express();
// const port = 3010;

// // Updated function to stream response from Ollama library
// async function queryOllama(prompt, res) {
//     try {
//         // Initiating streaming response from Ollama
//         const stream = await ollama.chat({
//             model: 'llama2',
//             messages: [{ role: 'user', content: prompt }],
//             stream: true, // Enable streaming
//         });

//         // Stream the responses back to the client
//         for await (const part of stream) {
//             if (part.message && part.message.content) {
//                 // Streaming each part of the message content
//                 res.write(part.message.content);
//             }
//         }
//         res.end(); // End the response when streaming is complete
//     } catch (error) {
//         console.error(`Error: ${error.toString()}`);
//         res.status(500).send("An error occurred while processing your request.");
//     }
// }

// app.get('/extract-intent', async (req, res) => {
//     const { conversation } = req.query;
//     if (!conversation) {
//         return res.status(400).send('Please provide a conversation query parameter.');
//     }

//     // Directly use the conversation as the prompt and pass the response object for streaming
//     await queryOllama(conversation, res);
// });

// app.listen(port, () => {
//     console.log(`Server running on port ${port}`);
// });
