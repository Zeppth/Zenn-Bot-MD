import { createHash } from 'crypto'

const command = {
    command: ['nserie', 'sn', 'mysn'],
    categoria: ['rpg']
}

command.script = async (m, { conn }) => {
    const user = m.data('users', m.sender)
    if (!user.registered) return m.sms('unreg')
    let NumeroSerie = createHash('md5').update(m.sender).digest('hex')
    m.reply(`\n● *Numero de serie* : ${NumeroSerie}`.trim())
}

export default command