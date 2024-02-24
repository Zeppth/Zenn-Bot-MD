const command = {
    command: ['buy', 'buyall', 'comprar'],
    categoria: ['rpg']
}

command.script = async (m, { conn }) => {
    const xppercoin = global.rpg.precios.coin
    let count = m.command.replace(/^buy/i, '')
    count = count ? /all/i.test(count) ? Math.floor(global.db.data.users[m.sender].exp / xppercoin) : parseInt(count) : m.args[0] ? parseInt(m.args[0]) : 1
    count = Math.max(1, count)
    if (global.db.data.users[m.sender].exp >= xppercoin * count) {
        global.db.data.users[m.sender].exp -= xppercoin * count
        global.db.data.users[m.sender].coin += count
        m.reply(`\n┏╼I『 *Comprar* 』: + ${count}©️\n┗⊱ *Gastado* : -${xppercoin * count} XP`)
    } else m.reply(`Lo siento, no tienes suficientes *XP* para comprar *${count}* coins / ©️`)
}

export default command