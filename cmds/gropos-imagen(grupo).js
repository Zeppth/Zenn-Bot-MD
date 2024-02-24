import { generateProfilePicture } from '../lib/overlayImages.js'
import fs from 'fs'

const command = {
    command: ['setpp', 'setppgroup', 'profilegrupo'],
    categoria: ['grupos']
}

command.script = async (m, { conn }) => {
    if (!m.isGroup) return m.sms('group')
    if (!m.isBotAdmin) return m.sms('botAdmin')
    if (!m.isAdmin) return m.sms('admin')
    if (!m.quoted) return m.reply(`Y la imagen?`)
    const type = m.type(m.SMS().mensage)
    if (!type == 'imageMessage') return m.reply('Responda a una imagen, no se puede otro tipo de archivo')
    const media = await conn.DownloadMedia()
    if (m.args[0] == 'full') {
        var { img } = await generateProfilePicture(media)
        await conn.query({ tag: 'iq', attrs: { to: m.chat, type: 'set', xmlns: 'w:profile:picture' }, content: [{ tag: 'picture', attrs: { type: 'image' }, content: img }] })
        fs.unlinkSync(media)
        m.react(done)
    } else {
        await conn.updateProfilePicture(m.chat, { url: media })
        fs.unlinkSync(media)
        m.react(done)
    }
}

export default command
