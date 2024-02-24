import googleIt from 'google-it'

const command = {
    command: ['google'],
    categoria: ['servicio']
}

command.script = async (m, { conn }) => {
    if (!m.text) return m.reply(`Que quieres buscar en Google?`)
    m.react(rwait)
    let search = await googleIt({ query: m.text })
    let msg = search.map(({ title, link, snippet }) => { return `*${title}*\n_${link}_\n_${snippet}_` }).join`\n\n`
    try { await m.reply(msg); m.react(done) } catch (e) { m.react(error) }
}

export default command