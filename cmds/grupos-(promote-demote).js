const command = {
    command: ['promote', 'demote', 'darpoder', 'quitarpoder', 'addadmin', 'deladmin'],
    categoria: ['grupos']
}

command.script = async (m, { conn }) => {
    if (!m.isGroup) return m.sms('group')
    if (!m.isBotAdmin) return m.sms('botAdmin')
    if (!m.isAdmin) return m.sms('admin')
    let who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
    const User = who.slice(0, -15)
    if (!isNaN(User && m.mentionedJid[0] && m.text)) return m.reply('Etiqueta o menciona al usuario')

    if (m.command == 'promote' || m.command == 'addadmin' || m.command == 'darpoder') { try { await conn.groupParticipantsUpdate(m.chat, [who], 'promote'); m.react(done) } catch { await m.react(error) } }

    else if (m.command == 'demote' || m.command == 'deladmin' || m.command == 'quitarpoder') { try { await conn.groupParticipantsUpdate(m.chat, [who], 'demote'); m.react(done) } catch { await m.react(error) } }
}

export default command