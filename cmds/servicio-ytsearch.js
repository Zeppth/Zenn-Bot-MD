import yts from 'yt-search'

const command = {
    command: ['ytsearch', 'yts'],
    categoria: ['servicio']
}

command.script = async (m, { conn }) => {
    if (m.quesCoin()) return m.react('💲')
    if (!m.text) return m.reply('Que quieres que busque en YouTube?')
    m.react(rwait)
    const vid = (await yts(m.text)).all[0]
    const { thumbnail } = vid
    let results = await yts(m.text)
    let teks = results.all.map(v => {
        switch (v.type) {
            case 'video': return `▢ ${v.title}\n▢ *Link* : ${v.url}\n▢ *Duración* : ${v.timestamp}\n▢ *Subido :* ${v.ago}\n▢ *Vistas:* ${v.views}`.trim()

            case 'canal': return `▢ *${v.name}* (${v.url})\n▢ ${v.subCountLabel} (${v.subCount}) Suscribirse\n▢ ${v.videoCount} videos`.trim()
        }
    }).filter(v => v).join('\n\n________________________\n\n')
    await conn.sendMessage(m.chat, { text: readMore + teks, contextInfo: { externalAdReply: { title: 'YouTube - Search', thumbnailUrl: thumbnail, mediaType: 1, renderLargerThumbnail: true } } }, { quoted: m });
    m.react(done);
    m.remCoin(true)
}

export default command