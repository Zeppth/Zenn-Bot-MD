const command = {
    command: ['robar', 'rob'],
    categoria: ['rpg']
}

command.script = async (m, { conn }) => {
    const { robar, tiempoRobar } = global.rpg.cantidad
    let time = global.db.data.users[m.sender].lastrob + tiempoRobar
    if (new Date - global.db.data.users[m.sender].lastrob < tiempoRobar) return m.reply(`¡Hey! Espera *${msToTime(time - new Date())}* para volver a robar`)
    let who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false

    if (!who) return m.reply(`Etiqueta a alguien para robar`)
    if (!(who in global.db.data.users)) return m.reply(`El usuario no se encuentra en mi base de datos`)
    let users = global.db.data.users[who]
    let rob = Math.floor(Math.random() * robar)

    if (users.exp < rob) return m.reply(`@${who.split`@`[0]} tiene menos de *${robar} xp*`, null, { mentions: [who] })
    global.db.data.users[m.sender].exp += rob
    global.db.data.users[who].exp -= rob

    m.reply(`*『 ROBASTE 』${rob} XP* a @${who.split`@`[0]}`, null, { mentions: [who] })
    global.db.data.users[m.sender].lastrob = new Date * 1
}

export default command

function msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24)

    hours = (hours < 10) ? "0" + hours : hours
    minutes = (minutes < 10) ? "0" + minutes : minutes
    seconds = (seconds < 10) ? "0" + seconds : seconds

    return hours + " Horas " + minutes + " Minutos"
}