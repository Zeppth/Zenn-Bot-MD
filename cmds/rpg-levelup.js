const command = {
    command: ['level', 'nivel', 'subirnivel', 'lvl', 'levelup'],
    categoria: ['rpg']
}

command.script = async (m, { conn }) => {
    if (!(m.sender in global.db.data.users)) return m.reply(`No estas en mi base de datos`)
    const User = m.data('users', m.sender)
    let nivel = User.nivel
    let Exp = User.exp
    const NivelXp = (level) => { return level * global.rpg.precios.nivel }
    const items = (UserXp, xpNecesario) => { let _false = false; if (UserXp < xpNecesario) _false = false; else _false = true; return _false }
    let Texto = ''
    while (Exp >= NivelXp(nivel + 1)) {
        nivel += 1
        const ExpB = NivelXp(nivel) * 0.01
        const Role = global.rpg.role.find(r => r.nivel === (nivel > 99 ? 100 : nivel))
        User.nivel = nivel
        User.role = Role ? Role.name : ''
        User.exp = m.user() ? User.exp - 0 : items(User.exp, ExpB) ? User.exp - ExpB : 500
        Texto = (`*『 SUBES DE LEVEL 』*\n\n● *Nombre :* @${m.sender.split`@`[0]}\n▢ Nivel : *${nivel}*\n▢ Rango : *${User.role}*\n - ${ExpB} *XP*\n${User.nivel > 99 ? `\n● @${m.sender.split`@`[0]} Gracias por usar este Bot!` : '*Cuanto más interactúes con los bots, mayor será tu nivel*'}`)
    }

    if (Texto) return m.reply(Texto)
    else { m.reply(`*『 TU NIVEL ACTUAL 』*\n\n● *Nombre :* @${m.sender.split`@`[0]}\n▢ Nivel : *${User.nivel}*\n▢ XP : *${User.exp}/${NivelXp(nivel + 1)}*\n▢ Rango : *${User.role}*\n\nTe falta *${NivelXp(nivel + 1) - Exp}* de *XP* para subir al nivel ${nivel + 1}${User.nivel > 99 ? `\n● @${m.sender.split`@`[0]} Gracias por usar este Bot!` : ''}`) }
}

export default command