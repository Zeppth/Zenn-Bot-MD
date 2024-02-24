const command = {
    command: ['hidetag', 'notificar', 'tag'],
    categoria: ['grupos']
}

command.script = async (m, { conn }) => {
    if (!m.isGroup) return m.sms('group')
    if (!m.isAdmin) return m.sms('admin')
    if (!m.text) return m.reply(`*Y el texto?*`)
    conn.sendMessage(m.chat, { text: m.text ? m.text : '', mentions: m.participants.map(a => a.id) }, { quoted: m, ephemeralExpiration: 24 * 60 * 100, disappearingMessagesInChat: 24 * 60 * 100 })
} 

export default command