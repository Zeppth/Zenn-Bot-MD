const command = {
    command: ['del', 'eliminar', 'delete'],
    categoria: ['grupos']
}

command.script = async (m, { conn }) => {
    if (!m.quoted) throw false
    if (!m.isBotAdmin) return m.sms('botAdmin')
    if (!m.isAdmin) return m.sms('admin')
    let delet = m.message.extendedTextMessage.contextInfo.participant
    let bang = m.message.extendedTextMessage.contextInfo.stanzaId
    conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet } })
}

export default command