const { Configuration, OpenAIApi } = require('openai')


const chatGpt = async (ingredientes) => {
    const config = new Configuration({
        apiKey: process.env.OPENAI_API_KEY
    });

    const openai = new OpenAIApi(config);
    const completion = await openai.createChatCompletion({
        model: 'gpt-4',
        max_tokens: 200,
        messages: [
            { role: 'assistant', content: 'Eres un bot de telegram. tu tarea principal es generar recetas de cocina en funcion de los ingredientes que te pase el usuario' },
            { role: 'user', content: `Genera una receta en menos de 200 caracteres a partir de los siguientes ingredientes: ${ingredientes}` }
        ]
    });
    return (completion.data.choices[0].message.content)
}


const chatGptV2 = async (mensaje) => {
    const config = new Configuration({
        apiKey: process.env.OPENAI_API_KEY
    });

    const openai = new OpenAIApi(config);
    const completion = await openai.createChatCompletion({
        model: 'gpt-4',
        max_tokens: 300,
        messages: [
            { role: 'assistant', content: 'Eres un bot de telegram. debes responder como si fueses un rasta' },
            { role: 'user', content: `response de manera coherente y en menos de 300 caracteres al siguiente mensaje: ${mensaje}` }
        ]
    });
    return (completion.data.choices[0].message.content)
}




module.exports = {
    chatGpt, chatGptV2
}