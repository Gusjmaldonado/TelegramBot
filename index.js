const express = require('express');
const { Telegraf } = require('telegraf');
const axios = require('axios');
const { chatGpt, chatGptV2 } = require('./utils');
const googleTTS = require('google-tts-api');

const User = require('./models/user.model')

require('dotenv').config();

//config db
require('./config/db')

const app = express();
const bot = new Telegraf(process.env.BOT_TOKEN);

//config telegram
app.use(bot.webhookCallback('/telegram-bot'));
bot.telegram.setWebhook(`${process.env.BOT_URL}/telegram-bot`)

app.post('/telegram-bot', (req, res) => {
    res.send('kn u hir mi')
})

//MIDDLEWARES
bot.use(async (ctx, next) => {
    ctx.from.telegram_id = ctx.from.id

    console.log(ctx.from)

    const user = await User.findOne({ telegram_id: ctx.from.id })

    if (!user)
        await User.create(ctx.from)


    next()
})

//comandos
bot.command('test', async (ctx) => {
    console.log(ctx.message)
    await ctx.reply(`qlqlqlqlq ${ctx.from.first_name}. tamo activo o q?`);
    await ctx.replyWithDice();
})

bot.command('tiempo', async (ctx) => {
    console.log(ctx.message.text)

    //se pone 8 por los espacios a partir del que cuenta
    const ciudad = ctx.message.text.slice(8)
    try {
        //se hace destructuring porque axios devuelve muchas cosas, asi me quedo con solo la data
        const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${process.env.OWM_API_KEY}&units=metric`)

        await ctx.reply(`El tiempo en ${ciudad}
    Temperatura: ${data.main.temp}°C
    Maxima:${data.main.temp_max}°C
    Minima: ${data.main.temp_min}°C
    Humedad: ${data.main.humidity}%`)

        await ctx.replyWithLocation(data.coord.lat, data.coord.lon)
    } catch {
        ctx.reply('ha ocurrido un error. vuelve a intentarlo')
    }

})

bot.command('receta', async (ctx) => {
    const ingredientes = ctx.message.text.slice(8)
    const response = await chatGpt(ingredientes);

    ctx.reply(response)
})


bot.command('chat', async (ctx) => {
    const mensaje = ctx.message.text.slice(6)

    const count = await User.countDocuments()

    const RandomNum = Math.floor(Math.random() * count)

    const userSelected = await User.findOne().skip(RandomNum)

    bot.telegram.sendMessage(userSelected.telegram_id, mensaje)

    ctx.reply(`Mensaje enviado a: ${userSelected.first_name}`)

    console.log(userSelected)


})


//eventos
bot.on('text', async (ctx) => {
    //const response = await chatGptV2(ctx.message.text)

    const response = ctx.message.text;

    const url = googleTTS.getAudioUrl(response, {
        lang: 'es', slow: false, host: 'https://translate.google.com'
    })


    await ctx.reply(response)
    await ctx.replyWithAudio(url)
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor ready escuchando en puerto ${PORT}`)
})