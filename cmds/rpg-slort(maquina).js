const command = {
    command: ['slot'],
    categoria: ['rpg']
}

command.script = async (m, { conn }) => {
    const { exp, nivel } = m.data('users', m.sender)
    if (exp < 300) return m.reply('Es necesario tener un mínimo de *300 XP* para poder usar este comando.')
    if (nivel == 4 || nivel < 5) return m.reply('Para utilizar este comando, es necesario que te encuentres en el nivel 5 o en uno más avanzado.')

    const frutas = ['🍎', '🍊', '🍇', '🍓', '🍒', '🍍', '🥝', '🍌']

    let rueda1 = [frutas[Math.floor(Math.random() * frutas.length)], frutas[Math.floor(Math.random() * frutas.length)], frutas[Math.floor(Math.random() * frutas.length)]];
    let rueda2 = [frutas[Math.floor(Math.random() * frutas.length)], frutas[Math.floor(Math.random() * frutas.length)], frutas[Math.floor(Math.random() * frutas.length)]];
    let rueda3 = [frutas[Math.floor(Math.random() * frutas.length)], frutas[Math.floor(Math.random() * frutas.length)], frutas[Math.floor(Math.random() * frutas.length)]];

    let texto = `🎰 ┃ *Resultado:*\n\n┏                             ┓\n   ${rueda1[0]} ┃ ${rueda2[0]} ┃ ${rueda3[0]}\n   ━━━━━━━━━━\n   ${rueda1[1]} ┃ ${rueda2[1]} ┃ ${rueda3[1]}\n   ━━━━━━━━━━\n   ${rueda1[2]} ┃ ${rueda2[2]} ┃ ${rueda3[2]}\n┗                             ┛\n\n`

    if (rueda1[1] === rueda2[1] && rueda2[1] === rueda3[1]) {
        texto += "● *¡Felicidades!* Las tres frutas del centro son iguales. *Ganaste 1000 XP*."
        m.data('users', m.sender).exp += 1000
        conn.sendMessage(m.chat, { audio: { url: m.multimedia('audios/bara.m4a') }, contextInfo: { externalAdReply: { title: `¡Felicidades! +1000 XP`, body: `Usuario de Zenn Bot MD`, thumbnailUrl: await conn.profilePictureUrl(m.sender, 'image') } }, fileName: `Bot.mp3`, mimetype: 'audio/mpeg', ptt: true }, { quoted: m })

    } else if (rueda1[1] === rueda2[1] || rueda2[1] === rueda3[1] || rueda1[1] === rueda3[1]) {
        texto += "● Dos frutas del centro son iguales. *Ganaste 500 XP*."
        m.data('users', m.sender).exp += 500
    } else {
        texto += "● Las frutas del centro son diferentes. *Perdiste 200 XP*. U.U"
        m.data('users', m.sender).exp = m.user() ? exp - 0 : exp - 200
    }

    m.reply(texto)
}

export default command