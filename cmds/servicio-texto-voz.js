import path from 'path'
import fs from 'fs'
import gtts from 'node-gtts';

const command = {
    command: ['voz'],
    categoria: ['servicio']
}

command.script = async (m, { conn }) => {
    if (!m.text) return m.reply('Y el texto?')
    const audio = await tts(m.text);
    await conn.sendMessage(m.chat, { audio: audio, fileName: 'error.mp3', mimetype: 'audio/mpeg', ptt: true }, { quoted: m });
}

export default command

async function tts(text = 'error', lang = 'es') {
    return new Promise((resolve, reject) => { try { const tts = gtts(lang); const filePath = path.join(global.__dirname(import.meta.url), '../tmp', (1 * new Date) + '.wav'); tts.save(filePath, text, () => { resolve(fs.readFileSync(filePath)); fs.unlinkSync(filePath) }) } catch (e) { reject(e) } })
}