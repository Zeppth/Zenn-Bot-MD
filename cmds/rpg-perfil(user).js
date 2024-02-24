import { overlayImages } from '../lib/overlayImages.js'
import fs from 'fs'
import PhoneNumber from 'awesome-phonenumber'

const command = {
    command: ['perfil', 'profile'],
    categoria: ['rpg']
}

command.script = async (m, { conn }) => {
    const sender = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
    if (!(sender in global.db.data.users)) return m.reply(`El usuario no se encuentra en mi base de datos`)
    let pp = await conn.profilePictureUrl(sender, 'image').catch(_ => m.multimedia('imagenes/avatar.jpg'))
    let { coin, exp, nivel, role, registered, name, premium } = m.data('users', sender)
    let Text = `
┌───「 *PERFIL* 」
▢ *Nombres:* 
• ${registered ? name : m.name}
• @${sender.replace(/@.+/, '')}
▢ *Numero:* ${PhoneNumber('+' + sender.replace('@s.whatsapp.net', '')).getNumber('international')}
▢ *Link:* wa.me/${sender.split`@`[0]}
▢ *m.user()* : ${premium ? 'Si' : 'No'}
▢ *coins :* ${coin}
▢ *XP :* ${exp}
▢ *Nivel :* ${nivel}
▢ *Rol :* ${role}
▢ *Registrado :* ${registered ? 'Si' : 'No'}
└──────────────`.trim()

    const { path } = await overlayImages([pp, registered ? premium ? m.multimedia('iconos/usuario.png') : m.multimedia('iconos/registrado.png') : m.multimedia('iconos/usuario.png')], { tamano: '%15', localizacion: ['abajoIzquierda', 1] })

    conn.sendMessage(m.chat, { image: fs.readFileSync(path), caption: Text, contextInfo: { mentionedJid: [...Text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net'), externalAdReply: { title: registered ? name : m.name, body: 'Usuario de Zenn Bot MD', thumbnailUrl: m.multimedia('imagenes/thumbnail.jpg') } } }, { quoted: m }); m.react(done)
}

export default command