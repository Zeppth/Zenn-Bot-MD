import { createHash } from 'crypto'

const command = {
    command: ['unreg', 'delreg'],
    categoria: ['rpg']
}

command.script = async (m, { conn }) => {
    const user = m.data('users', m.sender)
    if (!user.registered) return m.sms('unreg')
    if (!m.args[0]) m.reply(`*Ingrese su número de serie*\nVerifique su número de serie con el comando:\n\n*${global.prefix}nserie*`)
    let NumeroSerie = createHash('md5').update(m.sender).digest('hex')
    if (!(m.args[0] == NumeroSerie)) m.reply('Número de serie incorrecto!')
    user.registered = false
    m.reply(`Registro eliminado ✓`)
}

export default command