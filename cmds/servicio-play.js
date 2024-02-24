import ytdl from '../lib/ytdl2.js'
import yts from 'yt-search'
import fs from 'fs'

const command = {
    command: ['play'],
    categoria: ['servicio']
}

command.script = async (m, { conn }) => {
    if (m.quesCoin()) return m.react('💲')
    if (!m.text) return m.reply(`*Ingresa el título de una canción*`)
    const vid = (await yts(m.text)).all[0]
    if (!vid) return m.reply(`Sin resultados`)
    const { title, description, thumbnail, videoId, timestamp, views, ago, url } = vid

    let texto = `▢ 📌 *Titulo :* ${title}\n`
    texto += `▢ 📆 *Publicado :* ${ago}\n`
    texto += `▢ ⏳ *Duración :* ${timestamp}\n`
    texto += `▢ 👀 *Vistas :* ${views}\n\n`
    texto += `● *Por favor*, ingrese *1* o *2*. Ingrese *3* si desea cancelar esta acción.\n\n`
    texto += `*1. (mp4 / video)*\n`
    texto += `*2. (mp3 / audio)*\n\n`
    texto += `${readMore}▢ 🧾 *Descripcion :* ${description}`.trim()

    await new Promise(async (resolve, reject) => { try { await conn.sendMessage(m.chat, { text: texto, contextInfo: { externalAdReply: { title: title, body: description, thumbnailUrl: thumbnail, mediaType: 1, renderLargerThumbnail: true } } }, { quoted: m }); resolve() } catch (error) { console.error(error); reject(error) } })

    conn.before[m.sender] = {
        setTimeout: setTimeout(async () => (await m.reply('El tiempo de respuesta se ha agotado.'), await m.react('❗'), delete conn.before[m.sender]), 60 * 1000),
        script: async (m, conn) => {
            const settimeout = conn.before[m.sender].setTimeout
            const upsert = m.body.toLowerCase();
            const data = {
                chat: m.chat,
                url: `https://www.youtube.com/watch?v=${videoId}`,
                thumbnail: thumbnail,
            }

            if (upsert == '1' || upsert == 'mp4' || upsert == 'video') {
                await m.react(rwait)
                try {
                    const { title, quality, videoUrl } = await ytdl.mp4(data.url)
                    let cap = `*『 DV-YouTube 』*\n\n▢ *Título:* ${title}\n▢ *Calidad:* ${quality}`.trim()
                    await conn.sendMessage(m.chat, { document: { url: videoUrl }, caption: cap, mimetype: 'video/mp4', fileName: title + `.mp4` }, { quoted: m });
                    m.react(done);
                    m.remCoin(true)
                    clearTimeout(settimeout);
                    delete conn.before[m.sender]
                } catch { m.react(error); return }
            }

            else if (upsert == '2' || upsert == 'mp3' || upsert == 'audio') {
                await m.react(rwait)
                try {
                    const mp3 = await ytdl.mp3(data.url)
                    await conn.sendMessage(m.chat, { audio: fs.readFileSync(mp3.path), contextInfo: { externalAdReply: { title: mp3.info.title, body: mp3.info.author, previewType: "PHOTO", thumbnail: mp3.info.thumbnail } }, mimetype: "audio/mp4", fileName: `${mp3.info.title}.mp3` }, { quoted: m });
                    m.react(done);
                    m.remCoin(true);
                    fs.unlinkSync(mp3.path);
                    clearTimeout(settimeout);
                    delete conn.before[m.sender]
                } catch (e) { m.react(error); return }
            }
            else if (upsert == '3' || upsert == 'cancelar') {
                m.reply('Acción cancelada.')
                clearTimeout(settimeout);
                delete conn.before[m.sender]
            }
        }
    }
}

export default command