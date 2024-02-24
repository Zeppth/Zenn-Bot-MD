const command = {
    command: ['sticker', 's'],
    categoria: ['servicio']
}

command.script = async (m, { conn }) => {
    const smsg = m.type(m.SMS().message)
    if (m.quesCoin()) return m.react('💲')
    if (smsg == 'imageMessage') {
        let media = await conn.download()
        await conn.sendImageAsSticker(m.chat, media, m, { packname: m.args[0] || m.name || 'null', author: 'ZN' }), m.remCoin(true)
    } else if (smsg == 'videoMessage') {
        if (m.SMS().message.seconds > 12) return m.reply('Máximo 10 segundos!')
        let media = await conn.download()
        conn.sendVideoAsSticker(m.chat, media, m, { packname: m.args[0] || m.name || 'null', author: 'ZN' }), m.remCoin(true)
    } else {
        m.reply(`Responde o envía un video/imagen utilizando lo siguiente comando: ${global.prefix + m.command}\nDuración del video: 1-9 segundos`)
    }
}

export default command