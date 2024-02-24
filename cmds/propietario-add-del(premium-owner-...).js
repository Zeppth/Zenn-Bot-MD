const command = {
    command: ['addowner', 'delowner', 'addmodr', 'addmoderador', 'delmodr', 'delmoderador', 'addprem', 'addpremium', 'delprem', 'delpremium'],
    categoria: ['propietario']
}

command.script = async (m, { conn }) => {
    const sender = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
    const db = global.db.data.users[sender]
    const usuario = sender.slice(0, -15)
    const textMention = `Etiqueta o menciona al usuario`
    const User = `@${sender.split`@`[0]}`
    if (!(sender in global.db.data.users)) return m.reply(`El usuario no se encuentra en mi base de datos`)

    conn.reply = (text) => { conn.sendMessage(m.chat, { text: text, mentions: [sender] }, { quoted: m }) }

    if (m.command == 'addowner') {
        if (!m.isROwner) return m.sms('owner')
        if (!isNaN(usuario && m.mentionedJid[0] && m.text)) return m.reply(textMention)
        if (db.owner) return m.reply('El usuario mensionado ya es owner')
        db.owner = true
        db.modr = true
        db.premium = true
        conn.reply(User + ' ahora te conviertes en Owner')
    }

    else if (m.command == 'delowner') {
        if (!m.isROwner) return m.sms('owner')
        if (!isNaN(usuario && m.mentionedJid[0] && m.text)) return m.reply(textMention)
        if (!db.owner) return m.reply('El usuario mensionado no es owner')
        db.owner = false
        db.modr = false
        db.premium = false
        conn.reply(User + ' ya no eres owner')
    }

    else if (m.command == 'addmodr' || m.command == 'addmoderador') {
        if (!m.isOwner ?? !m.isROwner) return m.sms('owner')
        if (!isNaN(usuario && m.mentionedJid[0] && m.text)) return m.reply(textMention)
        conn.reply(db.owner ? User + ' Has sido degradado a solo moderador' : User + ' ahora te conviertes en moderador')
        db.owner = false
        ///////
        db.modr = true
        db.premium = true
    }

    else if (m.command == 'delmodr' || m.command == 'delmoderador') {
        if (!m.isOwner ?? !m.isROwner) return m.sms('owner')
        if (!isNaN(usuario && m.mentionedJid[0] && m.text)) return m.reply(textMention)
        db.owner = false
        ///////
        db.modr = false
        db.premium = false
        conn.reply(User + ' ya no eres moderador')
    }

    else if (m.command == 'addprem' || m.command == 'addpremium') {
        if (!m.isModr ?? !m.isOwner ?? !m.isROwner) return m.sms('modr')
        if (!isNaN(usuario && m.mentionedJid[0] && m.text)) return m.reply(textMention)
        const text = User + ' Has sido degradado a solo usuario premium'
        conn.reply(db.owner ? text : db.modr ? text : User + ' ahora te conviertes en un usuario premium')
        db.owner = false
        db.modr = false
        ///////
        db.premium = true
    }

    else if (m.command == 'delprem' || m.command == 'delpremium') {
        if (!m.isModr ?? !m.isOwner ?? !m.isROwner) return m.sms('modr')
        if (!isNaN(usuario && m.mentionedJid[0] && m.text)) return m.reply(textMention)
        db.owner = false
        db.modr = false
        ///////
        db.premium = false
        conn.reply(User + ' Ya no eres usuario premium')
    }
}

export default command