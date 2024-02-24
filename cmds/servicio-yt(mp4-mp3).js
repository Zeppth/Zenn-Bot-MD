import ytdl from '../lib/ytdl2.js'
import { YoutTube, ytIdRegex } from '../lib/ytdlmp.js'
import fs from 'fs'

const command = {
    command: ['ytmp3', 'ytmp4'],
    categoria: ['servicio']
}

command.script = async (m, { conn }) => {
    if (m.quesCoin()) return m.react('💲')
    if (!m.args[0]) return m.reply('*Ingrese el comando junto al link de YouTube*')
    if (!ytIdRegex.test(m.args[0])) return m.reply(`Link incorrecto`)
    if (m.command == 'ytmp3') {
        const urls = YoutTube(m.text)
        for (let i = 0; i < urls.length; i++) {
            try {
                const mp3 = await ytdl.mp3(urls[i])
                conn.sendMessage(m.chat, { audio: fs.readFileSync(mp3.path), contextInfo: { externalAdReply: { title: mp3.info.title, body: mp3.info.author, previewType: "PHOTO", thumbnail: mp3.info.thumbnail } }, mimetype: "audio/mp4", fileName: `${mp3.info.title}.mp3` }, { quoted: m });
                m.react(done);
                m.remCoin(true);
                fs.unlinkSync(mp3.path)
            } catch { m.react(error) }
        }
    } else if (m.command == 'ytmp4') {
        const urls = YoutTube(m.text)
        for (let i = 0; i < urls.length; i++) {
            try {
                const { title, quality, videoUrl } = await ytdl.mp4(urls[i])
                let cap = `*『 DV-YouTube 』*\n\n▢ *Título:* ${title}\n▢ *Calidad:* ${quality}`.trim()
                await conn.sendMessage(m.chat, { document: { url: videoUrl }, caption: cap, mimetype: 'video/mp4', fileName: title + `.mp4` }, { quoted: m });
                m.react(done);
                m.remCoin(true);
            } catch { m.react(error) }
        }
    }
}

export default command