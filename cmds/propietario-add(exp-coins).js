const command = {
    command: ['addexp', 'addxp', 'addcoin'],
    categoria: ['propietario']
}

command.script = async (m, { conn }) => {
    let who
    if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
    else who = m.chat
    if (!(who in global.db.data.users)) return m.reply(`El usuario no se encuentra en mi base de datos`)
    if (!m.isROwner ?? !m.isOwner ?? !m.isModr) return m.sms('owner')
    if (!who) return m.reply('Taguea al usuario')
    let txt = m.text.replace('@' + who.split`@`[0], '').trim()

    if (m.command == 'addcoin') {
        if (!txt) return m.reply('Ingrese la cantidad de *coins* que quiere añadir')
        if (isNaN(txt)) return m.reply('sólo números')
        let cn = parseInt(txt)
        let coins = cn
        if (coins < 1) return m.reply('Mínimo es  *1*')
        let users = global.db.data.users
        users[who].coin += cn
        await m.reply(`*『©️ / Coin - AÑADIDO 』*\n\n▢ *Total:* ${cn}`)
        m.reply(`● @${who.split`@`[0]}\n▢ *RECIBISTE :* +${cn} coins`)
    }

    if (m.command == 'addexp' || m.command == 'addxp') {
        if (!txt) return m.reply('Ingrese la cantidad de *XP* que quiere añadir')
        if (isNaN(txt)) return m.reply('Sólo números')
        let xp = parseInt(txt)
        let exp = xp
        if (exp < 1) return m.reply('Mínimo es  *1*')
        let users = global.db.data.users
        users[who].exp += xp
        await m.reply(`*『 ✨ / XP - AÑADIDO 』*\n\n▢  *Total:* ${xp}`)
        m.reply(`● @${who.split`@`[0]}\n▢ *RECIBISTE :* +${xp} XP`)
    }
}

export default command