const Regex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i
const command = {
    command: ['estado'],
    categoria: ['grupos']
}

command.script = async (m, { conn }) => {
    let Text = (m.quoted ? m.quoted.text ? m.quoted.text : m.text : m.text) || m.text
    let [_, code] = Text.match(Regex) || []
    if (!m.text) return m.reply('Y el link?')
    if (!code) return m.reply('_Error, verifique si el link es correcto_')
    if (!(m.isROwner || m.isOwner || m.isModr)) {
        await m.reply('Su solicitud fue enviada a mi creador, es recomendable que se comunique con el directamente')
        const data = global.owner.filter(([id]) => id)
        for (let jid of data.map(([id]) => [id] + '@s.whatsapp.net').filter(v => v != conn.user.jid)) await m.reply('Nueva solicitud del Bot para un Grupo\n\n*Usuario :* ' + 'wa.me/' + m.sender.split('@')[0] + '\n*Link del grupo solicitado:* ' + Text, jid)
    } else {
        await conn.groupAcceptInvite(code)
        m.react(done)
    }
}

export default command