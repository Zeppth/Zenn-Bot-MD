const command = {
    command: ['mp3'],
    categoria: ['servicio']
}

command.script = async (m, { conn }) => {
    const type = m.type(m.SMS().message)
    if (!(/document/.test(type) || type == 'audioMessage' || type == 'videoMessage')) return m.reply(`Envie ó Responda un (video/grabación) con el comando:\n\n${global.prefix}mp3`)
    let media = await conn.download()
    if (!media) return m.reply('No se pudo descargar el archivo')
    let audio = await conn.converter('opus', media, 'mp4')
    if (!audio.data) return m.reply('No se pudo convertir a audio')
    conn.sendMessage(m.chat, { audio: audio.data, contextInfo: { externalAdReply: { title: `Zenn Bot MD`, body: `Convertido a audio ✓`, previewType: "PHOTO", thumbnailUrl: m.multimedia('imagenes/thumbnail.jpg') } }, mimetype: 'audio/mp4', fileName: `${m.text ? m.text : 'audio'}.mp3` }, { quoted: m })
}

export default command