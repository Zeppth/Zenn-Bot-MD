import { fetchJson } from "../lib/simple.js"

const command = {
    command: ['tiktok', 'tt'],
    categoria: ['servicio']
}

command.script = async (m, { conn }) => {
    if (m.quesCoin()) return m.react('💲')
    if (!m.args[0]) return m.reply(`Ejemplo :\n.tiktok https://vm.tiktok.com/ZM6SuhCKy/`)
    m.react(rwait)
    var ktt = await fetchJson(`https://www.tikwm.com/api/?url=${m.text}?hd=1`)
    var p = ktt.data
    try {
        var musicatiktok = p.music ? p.music : false
        if (p.images) {
            var url = p.images
            var cptn = `*Titulo:* ${p.title}\n`
            cptn += `*Usuario:* ${p.author.nickname}\n`
            cptn += `*Reproducciones:* ${p.play_count}\n`
            cptn += `*Comentarios:* ${p.comment_count}\n`
            cptn += `*Descargas:* ${p.download_count}\n`
            cptn += `*Imagenes:* ${url.length}\n`
            cptn += `\nEnviando Medios`
            m.reply(cptn)
            for (let o = 0; o < url.length; o++) { await conn.sendMessage(m.chat, { [(/mp4/.test(url[o])) ? "video" : "image"]: { url: url[o] } }, { quoted: m }) }
            if (musicatiktok) await conn.sendMessage(m.chat, { audio: { url: musicatiktok }, mimetype: 'audio/mpeg' });
            m.react(done)
            m.remCoin(true)
        } else {
            var url = p.play
            var cptn = `*Titulo:* ${p.title}\n`
            cptn += `*Usuario:* ${p.author.nickname}\n`
            cptn += `*Reproducciones:* ${p.play_count}\n`
            cptn += `*Comentarios:* ${p.comment_count}\n`
            cptn += `*Descargas:* ${p.download_count}\n`
            cptn += `\nBy KenisawaDev`
            await conn.sendMessage(m.chat, { video: { url: url }, caption: cptn }, { quoted: m })
            if (musicatiktok) await conn.sendMessage(m.chat, { audio: { url: musicatiktok }, mimetype: 'audio/mpeg' });
            m.react(done)
            m.remCoin(true)
        }
    } catch (e) { console.log(e); m.react(error) }
}

export default command