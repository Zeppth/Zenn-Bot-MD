import { createHash } from 'crypto'

const command = {
    command: ['verify', 'reg', 'register', 'registrar'],
    categoria: ['rpg']
}

command.script = async (m, { conn }) => {
    let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i
    const user = m.data('users', m.sender)

    if (user.registered === true) return m.reply(`Ya estás registrado\n\n¿Quiere volver a registrarse?\n\nUse este comando para eliminar su registro \n*${global.prefix}unreg* <Número de serie>`)

    if (!Reg.test(m.text)) return m.reply(`Formato incorrecto\n\n Uso del comamdo: *${global.prefix + command} nombre.edad*\nEjemplo : *${global.prefix + command}* ${m.name}.16`)

    let [_, name, splitter, age] = m.text.match(Reg)

    if (!name) return m.reply('El nombre no puede estar vacío')
    if (!age) return m.reply('La edad no puede estar vacía')
    if (name.length >= 30) return m.reply('El nombre es demasiado largo')
    age = parseInt(age)
    if (age > 100) return m.reply('Mas de 100 años, de verdad?')
    if (age < 5) return m.reply('Menos de 5 años, de verdad?')

    user.name = name.trim()
    user.age = age
    user.registered = true

    let NumeroSerie = createHash('md5').update(m.sender).digest('hex')

    m.reply(`『 *REGISTRADO* 』\n● *Nombre:* ${name}\n▢ *Edad* : ${age} años\n▢ *Numero de serie* :\n${NumeroSerie}\n\n*${prefix}help* para ver el Menu`.trim())
}

export default command