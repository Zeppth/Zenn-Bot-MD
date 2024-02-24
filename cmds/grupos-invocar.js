const command = {
    command: ['tagall', 'todos', 'invocar'],
    categoria: ['grupos']
}

command.script = async (m, { conn }) => {
    if (!m.isGroup) return m.sms('group')
    if (!m.isAdmin) return m.sms('admin')
    const pesan = m.text
    const oi = `● Mensaje: ${pesan}`;
    let teks = `▢ ━〔 INVOCACIÓN 〕━ ▢\n\n`
    teks += `${oi}\n\n`
    for (let mem of m.participants) {
        teks += `~> @${mem.id.split('@')[0]}\n`
    }
    conn.sendMessage(m.chat, { text: teks, mentions: m.participants.map(a => a.id) }, { quoted: m, ephemeralExpiration: 24 * 60 * 100, disappearingMessagesInChat: 24 * 60 * 100 })
}

export default command