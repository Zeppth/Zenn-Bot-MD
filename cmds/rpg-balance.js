const command = {
    command: ['bal', 'balance', 'coin', 'coins'],
    categoria: ['rpg']
}

command.script = async (m, { conn }) => {
    let who = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
    if (!(who in global.db.data.users)) return m.reply(`El usuario no se encuentra en mi base de datos`)
    let { coin, exp, nivel, role, registered, name } = m.data('users', who)
    let pp = await conn.profilePictureUrl(who, 'image').catch(_ => m.multimedia('imagenes/avatar.jpg'))
    const text = `\n*『 BALANCE 』*\n● *Nombre* : @${who.split('@')[0]}\n▢ *coins* : ${m.isPrems ? '∞' : coin}\n▢ *nivel* : ${nivel}\n▢ *Rol* : \`${role}\`\n▢ *XP* : Total ${exp}\n\n> *NOTA :* Puedes comprar ©️ coins usando el comando *${global.prefix}buy < cantidad >*`
    conn.sendMessage(m.chat, { text: text, contextInfo: { mentionedJid: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net'), externalAdReply: { title: registered ? name : m.name, body: 'Usuario de Zenn Bot MD', thumbnailUrl: pp } } })
}

export default command