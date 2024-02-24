const command = {
    command: ['reenv', 'reenviar'],
    categoria: ['grupos']
}

command.script = async (m, { conn }) => {
    if (!m.quoted) return m.reply('quoted?')
    await conn.copyNForward(m.args[0] ? m.args[0] : m.chat, m.SMS())
}

export default command