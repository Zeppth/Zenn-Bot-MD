const command = {
    command: ['minar', 'mine'],
    categoria: ['rpg']
}

command.script = async (m, { conn }) => {
    const tiempoEspera = global.rpg.cantidad.tiempoMinera
    let hasil = Math.floor(Math.random() * global.rpg.cantidad.mineria)
    let time = global.db.data.users[m.sender].lastmiming + tiempoEspera
    if (new Date - global.db.data.users[m.sender].lastmiming < tiempoEspera) return m.reply(`Espera *${msToTime(time - new Date())}* para regresar a minar`)
    global.db.data.users[m.sender].exp += hasil
    m.reply(`*『 🎉 / Minaste  』${hasil} XP*`)
    global.db.data.users[m.sender].lastmiming = new Date * 1
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