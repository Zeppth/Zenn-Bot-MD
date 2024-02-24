const command = {
    command: ['claim', 'reclamar', 'diario'],
    categoria: ['rpg']
}

command.script = async (m, { conn }) => {
    const { claimFree, claimPrem, TiempoClaim } = global.rpg.cantidad
    const User = global.db.data.users[m.sender]
    let time = User.lastclaim + TiempoClaim
    if (new Date - User.lastclaim < TiempoClaim) return m.reply(`*Ya recogiste tu recompensa diaria*\n\n🕚 Vuelve en *${msToTime(time - new Date())}*`)
    User.exp += m.isPrems ? claimPrem : claimFree
    m.reply(`\n *『 RECOMPENSA DIARIA 』*\n\n● *Has recibido: +${m.isPrems ? claimPrem : claimFree} XP*`)
    User.lastclaim = new Date * 1
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
