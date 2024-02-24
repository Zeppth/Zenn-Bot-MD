const command = {
    command: ['grupo'],
    categoria: ['grupos']
}

command.script = async (m, { conn }) => {
    if (!m.isGroup) return m.sms('group')
    if (!m.isBotAdmin) return m.sms('botAdmin')
    if (!m.isAdmin) return m.sms('admin')
    if (!m.text) return m.reply(`Desea abrir o cerrar?\nEjemplo: .grupo abrir`)
    if (m.args[0] === 'abrir') {
        m.reply(`*GRUPO ABIERTO*`)
        await conn.groupSettingUpdate(m.chat, 'not_announcement')
    }
    else if (m.args[0] === 'cerrar') {
        m.reply(`*GRUPO CERRADO*`)
        await conn.groupSettingUpdate(m.chat, 'announcement')
    }
}

export default command