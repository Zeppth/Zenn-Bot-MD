const items = (UserXp, xpNecesario) => { let _false = false; if (UserXp < xpNecesario) _false = false; else _false = true; return _false }

const command = {
    command: ['ppt'],
    categoria: ['rpg']
}

command.script = async (m, { conn }) => {
    const User = m.data('users', m.sender)
    const Empate = 100
    const ganar = 300
    const perder = 200
    if (User.exp < perder) return m.reply(`Es necesario tener un mínimo de *${perder} XP* para poder usar este comando.`)
    if (!m.text) m.reply(`Seleccione piedra/papel/tijera\n\nEjemplo : *${global.prefix + m.command}* papel`)

    const item = ['piedra', 'papel', 'tijera']
    const randItem = item[Math.floor(Math.random() * (item.length))]

    if (randItem == m.text) {
        User.exp += Empate
        m.reply(`▢ *Empate*\n\n‣ Tú : ${m.text}\n‣ Bot : ${randItem}\n\n🎁 Puntos *+${Empate} XP*`)
    } else if (m.text == 'piedra') {
        if (randItem == 'tijera') {
            User.exp += ganar
            m.reply(`▢ *Ganaste* 🎊\n\n‣ Tú : ${m.text}\n‣ Bot : ${randItem}\n\n🎁 Puntos *+${ganar} XP*`)
        } else {
            User.exp = m.user() ? User.exp - 0 : items(User.exp, perder) ? User.exp - perder : 0
            m.reply(`▢ *Perdiste*\n\n‣ Tú : ${m.text}\n‣ Bot : ${randItem}\n\n Puntos *-${perder} XP*`)
        }
    } else if (m.text == 'tijera') {
        if (randItem == 'papel') {
            User.exp += ganar
            m.reply(`▢ *Ganaste* 🎊\n\n‣ Tú : ${m.text}\n‣ Bot : ${randItem}\n\n🎁 Puntos *+${ganar} XP*`)
        } else {
            User.exp = m.user() ? User.exp - 0 : items(User.exp, perder) ? User.exp - perder : 0
            m.reply(`▢ *Perdiste*\n\n‣ Tú : ${m.text}\n‣ Bot : ${randItem}\n\nPuntos *-${perder} XP*`)
        }
    } else if (m.text == 'papel') {
        if (randItem == 'piedra') {
            User.exp += ganar
            m.reply(`▢ *Ganaste* 🎊\n\n‣ Tú : ${m.text}\n‣ Bot : ${randItem}\n\n🎁 Puntos *+${ganar} XP*`)
        } else {
            User.exp = m.user() ? User.exp - 0 : items(User.exp, perder) ? User.exp - perder : 0
            m.reply(`▢ *Perdiste*\n\n‣ Tú : ${m.text}\n‣ Bot : ${randItem}\n\nPuntos *-${perder} XP*`)
        }
    } else { m.reply(`Seleccione piedra/papel/tijera\n\nEjemplo : *${global.prefix + m.command}* papel`) }
}

export default command