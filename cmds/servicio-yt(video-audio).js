import ytdl from '../lib/ytdl2.js'
import yts from 'yt-search'
import fs from 'fs'

const command = {
    command: [, 'yta', 'playmp3', 'audio', 'ytv', 'playmp4', 'video'],
    categoria: ['servicio']
}

command.script = async (m, { conn }) => {
    if (m.quesCoin()) return m.react('💲')
    if (!m.text) return m.reply(`*Ingresa el título de una canción*`)
    const vid = (await yts(m.text)).all[0]
    if (!vid) return m.reply(`Sin resultados`)
    const { title, description, thumbnail, videoId, timestamp, views, ago } = vid
    let play = `▢ 📌 *Titulo :* ${title}\n`
    play += `▢ 📆 *Publicado :* ${ago}\n`
    play += `▢ ⏳ *Duración :* ${timestamp}\n`
    play += `▢ 👀 *Vistas :* ${views}\n\n`
    play += `@Cargando${readMore}\n▢ 🧾 *Descripcion :* ${description}`.trim()
    const _Url = `https://www.youtube.com/watch?v=${videoId}`

    async function sendMsge(text) {
        await new Promise(async (resolve, reject) => { try { await conn.sendMessage(m.chat, { text: play.replace('@Cargando', text), contextInfo: { externalAdReply: { title: title, body: description, thumbnailUrl: thumbnail, mediaType: 1, renderLargerThumbnail: true } } }, { quoted: m }); resolve() } catch (error) { console.error(error); reject(error) } });
    }

    if (m.command == 'playmp3' || m.command == 'yta' || m.command == 'audio') {
        try {
            await sendMsge('Cargando audio'); m.react(rwait)
            const mp3 = await ytdl.mp3(_Url)
            await conn.sendMessage(m.chat, { audio: fs.readFileSync(mp3.path), contextInfo: { externalAdReply: { title: title, body: mp3.info.author, previewType: "PHOTO", thumbnail: mp3.info.thumbnail } }, mimetype: "audio/mp4", fileName: `${title}.mp3` }, { quoted: m });
            m.react(done);
            m.remCoin(true);
            fs.unlinkSync(mp3.path)
        } catch (e) { m.react(error); return }
    }

    else if (m.command == 'play' || m.command == 'playmp4' || m.command == 'ytv' || m.command == 'video') {
        try {
            await sendMsge('Cargando video'); m.react(rwait)
            const { title, quality, videoUrl } = await ytdl.mp4(_Url)
            let cap = `*『 DV-YouTube 』*\n\n▢ *Título:* ${title}\n▢ *Calidad:* ${quality}`.trim()
            await conn.sendMessage(m.chat, { document: { url: videoUrl }, caption: cap, mimetype: 'video/mp4', fileName: title + `.mp4` }, { quoted: m });
            m.react(done);
            m.remCoin(true)
        } catch { m.react(error); return }
    }
}

export default command
