import { fetchJson } from "../lib/simple.js"

const command = {
    command: ['ia', 'chatgpt', 'gpt', 'IA'],
    categoria: ['servicio']
}

command.script = async (m, { conn }) => {
    if (m.quesCoin()) return m.react('💲')
    if (!m.text) return m.reply('Y el texto?')
    m.react('\uD83D\uDCAC')
    try {
        await conn.sendPresenceUpdate('composing', m.chat)
        const OpenAI = await fetchJson(`https://aemt.me/openai?text=${m.text}`)
        await m.reply(OpenAI.result), m.remCoin(true)
    } catch { m.react(error) }
}

export default command
