const command = {
    command: ['grupoinfo'],
    categoria: ['grupos']
}

command.script = async (m, { conn }) => {
    if (!m.isGroup) return m.sms('group')
    let data = await conn.profilePictureUrl(m.chat, 'image').catch(_ => m.multimedia('imagenes/avatar.jpg'))
    let groupAdmins = m.participants.filter(p => p.admin)
    let listAdmin = groupAdmins.map((v, i) => `${i + 1}. @${v.id.split('@')[0]}`).join('\n')
    let owner = m.groupMetadata.owner || groupAdmins.find(p => p.admin === 'superadmin')?.id || m.chat.split`-`[0] + '@s.whatsapp.net'
    let sumadmin = m.participants.filter(x => x.admin === 'admin').length + m.participants.filter(x => x.admin === 'superadmin').length

    let text = `● *Nombre del grupo* : ${m.groupMetadata.subject}
▢ *Creado por* : _${'@' + owner.split('@')[0] ? '@' + owner.split('@')[0] : "Número del creador principal no encontrado"}_
▢ *Fecha de creación* : ${formatDate(m.groupMetadata.creation * 1000)}
▢ *Total de participantes* : ${m.participants.length}
▢ *Total de administradores* : ${sumadmin}
${listAdmin}

▢ *ID del grupo* : ${m.groupMetadata.id}
▢ *Descripción* : \n${readMore}\n${m.groupMetadata.desc?.toString()}`.trim()

    conn.sendMessage(m.chat, { image: { url: data }, caption: text, contextInfo: { mentionedJid: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net'), externalAdReply: { title: `${m.groupMetadata.subject}`, body: 'WhatsApp grupo', thumbnailUrl: m.multimedia('/thumbnail.jpg'), mediaType: 1 } } }, { quoted: m })
}

export default command

function formatDate(n, locale = 'es') {
    let d = new Date(n)
    return d.toLocaleDateString(locale, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    })
}