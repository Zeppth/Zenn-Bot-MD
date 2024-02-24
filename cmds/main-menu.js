import { overlayImages } from '../lib/overlayImages.js'
import fs from 'fs'
let Menu = `
╭─╼I『 Zenn Bot 』I╾∘
┃
┃ ● *Usuario :* %name
┃ *Premium :* %prem
┃ *coins :* %coin
┃ *Rol : \`%rol\`*
┃ *EXP : \`%exp\`*
┠─────────────
┃ *Tiempo activo :* [ ${global.uptime || ''} ]
┃ *Version del bot :* 1.0.5
┃ ${global.owner.find(owner => owner[1] == 'Zeppth') ? '*Creador :* Zeppth' : '*Propietario :* ' + global.owner.find(owner => owner[1])} 
╰─────────────
> Este bot está en desarrollo, su apariencia final aún no está determinada. Muchas cosas cambiarán.
${readMore}
*☲ Menu de comandos*`

let MenuRandom = `╔I *「 RANDOM 」*
║╭—————————
║├ %prefix creador
║├ %prefix audios (en desarrollo)
║├ %prefix info (en desarrollo)
║├ %prefix ping 
║│
║╰┬—I *「 SubBots 」*
║╭╯
║├ %prefix serBot *(prueba)*
║├ %prefix startBot *(prueba)*
║╰—————————
╚══════════`

let MenuGrupos = `╔I *「 GRUPOS 」*
║╭—————————
║├ %prefix infogrupo
║├ %prefix reenviar *reponder a un mensaje*
║├ %prefix profilegrupo (en desarrollo)
║├ %prefix estado
║├ %prefix promote *@user*
║├ %prefix demote *@user*
║├ %prefix grupo *(Cerrar| Abrir)*
║├ %prefix ban *@user*
║├ %prefix delete *< mensaje quoted >*
║├ %prefix invocar *< opcional (mensaje) >*
║├ %prefix hidetag *< opcional (mensaje) >*
║│
║╰┬—I *「 ENCENDER/APAGAR 」*
║╭╯
║├ %prefix encender *(ajuste)*
║├ %prefix apagar *(ajuste)*
║╰—————————
╚══════════`

let MenuRpg = `╔I *「 JUEGOS RPG 」*
║╭—————————
║├ %prefix level
║├ %prefix perfil
║├ %prefix buy *<cantidad>*
║├ %prefix minar
║├ %prefix robar *@user*
║├ %prefix slot *suerte*
║├ %prefix ppt (piedra/papel/tijera)
║├ %prefix transferir (en desarrollo)
║│
║╰┬—I *「 REGISTRO 」*
║╭╯
║├ %prefix registrar *<name.edad>*
║├ %prefix nserie *numero de serie*
║├ %prefix unreg *<numero de serie>*
║╰—————————
╚══════════`

let MenuServicio = `╔I *「 SERVICIO 」*
║╭—————————
║├ %prefix mp3 (video/audio)
║├ %prefix IA (texto)
║├ %prefix sticker *<imagen/video>*
║├ %prefix pinterest (en desarrollo)
║├ %prefix imagen *(text)*
║├ %prefix google *(texto)*
║├ %prefix ytsearch *(texto)*
║├ %prefix playmp3 *(texto) <audio>*
║├ %prefix playmp4 *(texto) <video>*
║├ %prefix play *(texto) <video>*
║├ %prefix audio *(texto) <audio>*
║│
║╰┬—I *「 DESCARGAS 」*
║╭╯
║├ %prefix gitclone *<link>*
║├ %prefix tiktok *<link>*
║├ %prefix mediafire (en desarrollo)
║├ %prefix gdrive (en desarrollo)
║├ %prefix ytmp3 *<link> (máximo 5)*
║├ %prefix ytmp4 *<link> (máximo 5)*
║│
║╰┬—I *「 SAVED FILES 」*
║╭╯
║├ %prefix savefile *(reponde a un mensage)*
║├ %prefix sendfile *<ejemplo: sendfile 1>*
║├ %prefix delfile *<ejemplo: delfile 1>*
║├ %prefix mycloud
║╰—————————
╚══════════`

let MenuPropietario = `╔I *「 PROPIETARIO 」*
║╭—————————
║├ %prefix addxp *@user <cantidad>*
║├ %prefix addcoin *@user <cantidad>*
║├ %prefix addowner *@user*
║├ %prefix delowner *@user*
║├ %prefix addmoderador *@user*
║├ %prefix delmoderador *@user*
║├ %prefix addprem *@user*
║├ %prefix delprem *@user*
║├ %prefix banchat *<grupo/chat>*
║├ %prefix unbanchat *<grupo/chat>*
║├ %prefix banear *@user*
║├ %prefix desbanear *@user*
║├ %prefix banlist
║├ %prefix premlist
║├ %prefix moderadorlist
║├ %prefix ownerlist
║│
║╰┬—I *「 AVANZADO 」*
║╭╯
║├ >
║├ =>
║├ $
║╰—————————
╚══════════`

const command = {
    command: ['menu', 'help'],
    categoria: ['main']
}

command.script = async (m, { conn }) => {
    const comandos = m.data('chats', m.chat).commands
    const defaultMenu = () => {
        let menu = `${Menu}\n\n*● Comandos RPG :* ${comandos.rpg ? 'encendido' : 'apagado'}\n*● Comandos Servicio :* ${comandos.servicio ? 'encendido' : 'apagado'}\n\n${MenuRandom}\n\n${MenuGrupos}${comandos.rpg ? '\n\n' + MenuRpg : ''}${comandos.servicio ? '\n\n' + MenuServicio : ''}\n\n${MenuPropietario}`

        let text = menu.split('%prefix ').join(global.prefix)
        text = text.replace('%name', `@${m.sender.split`@`[0]}`).replace('%prem', m.isPrems ? 'Si' : 'No').replace('%coin', m.isPrems ? '∞' : m.data('users', m.sender).coin).replace('%rol', m.data('users', m.sender).role).replace('%exp', m.data('users', m.sender).exp)
        return text
    }

    const { path } = await overlayImages([m.multimedia('imagenes/logo.png'), m.multimedia('iconos/nodejs.png')], { tamano: [100, 100], localizacion: ['abajoIzquierda', 50] })

    await conn.sendMessage(m.chat, {
        image: fs.readFileSync(path),
        caption: defaultMenu(),
        contextInfo: {
            mentionedJid: [...defaultMenu().matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net'), externalAdReply: {
                title: 'Zenn Bot MD (en desarrollo)',
                body: 'Simple Bot de WhatsApp',
                thumbnailUrl: m.multimedia('imagenes/thumbnail.jpg'),
                sourceUrl: 'https://github.com/Zeppth/Zenn-Bot-MD?rgh-fork=true',
                showAdAttribution: true
            }
        }, mentions: [m.sender]
    }, { quoted: m }); m.react('📚')
}

export default command