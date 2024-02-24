const command = {
    command: ['banchat', 'unbanchat', 'banear', 'desbanear'],
    categoria: ['propietario']
}

command.script = async (m, { conn }) => {
    if (!(m.isModr || m.isOwner || m.isROwner)) return m.sms('owner')
    const chat = (object) => m.args[0] ? m.args[0] + '' : object
    const sender = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'

    if (m.command == 'banchat') {
        data.chats[chat(m.chat)].isBanned = true
        m.reply('Ahora este Bot no responderá a los comandos enviados a este chat')
    }
    if (m.command == 'unbanchat') {
        data.chats[chat(m.chat)].isBanned = false
        m.reply('Ahora este Bot responderá a los comandos enviados a este chat')
    }

    if (m.command == 'banear') {
        if (data.users[chat(sender)].banned) m.reply(`El usuario ${sender.split`@`[0]} ya estuvo baneado U.U`)
        data.users[chat(sender)].banned = true
        data.users[chat(sender)].banActor = m.sender
        m.reply('Ahora el Bot no respondera a ningun comando enviado por este usuario')
    }

    if (m.command == 'desbanear') {
        const creador = global.owner.find(o => o[2])?.[0] + '@s.whatsapp.net'
        if (!data.users[chat(sender)].banned) return m.reply(`El usuario ${sender.split`@`[0]}, no esta baneado`)
        if (m.sender == creador) {
            data.users[chat(sender)].banActor = ''
            data.users[chat(sender)].banned = false
            m.reply('Usuario desbaneado ✓')
        } else {
            if (data.users[chat(sender)].banActor.startsWith(creador)) return m.reply(`Este usuario fue baneado por el creador del Bot, no puedes desbanearlo.`)
            data.users[chat(sender)].banActor = ''
            data.users[chat(sender)].banned = false
            m.reply('Usuario desbaneado ✓')
        }
    }
}

export default command