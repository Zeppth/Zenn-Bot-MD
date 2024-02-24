import gis from 'g-i-s'

const command = {
    command: ['gimage', 'image', 'imagen'],
    categoria: ['servicio']
}

command.script = async (m, { conn }) => {
    if (m.quesCoin()) return m.react('💲')
    if (!m.text) return m.reply("¡Ingrese un término de búsqueda para obtener una imagen de Google!");
    m.react(rwait)

    try {
        await gis(m.text, async (error, result) => {
            if (error) { return m.reply("Se ha producido un error al buscar imágenes.") }
            if (!result || result.length === 0) { return m.reply("No se han encontrado imágenes para el término de búsqueda dado.") }
            const images = result[Math.floor(Math.random() * result.length)].url
            try { await conn.sendMessage(m.chat, { image: { url: images }, caption: `▢ *Resultado de:* ${m.text}\n▢  *Buscador: 『 Google 』*`, }, { quoted: m }); m.react(done); m.remCoin(true) } catch { m.react('❌') }
        });
    } catch { m.react(error) }
}

export default command