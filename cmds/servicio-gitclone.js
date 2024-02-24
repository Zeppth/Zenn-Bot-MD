import fetch from 'node-fetch'

const command = {
    command: ['gitclone', 'clone', 'git'],
    categoria: ['servicio']
}

command.script = async (m, { conn }) => {
    const regex = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i
    if (m.quesCoin()) return m.react('💲')
    if (!m.args[0]) m.reply('Y el link?')
    if (!regex.test(m.args[0])) m.reply(`Link incorrecto`)
    let [_, user, repo] = m.args[0].match(regex) || []
    repo = repo.replace(/.git$/, '')
    let url = `https://api.github.com/repos/${user}/${repo}/zipball`
    let filename = (await fetch(url, { method: 'HEAD' })).headers.get('content-disposition').match(/attachment; filename=(.*)/)[1]
    m.react(rwait)
    try { conn.sendMessage(m.chat, { document: { url: url }, mimetype: 'document/zip', fileName: filename }, { quoted: m }); m.react(done); m.remCoin(true) } catch { m.react(error); return }
}

export default command