const command = {
    command: ['ban', 'kick'],
    categoria: ['grupos']
}

command.script = async (m, { conn }) => {
    if (!m.isGroup) return m.sms('group')
    if (!m.isBotAdmin) return m.sms('botAdmin')
    if (!m.isAdmin) return m.sms('admin')
    if (!(m.mentionedJid[0] || m.quoted || m.text)) return m.reply(`A quien quiere eliminar?`);
    //if (!m.text) return m.reply('Este comando tiene la capacidad de eliminar a varios usuarios simultáneamente. Por favor, proporciona una lista de los usuarios que deseas eliminar, asegurándote de etiquetar a cada uno de ellos')

    if (m.quoted && !m.args[1] || m.mentionedJid[0] && !m.args[1]) {
        const user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender
        if ((global.owner.find(o => o[2])?.[0] + '@s.whatsapp.net').includes(user)) return m.reply('No puedes eliminar al creador del Bot con este comando')
        if (user.includes(m.Bot) && !m.isOwner) return m.reply('No puedes eliminar al Bot con este comando')
        await conn.groupParticipantsUpdate(m.chat, [user], 'remove')
        return m.react(done)
    }

    const numerosEncontrados = m.text.match(/\d+/g)
    let numeros = numerosEncontrados.map(numero => numero + '@s.whatsapp.net')
    if (numeros.map(Bot => Bot).includes(conn.user.jid)) return m.reply('El número asociado al bot no debe incluirse en la lista de usuarios a eliminar.')

    conn.before[m.sender] = {
        setTimeout: setTimeout(() => (m.reply('Se acabó el tiempo, esta acción fue cancelada'), delete conn.before[m.sender]), 60 * 1000),
        script: async (m, conn) => {
            const settimeout = conn.before[m.sender].setTimeout
            const upsert = m.body.toLowerCase();

            const { chat, Numeros } = {
                user: m.sender,
                chat: m.chat,
                Numeros: numeros
            }

            if (!(chat === m.chat)) return;
            if (upsert == 'no') {
                clearTimeout(settimeout)
                delete conn.before[m.sender]
                return m.reply('● *Acción Cancelada ✓*')
            }

            if (upsert == 'si') {
                for (let i = 0; i < Numeros.length; i++) { await conn.groupParticipantsUpdate(chat, [Numeros[i]], 'remove') }
                await conn.sendMessage(m.chat, { text: `Se eliminaron *${Numeros.length}* participantes ✓`, mentions: [m.sender] }, { ephemeralExpiration: 24 * 3600, quoted: { key: { participant: '0@s.whatsapp.net' }, message: { documentMessage: { title: `Acción ejecutada por\nUser : ${m.name}`, jpegThumbnail: null } } } })
                clearTimeout(settimeout)
                delete conn.before[m.sender]
            }
        }
    }

    m.reply(`¿Confirma que desea eliminar a ${numeros.length} usuarios?\n\nDispone de *60* segundos para tomar una decisión. Si está de acuerdo con esta acción, responda con un ‘sí’. En caso contrario, puede cancelar esta acción respondiendo con un ‘no’.`.trim())
}

export default command