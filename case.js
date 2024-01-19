// by Zeppth
// Exporta la función sendCase que maneja los comandos

import { pinterest } from '@bochilteam/scraper'
import PhoneNumber from 'awesome-phonenumber'
import gtts from 'node-gtts';
import axios from 'axios'
import chalk from 'chalk'
import cheerio from 'cheerio'
import { exec } from 'child_process'
import { createHash } from 'crypto'
import { default as fs, watchFile, unwatchFile, unlinkSync } from 'fs'
import gis from 'g-i-s'
import { sizeFormatter } from 'human-readable'
import moment from 'moment-timezone'
import fetch from 'node-fetch'
import { cpus as _cpus, arch, freemem, hostname, platform, totalmem, type } from 'os'
import path from 'path'
import { performance } from 'perf_hooks'
import now from 'performance-now'
import util from 'util'
import yts from 'yt-search'
import './config.js'
import { generateProfilePicture, overlayImages } from './lib/overlayImages.js'
import ytdl from './lib/ytdl2.js'
import { SubBot } from './lib/subBot.js'
import { YoutTube, dlmp3, ytIdRegex } from './lib/ytdlmp.js'

const formatSize = sizeFormatter({ std: 'JEDEC', decimalPlaces: 2, keepTrailingZeroes: false, render: (literal, symbol) => `${literal} ${symbol}B` })

const readMore = String.fromCharCode(8206).repeat(850)
const rwait = '⌛'
const done = '✔️'
const error = '✖️'
const emoji = {
    publicado: '📆',
    duracion: '⏳',
    link: '🔗',
    title: '📌',
    vistas: '👀'
}
let Menu = `
╭─╼I『 Zenn Bot 』I╾∘
┃
┃ ● *Usuario :* %name
┃ *Premium :* %prem
┃ *coins :* %coin
┃ *Rol : %rol*
┠─────────────
┃ *Tiempo activo :* [ ${global.uptime || ''} ]
┃ *Version del bot :* 1.0.5
┃ *Creador :* Zeppt
┃ *wa.me/526673877887*
╰─────────────
● Este bot está en desarrollo, su apariencia final aún no está determinada. Muchas cosas cambiarán.
${readMore}
*☲ Menu de comandos*`

let MenuRandom = `╔I *「 RANDOM 」*
║╭—————————
║├ %prefix creador
║├ %prefix audios (en desarrollo)
║├ %prefix info (en desarrollo)
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
║├ %prefix buy <cantidad>
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
║├ %prefix IA (texto)
║├ %prefix sticker *<imagen/video>*
║├ %prefix pinterest (en desarrollo)
║├ %prefix imagen (text)
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

const settings = (`*LISTA DE AJUSTES*
${readMore}
*『 BIENVENIDA 』*
El bot derá la bienvenida a los 
nuevos participantes en el grupo.

*%prefix encender* bienvenida
*%prefix apagar* bienvenida
________________________
 
*『 ANTI - LINK 』*
El bot elimará al participante 
que envie un link en el grupo.

*%prefix encender* antilink
*%prefix apagar* antilink
________________________

*『 ANTI - TRABA 』*
El bot elimará al participante 
que envie un mensaje con mas 
de 4000 carácteres.

*%prefix encender* detect
*%prefix apagar* detect
________________________

*『 DETECTAR 』*
El bot detectará todo ajuste 
realizado en el grupo.

*%prefix encender* detect
*%prefix apagar* detect
________________________

*『 CMD SERVICIO 』*
Se deshabilitaran los comandos de 
servicio como descargas y busquedas.

*%prefix encender* servicio
*%prefix apagar* servicio
________________________

*『 CMD SERVICIO 』*
Se deshabilitaran los comandos
rpg y con ello el uso de coins.

*%prefix encender* RPG
*%prefix apagar* RPG
________________________

*『 USO DE ADMINS 』*
ahora el Bot solo podrá ser usado
por los administradores del grupo.

*%prefix encender* adminuse
*%prefix apagar* adminuse
________________________`)

export async function sendCase(conn, m, store, proto) {
    const data = global.db.data

    if (!m.isOwner && data.chats[m.chat].isBanned) return;
    if (!m.isROwner && data.users[m.sender].banned) return;
    if (!(m.isROwner ?? m.isOwner ?? m.isModr ?? m.isAdmin) && data.chats[m.chat].commands.adminUse) return;
    if (!(m.isROwner ?? m.isOwner ?? m.isModr) && data.settings[m.Bot].OwnerUse) return;

    const database = (object, m) => global.db.data[object][m]
    const items = (UserXp, xpNecesario) => { let _false = false; if (UserXp < xpNecesario) _false = false; else _false = true; return _false }
    const premium = (sender) => { if (!sender) return; const user = data.users[sender]; return user.premium ? true : user.modr ? true : user.owner ? true : user.rowner ? true : false }

    function quesCoin() {
        let object = false
        if (!database('chats', m.chat).commands.rpg) return;
        const usuario = database('users', m.sender)
        if (usuario.coin == 0 || usuario.coin < 1) { m.reply(`*¡Ups!* Parece que te has quedado sin coins para utilizar algunas funciones T_T. Puedes comprar más coins usando este comando:\n\n${prefix}comprar <cantidad>`); object = true } else if (usuario.coin == 4) m.reply(`*¡Atención!* Solo te quedan 3 coins. No olvides que puedes adquirir más coins utilizando el comando *${prefix}comprar <cantidad>* ¡Asegúrate de tener suficientes coins para seguir usando este Bot!`)
        return object
    }

    function remCoin(coin = 1) {
        if (!database('chats', m.chat).commands.rpg) return;
        const usuario = database('users', m.sender)
        return usuario.coin = premium(m.sender) ? usuario.coin - 0 : usuario.coin - (coin == true ? 1 : coin)
    }

    if (!(database('users', m.sender).name == m.name)) { if (!database('users', m.sender).registered) { database('users', m.sender).name = m.name } }
    if (!(database('users', m.sender).getname == m.name)) { database('users', m.sender).getname = m.name }

    if (!conn.question) { conn.question = {} }
    if (!conn.transferencia) { conn.transferencia = {} }
    if (!conn.SerBot) { conn.SerBot = {} }
    if (!conn.SubBot) { conn.SubBot = {} }

    if (conn.question[m.sender]) {
        const object = conn.question
        const { user, chat, Numeros, setTimeout } = object[m.sender]
        if (!(chat === m.chat)) return;
        if (!(user === m.sender)) return;

        if (m.body.toLowerCase().includes('no')) {
            clearTimeout(setTimeout)
            delete object[m.sender]
            return m.reply('● *Acción Cancelada ✓*')
        }

        if (m.body.toLowerCase().includes('si')) {
            for (let i = 0; i < Numeros.length; i++) { await conn.groupParticipantsUpdate(chat, [Numeros[i]], 'remove') }
            await conn.sendMessage(m.chat, { text: `Se eliminaron *${Numeros.length}* participantes ✓`, mentions: [m.sender] }, { ephemeralExpiration: 24 * 3600, quoted: { key: { participant: '0@s.whatsapp.net' }, message: { documentMessage: { title: `Acción ejecutada por\nUser : ${m.name}`, jpegThumbnail: null } } } })
            clearTimeout(setTimeout)
            delete object[m.sender]
        }
    }

    if (conn.transferencia[m.sender]) {
        const objecto = conn.transferencia
        const { User, destino, object, numero, setTimeout } = objecto[m.sender]
        if (!(m.sender == User)) return;

        if (m.body.toLowerCase().includes('no')) {
            clearTimeout(setTimeout)
            delete objecto[m.sender]
            return m.reply('● *Transferencia Cancelada ✓*')
        }

        if (m.body.toLowerCase().includes('si')) {
            if (premium(User)) console.log('@User')
            else database('users', User)[object.item] -= object.cantidad
            database('users', destino)[object.item] += object.cantidad

            m.reply(`● *Transferencia realizada ✓*\n\n*• ${object.cantidad} ${object.item}* a @${numero}`)
            clearTimeout(setTimeout)
            delete objecto[m.sender]
        }
    }

    if (conn.SerBot[m.sender]) {
        const objecto = conn.SerBot;
        const { user, chat } = objecto[m.sender];
        if (!(m.sender == user)) return;
        if (!(m.chat == chat)) return;
        const upsert = m.body.toLowerCase();
        const regex = /(\+?\d{1,4}?[-.\s]?)?(\()?(\d{1,3}?)\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g;

        switch (upsert) {
            case 'cancelar': case '3': {
                m.react(done)
                m.reply('Acción cancelada')
                clearTimeout(objecto[m.sender].setTimeout);
                delete objecto[m.sender];
            }
        }

        if (objecto[m.sender].siguiente) {
            const numeros = m.body.match(regex);
            if (!m.fromMe) {
                switch (upsert) {
                    case '1': {
                        conn.SubBot[m.sender] = { chat: m.chat, numero: '+' + m.sender.split`@`[0], opcion: '2', sender: m.sender };
                        await SubBot(conn, store, proto, user);
                        clearTimeout(objecto[m.sender].setTimeout);
                        delete objecto[m.sender];
                    } break

                    default: {
                        if (numeros) {
                            conn.SubBot[m.sender] = { chat: m.chat, numero: numeros[0].replace(/\s|-|\(|\)/g, ''), opcion: '2', sender: m.sender };
                            await SubBot(conn, store, proto, user);
                            clearTimeout(objecto[m.sender].setTimeout);
                            delete objecto[m.sender];
                        }
                    } break
                }
            }
        } else {
            switch (upsert) {
                case '1': {
                    clearTimeout(objecto[m.sender].setTimeout);
                    delete objecto[m.sender];
                    conn.SubBot[m.sender] = { chat: m.chat, numero: '', opcion: '1', sender: m.sender };
                    await SubBot(conn, store, proto, user);
                } break;

                case '2': {
                    clearTimeout(objecto[m.sender].setTimeout);
                    delete objecto[m.sender].setTimeout
                    m.reply(`Si desea utilizar su número actual (${m.sender.split`@`[0]}) como Bot, por favor, escriba *‘1’*. Si prefiere asignar un número diferente, introduzca dicho número.\n\nPor ejemplo: +529999999999`)
                    objecto[m.sender].setTimeout = setTimeout(() => (m.reply('Se acabó el tiempo, esta acción fue cancelada'), delete conn.SerBot[m.sender]), 2 * 60 * 1000);
                    objecto[m.sender].siguiente = true
                } break;
            }
        }
    }

    database('users', m.sender).exp += Math.floor(Math.random() * 5) + 1

    ////////////////////////GRUPOS
    switch (m.command) {
        case 'startbot': {
            if (m.fromMe) return;
            const text = `No tienes una sesión activa, o tu sesión fue interrumpida debido a problemas de conexión.\n\nCrea una nueva utilizando el comando *.serBot*.`
            if (!fs.existsSync('./SubBots')) return m.reply(text)
            if (fs.existsSync(`./SubBots/${m.sender}`)) {
                if (fs.existsSync(`./SubBots/${m.sender}/creds.json`)) {
                    await SubBot(conn, store, proto, m.sender, true)
                    m.reply('Conectado ✓')
                }
            } else { m.reply(text) }
        } break

        case 'stopbot': {
            if (!m.fromMe) return;
            conn.mySubBot = true
            const stopBot = (stop = false) => {
                if (!stop) return
                try { conn.ws.close() } catch { };
                console.log('Conexión cerrada')
                conn.ev.removeAllListeners();
                connect.start = false
            }
            stopBot(true)
            m.reply('Conexión detenida')
        } break

        case 'subbot': case 'serbot': {
            const creds = path.join('./SubBots', 'creds.json')
            if (fs.existsSync('./SubBots')) if (fs.existsSync(`./SubBots/${m.sender}`)) if (fs.existsSync(creds)) return m.reply('Ya hay una sesion a tu numero')

            m.reply(`*¿Cómo prefiere conectarse?*\n\n1. Código *QR.*\n2. Código de *8 dígitos.*\n\nPor favor, ingrese *1* o *2* según su preferencia.`/**Digite 3 para cancelar esta acción */)
            conn.SerBot[m.sender] = { chat: m.chat, user: m.sender, setTimeout: setTimeout(() => (m.reply('Se acabó el tiempo, esta acción fue cancelada'), delete conn.question[m.sender]), 60 * 1000) }
        } break

        case 'chat': {
            if (!m.text) return
            await conn.relayMessage(m.chat, { requestPaymentMessage: { currencyCodeIso4217: 'INR', amount1000: '1000000000000', requestFrom: '0@s.whatsapp.net', noteMessage: { extendedTextMessage: { text: m.text, contextInfo: { mentionedJid: [m.sender], externalAdReply: { showAdAttribution: true } } } } } }, {})
        } break

        case 'encender': case 'true': case 'apagar': case 'false': {
            if (!m.args[0]) return m.reply(settings.split('%prefix ').join(global.prefix))
            const chat = global.db.data.chats[m.chat]
            const smTrue = `Este ajuste ya estuvo activo en este ${m.isGroup ? 'grupo' : 'chat'}`
            const smFalse = `Este ajuste no estuvo activo en este ${m.isGroup ? 'grupo' : 'chat'}`

            if (m.command == 'encender' || m.command == 'true') {
                if (m.args[0] == 'antilink') {
                    if (!m.isGroup) return m.sms('group')
                    if (!m.isBotAdmin) return m.sms('botAdmin')
                    if (!m.isAdmin) return m.sms('admin')
                    if (chat.antiLink) return m.reply(smTrue)
                    try { chat.antiLink = true; m.react(done) } catch { m.react(error) }
                }
                else if (m.args[0] == 'bienvenida') {
                    if (!m.isGroup) return m.sms('group')
                    if (!m.isAdmin) return m.sms('admin')
                    if (chat.welcome) return m.reply(smTrue)
                    try { chat.welcome = true; m.react(done) } catch { m.react(error) }
                }
                else if (m.args[0] == 'detecte') {
                    if (!m.isGroup) return m.sms('group')
                    if (!m.isAdmin) return m.sms('admin')
                    if (chat.detecte) return m.reply(smTrue)
                    try { chat.detecte = true; m.react(done) } catch { m.react(error) }
                }
                else if (m.args[0] == 'antitraba') {
                    if (!m.isGroup) return m.sms('group')
                    if (!m.isBotAdmin) return m.sms('botAdmin')
                    if (!m.isAdmin) return m.sms('admin')
                    if (chat.antiTraba) return m.reply(smTrue)
                    try { chat.antiTraba = true; m.react(done) } catch { m.react(error) }
                }
                else if (m.args[0] == 'rpg') {
                    if (!m.isGroup) return m.sms('group')
                    if (!m.isAdmin) return m.sms('admin')
                    if (chat.commands.rpg) return m.reply(smTrue)
                    try { chat.commands.rpg = true; m.reply('El uso de coins ha sido reactivado'); m.react(done) } catch { m.react(error) }
                }
                else if (m.args[0] == 'servicio') {
                    if (!m.isGroup) return m.sms('group')
                    if (!m.isAdmin) return m.sms('admin')
                    if (chat.commands.servicio) return m.reply(smTrue)
                    try { chat.commands.servicio = true; m.react(done) } catch { m.react(error) }
                }
                else if (m.args[0] == 'adminuse') {
                    if (!m.isGroup) return m.sms('group')
                    if (!m.isAdmin) return m.sms('admin')
                    if (chat.commands.adminUse) return m.reply(smTrue)
                    try { chat.commands.adminUse = true; m.react(done) } catch { m.react(error) }
                }
                else if (m.args[0] == 'autoread') {
                    if (!m.isOwner ?? m.isROwner) return m.sms('owner')
                    if (global.db.data.settings[m.Bot].autoread) return m.reply(smTrue)
                    try { global.db.data.settings[m.Bot].autoread = true; m.react(done) } catch { m.react(error) }
                }
                else m.reply(settings.split('%prefix ').join(global.prefix))
            }

            else if (m.command == 'apagar' || m.command == 'false') {
                if (m.args[0] == 'antilink') {
                    if (!m.isGroup) return m.sms('group')
                    if (!m.isBotAdmin) return m.sms('botAdmin')
                    if (!m.isAdmin) return m.sms('admin')
                    if (!chat.antiLink) return m.reply(smFalse)
                    try { chat.antiLink = false; m.react(done) } catch { m.react(error) }
                }
                else if (m.args[0] == 'bienvenida') {
                    if (!m.isGroup) return m.sms('group')
                    if (!m.isAdmin) return m.sms('admin')
                    if (!chat.welcome) return m.reply(smFalse)
                    try { chat.welcome = false; m.react(done) } catch { m.react(error) }
                }
                else if (m.args[0] == 'detecte') {
                    if (!m.isGroup) return m.sms('group')
                    if (!m.isAdmin) return m.sms('admin')
                    if (!chat.detecte) return m.reply(smFalse)
                    try { chat.detecte = false; m.react(done) } catch { m.react(error) }
                }
                else if (m.args[0] == 'antitraba') {
                    if (!m.isGroup) return m.sms('group')
                    if (!m.isBotAdmin) return m.sms('botAdmin')
                    if (!m.isAdmin) return m.sms('admin')
                    if (!chat.antiTraba) return m.reply(smFalse)
                    try { chat.antiTraba = false; m.react(done) } catch { m.react(error) }
                }
                else if (m.args[0] == 'rpg') {
                    if (!m.isGroup) return m.sms('group')
                    if (!m.isAdmin) return m.sms('admin')
                    if (!chat.commands.rpg) return m.reply(smFalse)
                    try { chat.commands.rpg = false; m.reply('El uso de coins ha sido desactivado'); m.react(done) } catch { m.react(error) }
                }
                else if (m.args[0] == 'servicio') {
                    if (!m.isGroup) return m.sms('group')
                    if (!m.isAdmin) return m.sms('admin')
                    if (!chat.commands.servicio) return m.reply(smFalse)
                    try { chat.commands.servicio = false; m.react(done) } catch { m.react(error) }
                }
                else if (m.args[0] == 'grupos') {
                    if (!m.isGroup) return m.sms('group')
                    if (!m.isAdmin) return m.sms('admin')
                    if (!chat.commands.adminUse) return m.reply(smFalse)
                    try { chat.commands.adminUse = false; m.react(done) } catch { m.react(error) }
                }
                else if (m.args[0] == 'autoread') {
                    if (!m.isOwner ?? m.isROwner) return m.sms('owner')
                    if (!global.db.data.settings[m.Bot].autoread) return m.reply(smFalse)
                    try { global.db.data.settings[m.Bot].autoread = false; m.react(done) } catch { m.react(error) }
                }
                else m.reply(settings.split('%prefix ').join(global.prefix))
            }
        } break

        case 'setppgroup': case 'profilegrupo': case 'setpp': {
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
        } break

        case 'infogrupo': {
            if (!m.isGroup) return m.sms('group')
            let data = await conn.profilePictureUrl(m.chat, 'image').catch(_ => './multimedia/imagenes/avatar.jpg')
            let groupAdmins = m.participants.filter(p => p.admin)
            let listAdmin = groupAdmins.map((v, i) => `${i + 1}. @${v.id.split('@')[0]}`).join('\n')
            let owner = m.groupMetadata.owner || groupAdmins.find(p => p.admin === 'superadmin')?.id || m.chat.split`-`[0] + '@s.whatsapp.net'
            let sumadmin = m.participants.filter(x => x.admin === 'admin').length + m.participants.filter(x => x.admin === 'superadmin').length

            let text = `● *Nombre del grupo* : ${m.groupMetadata.subject}
▢ *Creado por* : _${'@' + owner.split('@')[0] ? '@' + owner.split('@')[0] : "Número del creador principal no encontrado"}_
▢ *Fecha de creación* : ${formatDate(m.groupMetadata.creation * 1000)}
▢ *Total de participantes* : ${m.participants.length}
▢ *Total de administradores* : ${sumadmin}
${listAdmin}

▢ *ID del grupo* : ${m.groupMetadata.id}
▢ *Descripción* : \n${readMore}\n${m.groupMetadata.desc?.toString()}`.trim()

            conn.sendMessage(m.chat, { image: { url: data }, caption: text, contextInfo: { mentionedJid: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net'), externalAdReply: { title: `${m.groupMetadata.subject}`, body: 'WhatsApp grupo', thumbnail: fs.readFileSync('./multimedia/imagenes/thumbnail.jpg'), mediaType: 1 } } }, { quoted: m })
        } break

        case 'grupo': {
            if (!m.isGroup) return m.sms('group')
            if (!m.isBotAdmin) return m.sms('botAdmin')
            if (!m.isAdmin) return m.sms('admin')
            if (!m.text) return m.reply(`Desea abrir o cerrar?\nEjemplo: .grupo abrir`)
            if (m.args[0] === 'abrir') {
                m.reply(`*GRUPO ABIERTO*`)
                await conn.groupSettingUpdate(m.chat, 'not_announcement')
            }
            else if (m.args[0] === 'cerrar') {
                m.reply(`*GRUPO CERRADO*`)
                await conn.groupSettingUpdate(m.chat, 'announcement')
            }
        } break

        case 'hidetag': case 'notificar': case 'tag': {
            if (!m.isGroup) return m.sms('group')
            if (!m.isAdmin) return m.sms('admin')
            if (!m.text) return m.reply(`*Y el texto?*`)
            conn.sendMessage(m.chat, { text: m.text ? m.text : '', mentions: m.participants.map(a => a.id) }, { quoted: m, ephemeralExpiration: 24 * 60 * 100, disappearingMessagesInChat: 24 * 60 * 100 })
        } break

        case 'reenviar': case 'reenv': {
            if (!m.quoted) return m.reply('quoted?')
            await conn.copyNForward(m.args[0] ? m.args[0] : m.chat, m.SMS())
        } break

        case 'delete': case 'del': {
            if (!m.quoted) throw false
            if (!m.isBotAdmin) return m.sms('botAdmin')
            if (!m.isAdmin) return m.sms('admin')
            let delet = m.message.extendedTextMessage.contextInfo.participant
            let bang = m.message.extendedTextMessage.contextInfo.stanzaId
            conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet } })
        } break

        case 'ban': case 'kick': {
            if (!m.isGroup) return m.sms('group')
            if (!m.isBotAdmin) return m.sms('botAdmin')
            if (!m.isAdmin) return m.sms('admin')
            if (!(m.mentionedJid[0] || m.quoted || m.text)) return m.reply(`A quien quiere eliminar?`);
            //if (!m.text) return m.reply('Este comando tiene la capacidad de eliminar a varios usuarios simultáneamente. Por favor, proporciona una lista de los usuarios que deseas eliminar, asegurándote de etiquetar a cada uno de ellos')

            if (m.quoted || m.mentionedJid[0] && !m.args[1]) {
                const user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender
                if ((global.owner.find(o => o[2])?.[0] + '@s.whatsapp.net').includes(user)) return m.reply('No puedes eliminar al creador del Bot con este comando')
                if (user.includes(m.Bot) && !m.isOwner) return m.reply('No puedes eliminar al Bot con este comando')
                await conn.groupParticipantsUpdate(m.chat, [user], 'remove')
                return m.react(done)
            }

            const numerosEncontrados = m.text.match(/\d+/g)
            let numeros = numerosEncontrados.map(numero => numero + '@s.whatsapp.net')
            if (numeros.map(Bot => Bot).includes(conn.user.jid)) return m.reply('El número asociado al bot no debe incluirse en la lista de usuarios a eliminar.')

            conn.question[m.sender] = {
                user: m.sender,
                chat: m.chat,
                Numeros: numeros,
                setTimeout: setTimeout(() => (m.reply('Se acabó el tiempo, esta acción fue cancelada'), delete conn.question[m.sender]), 60 * 1000)
            }

            m.reply(`¿Confirma que desea eliminar a ${numeros.length} usuarios?\n\nDispone de *60* segundos para tomar una decisión. Si está de acuerdo con esta acción, responda con un ‘sí’. En caso contrario, puede cancelar esta acción respondiendo con un ‘no’.`.trim())
        } break

        /*case 'ban': case 'kick': {
            if (!m.isGroup) return m.sms('group')
            if (!m.isBotAdmin) return m.sms('botAdmin')
            if (!m.isAdmin) return m.sms('admin')
            if (!(m.mentionedJid[0] || m.quoted)) return m.reply(`A quien quiere eliminar?`);
            if (m.mentionedJid.includes(conn.user.jid)) return;
            const user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender;
            await conn.groupParticipantsUpdate(m.chat, [user], 'remove')
        } break*/

        case 'promote': case 'demote': case 'darpoder': case 'quitarpoder': case 'addadmin': case 'deladmin': {
            if (!m.isGroup) return m.sms('group')
            if (!m.isBotAdmin) return m.sms('botAdmin')
            if (!m.isAdmin) return m.sms('admin')
            let who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
            const User = who.slice(0, -15)
            if (!isNaN(User && m.mentionedJid[0] && m.text)) return m.reply('Etiqueta o menciona al usuario')

            if (m.command == 'promote' || m.command == 'addadmin' || m.command == 'darpoder') { try { await conn.groupParticipantsUpdate(m.chat, [who], 'promote'); m.react(done) } catch { await m.react(error) } }

            else if (m.command == 'demote' || m.command == 'deladmin' || m.command == 'quitarpoder') { try { await conn.groupParticipantsUpdate(m.chat, [who], 'demote'); m.react(done) } catch { await m.react(error) } }

        } break

        case 'tagall': case 'invocar': case 'todos': {
            if (!m.isGroup) return m.sms('group')
            if (!m.isAdmin) return m.sms('admin')
            const pesan = m.text
            const oi = `● Mensaje: ${pesan}`;
            let teks = `▢ ━〔 INVOCACIÓN 〕━ ▢\n\n`
            teks += `${oi}\n\n`
            for (let mem of m.participants) {
                teks += `~> @${mem.id.split('@')[0]}\n`
            }
            conn.sendMessage(m.chat, { text: teks, mentions: m.participants.map(a => a.id) }, { quoted: m, ephemeralExpiration: 24 * 60 * 100, disappearingMessagesInChat: 24 * 60 * 100 })
        } break

        case 'estado': {
            const { isBanned, welcome, antiLink, antiTraba, commands } = database('chats', m.chat)
            let text = (`• ${antiTraba ? '( ✓ )' : '( ✗ )'} : Anti-Traba
• ${isBanned ? '( ✓ )' : '( ✗ )'} : Baneado
• ${welcome ? '( ✓ )' : '( ✗ )'} : Bienvenida
• ${antiLink ? '( ✓ )' : '( ✗ )'} : Anti-Link
• ${commands.rpg ? '( ✗ )' : '( ✓ )'} : comandos rpg
• ${commands.servicio ? '( ✗ )' : '( ✓ )'} : comandos de descargas`).trim()
            conn.sendMessage(m.chat, { text: text, mentions: [m.sender] }, { ephemeralExpiration: 24 * 3600, quoted: { key: { participant: '0@s.whatsapp.net' }, message: { documentMessage: { title: `[ ESTADO BOT ]`, jpegThumbnail: fs.readFileSync('./multimedia/imagenes/thumbnail.jpg') } } } })
        } break
    }

    ////////////////////////DESCARGAS
    if (database('chats', m.chat).commands.servicio) {
        switch (m.command) {
            case 'mediafire': case 'mf': {
                if (!m.args[0]) return m.reply('Y el link?')
                const res = await mediafireDl(m.args[0]);
                const { name, size, date, mime, link } = res;
                m.react(rwait)
                const caption = `『 MEDIAFIRE / VaryonBot 』
      
*▢ Nombre:*  ${name}
*▢ Tamaño:* ${size}
*▢ Extension:* ${mime}

Enviando archivo${readMore}`.trim();
                await m.reply(caption);
                await conn.sendMessage(m.chat, { document: { url: (await conn.getFile(link).data).catch(e => conn.getFile(link).data) }, mimetype: 'video/' + mime, fileName: name }, { quoted: m }); m.react(done)
            } break

            case 'play': case 'yta': case 'playmp3': case 'audio': case 'ytv': case 'playmp4': case 'video': {
                if (quesCoin()) return m.react('💲')

                if (!m.text) return m.reply(`*Ingresa el título de una canción*`)
                const vid = (await yts(m.text)).all[0]
                if (!vid) return m.reply(`Sin resultados`)
                const { title, description, thumbnail, videoId, timestamp, views, ago, url } = vid
                const play = `▢ ${emoji.title} *Titulo :* ${title}\n▢ ${emoji.publicado} *Publicado :* ${ago}\n▢ ${emoji.duracion} *Duración :* ${timestamp}\n▢ ${emoji.vistas} *Vistas :* ${views}\n@Cargando${readMore}\n▢ 🧾 *Descripcion :* ${description}`.trim()
                const _Url = `https://www.youtube.com/watch?v=${videoId}`

                async function sendMsge(text) {
                    await new Promise(async (resolve, reject) => { try { await conn.sendMessage(m.chat, { text: play.replace('@Cargando', text), contextInfo: { externalAdReply: { title: title, body: description, thumbnailUrl: thumbnail, mediaType: 1, renderLargerThumbnail: true } } }, { quoted: m }); resolve() } catch (error) { console.error(error); await conn.sendMessage(m.chat, { text: play.replace('@Cargando', text), contextInfo: { externalAdReply: { title: title, body: description, thumbnailUrl: thumbnail, mediaType: 1, renderLargerThumbnail: true } } }, { quoted: m }); reject(error) } });
                }

                if (m.command == 'playmp3' || m.command == 'yta' || m.command == 'audio') {
                    try {
                        await sendMsge('Cargando audio'); m.react(rwait)
                        const mp3 = await dlmp3(_Url)
                        conn.sendMessage(m.chat, { audio: fs.readFileSync(mp3.path), contextInfo: { externalAdReply: { title: title, body: mp3.info.author, previewType: "PHOTO", thumbnail: mp3.info.thumbnail } }, mimetype: "audio/mp4", fileName: `${title}.mp3` }, { quoted: m }); m.react(done); remCoin(true); fs.unlinkSync(mp3.path)
                    } catch (e) { m.react(error); return }
                }

                else if (m.command == 'play' || m.command == 'playmp4' || m.command == 'ytv' || m.command == 'video') {
                    try {
                        await sendMsge('Cargando video'); m.react(rwait)
                        const { title, thumb, Date, duration, channel, quality, contentLength, description, videoUrl } = await ytdl.mp4(_Url)
                        let cap = `*『 DV-YouTube 』*\n\n▢ *Título:* ${title}\n▢ *Calidad:* ${quality}`.trim()
                        await conn.sendMessage(m.chat, { document: { url: videoUrl }, caption: cap, mimetype: 'video/mp4', fileName: title + `.mp4` }, { quoted: m }); m.react(done); remCoin(true)
                    } catch { m.react(error); return }
                }

            } break

            case 'ytmp4': case 'ytmp3': {
                if (quesCoin()) return m.react('💲')
                if (!m.args[0]) return m.reply('*Ingrese el comando junto al link de YouTube*')
                if (!ytIdRegex.test(m.args[0])) return m.reply(`Link incorrecto`)
                if (m.command == 'ytmp3') {
                    const urls = YoutTube(m.text)
                    for (let i = 0; i < urls.length; i++) {
                        try {
                            const mp3 = await dlmp3(urls[i])
                            conn.sendMessage(m.chat, { audio: fs.readFileSync(mp3.path), contextInfo: { externalAdReply: { title: mp3.info.title, body: mp3.info.author, previewType: "PHOTO", thumbnail: mp3.info.thumbnail } }, mimetype: "audio/mp4", fileName: `${mp3.info.title}.mp3` }, { quoted: m }); m.react(done); remCoin(true); fs.unlinkSync(mp3.path)
                        } catch { m.react(error) }
                    }
                } else
                    if (m.command == 'ytmp4') {
                        const urls = YoutTube(m.text)
                        for (let i = 0; i < urls.length; i++) {
                            try {
                                const { title, thumb, Date, duration, channel, quality, contentLength, description, videoUrl } = await ytdl.mp4(urls[i])
                                let cap = `*『 DV-YouTube 』*\n\n▢ *Título:* ${title}\n▢ *Calidad:* ${quality}`.trim()
                                await conn.sendMessage(m.chat, { document: { url: videoUrl }, caption: cap, mimetype: 'video/mp4', fileName: title + `.mp4` }, { quoted: m }); m.react(done); remCoin(true);
                            } catch { m.react(error) }
                        }
                    }

            } break

            case 'yts': case 'ytsearch': {
                if (quesCoin()) return m.react('💲')
                if (!m.text) return m.reply('Que quieres que busque en YouTube?')
                m.react(rwait)
                const vid = (await yts(m.text)).all[0]
                const { thumbnail } = vid
                let results = await yts(m.text)
                let teks = results.all.map(v => {
                    switch (v.type) {
                        case 'video': return `▢ ${v.title}\n▢ *Link* : ${v.url}\n▢ *Duración* : ${v.timestamp}\n▢ *Subido :* ${v.ago}\n▢ *Vistas:* ${v.views}`.trim()

                        case 'canal': return `▢ *${v.name}* (${v.url})\n▢ ${v.subCountLabel} (${v.subCount}) Suscribirse\n▢ ${v.videoCount} videos`.trim()
                    }
                }).filter(v => v).join('\n\n________________________\n\n')
                await conn.sendMessage(m.chat, { text: readMore + teks, contextInfo: { externalAdReply: { title: 'YouTube - Search', thumbnailUrl: thumbnail, mediaType: 1, renderLargerThumbnail: true } } }, { quoted: m }); m.react(done); remCoin(true)
            } break

            case 'tiktok': case 'tt': {
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
                        if (musicatiktok) conn.sendMessage(m.chat, { audio: { url: musicatiktok }, mimetype: 'audio/mpeg' }); m.react(done)
                        remCoin(true)
                    } else {
                        var url = p.play
                        var cptn = `*Titulo:* ${p.title}\n`
                        cptn += `*Usuario:* ${p.author.nickname}\n`
                        cptn += `*Reproducciones:* ${p.play_count}\n`
                        cptn += `*Comentarios:* ${p.comment_count}\n`
                        cptn += `*Descargas:* ${p.download_count}\n`
                        cptn += `\nBy KenisawaDev`
                        await conn.sendMessage(m.chat, { video: { url: url }, caption: cptn }, { quoted: m })
                        if (musicatiktok) conn.sendMessage(m.chat, { audio: { url: musicatiktok }, mimetype: 'audio/mpeg' }); m.react(done)
                        remCoin(true)
                    }
                } catch (e) { console.log(e); m.react(error) }
            } break

            case 'gitclone': case 'git': case 'clone': {
                const regex = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i
                if (quesCoin()) return m.react('💲')

                if (!m.args[0]) m.reply('Y el link?')
                if (!regex.test(m.args[0])) m.reply(`Link incorrecto`)
                let [_, user, repo] = m.args[0].match(regex) || []
                repo = repo.replace(/.git$/, '')
                let url = `https://api.github.com/repos/${user}/${repo}/zipball`
                let filename = (await fetch(url, { method: 'HEAD' })).headers.get('content-disposition').match(/attachment; filename=(.*)/)[1]
                m.react(rwait)
                try { conn.sendMessage(m.chat, { document: { url: url }, mimetype: 'document/zip', fileName: filename }, { quoted: m }); m.react(done); remCoin(true) } catch { m.react(error); return }
            } break

            //https://drive.google.com/file/d/1dmHlx1WTbH5yZoNa_ln325q5dxLn1QHU/view*
            case 'gdrive': {
                if (quesCoin()) return m.react('💲')
                if (!m.args[0]) return m.reply(`Y el link?`)
                try { m.react(rwait); await GDriveDl(args[0]).then(async (res) => { if (!res) return m.reply(res); conn.sendMessage(m.chat, { document: { url: res.downloadUrl }, mimetype: res.mimetype, fileName: `${res}` }, { quoted: m }); remCoin(true) }) } catch (e) { m.react(error) }
            } break

            case 'pinterest': case 'pin': {
                if (!m.text) return m.reply(`${pushname} Please provide a search term!`);
                m.react(rwait)
                const pintst = await pinterest(m.text)
                const results = []
                const Numero = 5
                for (let i = 0; i < Numero && i < pintst.length; i++) { results.push(pintst[Math.floor(Math.random() * pintst.length)]) }
                for (let i = 0; i < results.length; i++) { conn.sendMessage(m.chat, { image: { url: results[i] } }, { quoted: m }) }
            } break

            case 'gimage': case 'image': case 'imagen': {
                if (quesCoin()) return m.react('💲')

                if (!m.text) return m.reply("¡Ingrese un término de búsqueda para obtener una imagen de Google!");
                m.react(rwait)

                try {
                    await gis(m.text, async (error, result) => {
                        if (error) { return m.reply("Se ha producido un error al buscar imágenes.") }
                        if (!result || result.length === 0) { return m.reply("No se han encontrado imágenes para el término de búsqueda dado.") }
                        const images = result[Math.floor(Math.random() * result.length)].url
                        try { conn.sendMessage(m.chat, { image: { url: images }, caption: `▢ *Resultado de:* ${m.text}\n▢  *Buscador: 『 Google 』*`, }, { quoted: m }); m.react(done); remCoin(true) } catch { m.react('❌') }

                    });
                } catch { m.react(error) }
            } break

            case 'chatgpt': case 'gpt': case 'ia': case 'IA': {
                if (quesCoin()) return m.react('💲')
                if (!m.text) return m.reply('Y el texto?')
                m.react('\uD83D\uDCAC')
                try {
                    await conn.sendPresenceUpdate('composing', m.chat)
                    const OpenAI = await fetchJson(`https://aemt.me/openai?text=${m.text}`)
                    var Texto = OpenAI.result
                    await m.reply(Texto); remCoin(true)
                } catch { m.react(error) }
            } break

            case 'voz': {
                if (!m.text) return m.reply('Y el texto?')
                const audio = await tts(m.text);
                await conn.sendMessage(m.chat, { audio: audio, fileName: 'error.mp3', mimetype: 'audio/mpeg', ptt: true }, { quoted: m });
            } break

            case 'cleancloud': case 'cloudclean': case 'delfiles': case 'delfile': case 'mycloud': case 'editfile': case 'guardar': case 'savefile': case 'save': case 'savecloud': case 'sendfile': case 'listfile': {
                const saveFiles = global.db.data.cloud[m.sender].saveFiles
                const sms = m.SMS()

                const nLimite = m.isROwner ? 99 : m.isOwner ? 49 : m.isPrems ? 19 : 4
                const sLimite = m.isROwner ? '100' : m.isOwner ? '20' : m.isPrems ? '10' : '5'

                const mtype = ['viewOnceMessageV2']
                if (m.command == 'guardar' || m.command == 'save' || m.command == 'savecloud' || m.command == 'savefile') {
                    if (saveFiles.length > nLimite) return m.reply(`El limite es de ${sLimite} archivos por usuario.`)
                    let istrue = true
                    mtype.forEach(elemento => {
                        const filesave = { fileName: m.text ? m.text : m.type(sms.message) == 'documentMessage' ? sms.message.documentMessage.fileName : 'My Archive', fecha: moment().tz(Intl.DateTimeFormat().resolvedOptions().timeZone).format('DD/MM/YY HH:mm:ss'), fileMessage: sms }
                        if (m.type(sms.message) == elemento) istrue = false
                        if (istrue) { saveFiles.push(filesave); m.react(done); remCoin(true) } else { m.reply('El archivo no coincide con los formatos admitidos.'); m.react(error) }
                    })
                }

                const texto = (`● *User:* @${m.sender.split('@')[0]}\n▢ *Uso:* ${saveFiles.length}/${sLimite}${saveFiles[0] ? '\n\n' + saveFiles.map((objeto, indice) => `${indice + 1} ● *Name file :* ${objeto.fileName}\n▢ *Tipo :* ${m.type(objeto.fileMessage.message).split('Message').join('')}\n▢ *Ultima modificacion :* ${objeto.fecha}`).join('\n\n') : ''}`)

                if (m.command == 'listfile' || m.command == 'mycloud') return conn.sendMessage(m.chat, { text: saveFiles[0] ? `${texto}\n\n${readMore}● @${m.sender.split('@')[0]} puedes utilizar el comando "senfile" y, utilizando el orden en el que se guardaron, especificar el numero correspondiente para enviarlo.\n\n• *Ejemplo:* sendfile 1` : `${texto}\n\n sin archivos \n\nResponda o envie un archivo con el comando *.savefile* para guardarlo.`, contextInfo: { mentionedJid: [...texto.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net') } }, { quoted: m })

                if (m.command == 'sendfile') {
                    const regex = /\b(10|[1-9])\b/
                    if (!m.text) return m.reply(`Tienes ${saveFiles.length}/${sLimite}`)
                    const numero = m.text.match(regex);
                    if (!numero) return;
                    const indice = parseInt(numero[0], 10)
                    if (!isNaN(indice) && indice >= 1 && indice <= 10) {
                        const file = saveFiles[indice - 1].fileMessage
                        conn.copyNForward(m.chat, file)
                    } else { m.react(error) }
                }
                if (m.command == 'cleancloud' || m.command == 'cloudclean' || m.command == 'delfiles') {
                    try { saveFiles.splice(0, saveFiles.length); m.react('🗑') } catch { m.react(error) }
                }

                if (m.command == 'delfile') {
                    const regex = /\b(10|[1-9])\b/
                    if (!m.text) return m.reply(`Tienes ${saveFiles.length}/${sLimite}`)
                    const numero = m.text.match(regex);
                    if (!numero) return;
                    const indice = parseInt(numero[0], 10)
                    if (!isNaN(indice) && indice >= 1 && indice <= 10) { saveFiles.splice(indice - 1, 1); m.react(done) } else { m.reply('Índice fuera de rango o inválido.') }
                }
                if (m.command == 'editfile') {
                    let [array, fileName] = m.text.split`|`
                    const regex = /\b(10|[1-9])\b/
                    if (!array) return m.reply(`Separa el numero y el nuevo nombre con | \n*Ejemplo:* .editfile 1 | My archive`)
                    if (!fileName) return m.reply(`Separa el numero y el nuevo nombre con | \n*Ejemplo:* .editfile 1 | My archive`)
                    const numero = array.match(regex);
                    if (!numero) return;
                    const indice = parseInt(numero[0], 10)
                    if (!isNaN(indice) && indice >= 1 && indice <= 10) {
                        const mensage = saveFiles[indice - 1].fileMessage.message
                        try {
                            saveFiles[indice - 1].fileName = fileName
                            saveFiles[indice - 1].fecha = moment().tz(Intl.DateTimeFormat().resolvedOptions().timeZone).format('DD/MM/YY HH:mm:ss')
                            if (m.type(mensage) == 'documentMessage') {
                                const filename = mensage.documentMessage.fileName
                                const Extension = path.extname(filename)
                                saveFiles[indice - 1].fileMessage.message.documentMessage.fileName = fileName + Extension;
                                m.react(done)
                            }
                            m.react(done)
                        } catch { m.react(error) }
                    } else { m.reply('Índice fuera de rango o inválido.') }
                }
            } break

            case 'sticker': case 's': {
                const smsg = m.type(m.SMS().message)
                if (quesCoin()) return m.react('💲')

                if (smsg == 'imageMessage') {
                    let media = await conn.download()
                    await conn.sendImageAsSticker(m.chat, media, m, { packname: m.args[0] || m.name || 'null', author: 'ZN' }); remCoin(true)
                } else if (smsg == 'videoMessage') {
                    if (m.SMS().message.seconds > 12) return m.reply('Máximo 10 segundos!')
                    let media = await conn.download()
                    conn.sendVideoAsSticker(m.chat, media, m, { packname: m.args[0] || m.name || 'null', author: 'ZN' }); remCoin(true)
                } else {
                    m.reply(`Responde o envía un video/imagen utilizando lo siguiente comando: ${global.prefix + m.command}\nDuración del video: 1-9 segundos`)
                }
            } break
        }
    }

    ////////////////////////RPG
    if (database('chats', m.chat).commands.rpg) {
        switch (m.command) {
            case 'level': case 'nivel': case 'subirnivel': case 'lvl': case 'levelup': {
                if (!(m.sender in global.db.data.users)) return m.reply(`No estas en mi base de datos`)
                const User = database('users', m.sender)
                let nivel = User.nivel
                let Exp = User.exp
                const NivelXp = (level) => { return level * global.rpg.precios.nivel }
                let Texto = ''
                while (Exp >= NivelXp(nivel + 1)) {
                    nivel += 1
                    const ExpB = NivelXp(nivel) * 0.01
                    const Role = global.rpg.role.find(r => r.nivel === (nivel > 99 ? 100 : nivel))
                    User.nivel = nivel
                    User.role = Role ? Role.name : ''
                    User.exp = premium(m.sender) ? User.exp - 0 : items(User.exp, ExpB) ? User.exp - ExpB : 500
                    Texto = (`*『 SUBES DE LEVEL 』*\n\n● *Nombre :* @${m.sender.split`@`[0]}\n▢ Nivel : *${nivel}*\n▢ Rango : *${User.role}*\n - ${ExpB} *XP*\n${User.nivel > 99 ? `\n● @${m.sender.split`@`[0]} Gracias por usar este Bot!` : '*Cuanto más interactúes con los bots, mayor será tu nivel*'}`)
                }

                if (Texto) return m.reply(Texto)
                else { m.reply(`*『 TU NIVEL ACTUAL 』*\n\n● *Nombre :* @${m.sender.split`@`[0]}\n▢ Nivel : *${User.nivel}*\n▢ XP : *${User.exp}/${NivelXp(nivel + 1)}*\n▢ Rango : *${User.role}*\n\nTe falta *${NivelXp(nivel + 1) - Exp}* de *XP* para subir al nivel ${nivel + 1}${User.nivel > 99 ? `\n● @${m.sender.split`@`[0]} Gracias por usar este Bot!` : ''}`) }
            } break

            case 'minar': case 'mine': {
                const tiempoEspera = global.rpg.cantidad.tiempoMinera
                let hasil = Math.floor(Math.random() * global.rpg.cantidad.mineria)
                let time = global.db.data.users[m.sender].lastmiming + tiempoEspera
                if (new Date - global.db.data.users[m.sender].lastmiming < tiempoEspera) return m.reply(`Espera *${msToTime(time - new Date())}* para regresar a minar`)
                global.db.data.users[m.sender].exp += hasil
                m.reply(`*『 🎉 / Minaste  』${hasil} XP*`)
                global.db.data.users[m.sender].lastmiming = new Date * 1
            } break

            case 'buy': case 'buyall': case 'comprar': {
                const xppercoin = global.rpg.precios.coin
                let count = m.command.replace(/^buy/i, '')
                count = count ? /all/i.test(count) ? Math.floor(global.db.data.users[m.sender].exp / xppercoin) : parseInt(count) : m.args[0] ? parseInt(m.args[0]) : 1
                count = Math.max(1, count)
                if (global.db.data.users[m.sender].exp >= xppercoin * count) {
                    global.db.data.users[m.sender].exp -= xppercoin * count
                    global.db.data.users[m.sender].coin += count
                    m.reply(`\n┏╼I『 *Comprar* 』: + ${count}©️\n┗⊱ *Gastado* : -${xppercoin * count} XP`)
                } else m.reply(`Lo siento, no tienes suficientes *XP* para comprar *${count}* coins / ©️`)

            } break

            case 'robar': case 'rob': {
                const { robar, tiempoRobar } = global.rpg.cantidad
                let time = global.db.data.users[m.sender].lastrob + tiempoRobar
                if (new Date - global.db.data.users[m.sender].lastrob < tiempoRobar) return m.reply(`¡Hey! Espera *${msToTime(time - new Date())}* para volver a robar`)
                let who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false

                if (!who) return m.reply(`Etiqueta a alguien para robar`)
                if (!(who in global.db.data.users)) return m.reply(`El usuario no se encuentra en mi base de datos`)
                let users = global.db.data.users[who]
                let rob = Math.floor(Math.random() * robar)

                if (users.exp < rob) return m.reply(`@${who.split`@`[0]} tiene menos de *${robar} xp*`, null, { mentions: [who] })
                global.db.data.users[m.sender].exp += rob
                global.db.data.users[who].exp -= rob

                m.reply(`*『 ROBASTE 』${rob} XP* a @${who.split`@`[0]}`, null, { mentions: [who] })
                global.db.data.users[m.sender].lastrob = new Date * 1
            } break

            case 'bal': case 'coins': case 'coin': case 'balance': {
                let who = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
                let user = global.db.data.users[who]
                if (!(who in global.db.data.users)) return m.reply(`El usuario no se encuentra en mi base de datos`)
                m.reply(`\n*『 BALANCE 』*\n● *Nombre* : @${who.split('@')[0]}\n▢ *coins* : ${m.isPrems ? '∞' : user.coin}\n▢ *nivel* : ${user.nivel}\n▢ *Rol* : ${user.role}\n▢ *XP* : Total ${user.exp}\n\n*NOTA :* Puedes comprar ©️ coins usando el comando\n*${global.prefix}buy < cantidad >*`)
            } break

            case 'perfil': case 'profile': {
                const sender = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
                if (!(sender in global.db.data.users)) return m.reply(`El usuario no se encuentra en mi base de datos`)
                let pp = await conn.profilePictureUrl(sender, 'image').catch(_ => './multimedia/imagenes/avatar.jpg')
                let { coin, exp, nivel, role, registered, name } = database('users', m.sender)
                let Text = `
┌───「 *PERFIL* 」
▢ *Nombres:* 
• ${registered ? name : m.name}
• @${sender.replace(/@.+/, '')}
▢ *Numero:* ${PhoneNumber('+' + sender.replace('@s.whatsapp.net', '')).getNumber('international')}
▢ *Link:* wa.me/${sender.split`@`[0]}
▢ *Premium* : ${m.isPrems ? 'Si' : 'No'}
▢ *coins :* ${coin}
▢ *XP :* ${exp}
▢ *Nivel :* ${nivel}
▢ *Rol :* ${role}
▢ *Registrado :* ${registered ? 'Si' : 'No'}
└──────────────`.trim()

                const { path } = await overlayImages([pp, registered ? m.isPrems ? './multimedia/iconos/premium.png' : './multimedia/iconos/registrado.png' : './multimedia/iconos/usuario.png'], { tamano: '%15', localizacion: ['abajoIzquierda', 1] })

                conn.sendMessage(m.chat, { image: fs.readFileSync(path), caption: Text, contextInfo: { mentionedJid: [...Text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net'), externalAdReply: { title: registered ? name : m.name, body: 'Usuario de Zenn Bot MD', thumbnail: fs.readFileSync('./multimedia/imagenes/thumbnail.jpg') } } }, { quoted: m }); m.react(done)
            } break

            case 'diario': case 'claim': case 'reclamar': {
                const { claimFree, claimPrem, TiempoClaim } = global.rpg.cantidad
                const User = global.db.data.users[m.sender]
                let time = User.lastclaim + TiempoClaim
                if (new Date - User.lastclaim < TiempoClaim) return m.reply(`*Ya recogiste tu recompensa diaria*\n\n🕚 Vuelve en *${msToTime(time - new Date())}*`)
                User.exp += m.isPrems ? claimPrem : claimFree
                m.reply(`\n *『 RECOMPENSA DIARIA 』*\n\n● *Has recibido: +${m.isPrems ? claimPrem : claimFree} XP*`)
                User.lastclaim = new Date * 1
            } break

            case 'slot': {
                const { exp, nivel } = database('users', m.sender)
                if (exp < 300) return m.reply('Es necesario tener un mínimo de *300 XP* para poder usar este comando.')
                if (nivel == 4 || nivel < 5) return m.reply('Para utilizar este comando, es necesario que te encuentres en el nivel 5 o en uno más avanzado.')

                const frutas = ['🍎', '🍊', '🍇', '🍓', '🍒', '🍍', '🥝', '🍌']

                let rueda1 = [frutas[Math.floor(Math.random() * frutas.length)], frutas[Math.floor(Math.random() * frutas.length)], frutas[Math.floor(Math.random() * frutas.length)]];
                let rueda2 = [frutas[Math.floor(Math.random() * frutas.length)], frutas[Math.floor(Math.random() * frutas.length)], frutas[Math.floor(Math.random() * frutas.length)]];
                let rueda3 = [frutas[Math.floor(Math.random() * frutas.length)], frutas[Math.floor(Math.random() * frutas.length)], frutas[Math.floor(Math.random() * frutas.length)]];

                let texto = `🎰 ┃ *Resultado:*\n\n┏                             ┓\n   ${rueda1[0]} ┃ ${rueda2[0]} ┃ ${rueda3[0]}\n   ━━━━━━━━━━\n   ${rueda1[1]} ┃ ${rueda2[1]} ┃ ${rueda3[1]}\n   ━━━━━━━━━━\n   ${rueda1[2]} ┃ ${rueda2[2]} ┃ ${rueda3[2]}\n┗                             ┛\n\n`

                if (rueda1[1] === rueda2[1] && rueda2[1] === rueda3[1]) {
                    texto += "● *¡Felicidades!* Las tres frutas del centro son iguales. *Ganaste 1000 XP*."
                    database('users', m.sender).exp += 1000
                    conn.sendMessage(m.chat, { audio: fs.readFileSync('./multimedia/audios/bara.m4a'), contextInfo: { externalAdReply: { title: `¡Felicidades! +1000 XP`, body: `Usuario de Zenn Bot MD`, thumbnailUrl: await conn.profilePictureUrl(m.sender, 'image') } }, fileName: `Bot.mp3`, mimetype: 'audio/mpeg', ptt: true }, { quoted: m })

                } else if (rueda1[1] === rueda2[1] || rueda2[1] === rueda3[1] || rueda1[1] === rueda3[1]) {
                    texto += "● Dos frutas del centro son iguales. *Ganaste 500 XP*."
                    database('users', m.sender).exp += 500
                } else {
                    texto += "● Las frutas del centro son diferentes. *Perdiste 200 XP*. U.U"
                    database('users', m.sender).exp = premium(m.sender) ? exp - 0 : exp - 200
                }

                m.reply(texto)
            } break

            case 'ppt': {
                const User = database('users', m.sender)
                const Empate = 100
                const ganar = 300
                const perder = 200
                if (User.exp < perder) return m.reply(`Es necesario tener un mínimo de *${perder} XP* para poder usar este comando.`)
                if (!m.text) m.reply(`Seleccione piedra/papel/tijera\n\nEjemplo : *${global.prefix + m.command}* papel`)

                const item = ['piedra', 'papel', 'tijera']
                const randItem = item[Math.floor(Math.random() * (item.length))]

                if (randItem == m.text) {
                    User.exp += Empate
                    m.reply(`▢ *Empate*\n\n‣ Tú : ${m.text}\n‣ Bot : ${randItem}\n\n🎁 Puntos *+${Empate} XP*`)
                } else if (m.text == 'piedra') {
                    if (randItem == 'tijera') {
                        User.exp += ganar
                        m.reply(`▢ *Ganaste* 🎊\n\n‣ Tú : ${m.text}\n‣ Bot : ${randItem}\n\n🎁 Puntos *+${ganar} XP*`)
                    } else {
                        User.exp = premium(m.sender) ? User.exp - 0 : items(User.exp, perder) ? User.exp - perder : 0
                        m.reply(`▢ *Perdiste*\n\n‣ Tú : ${m.text}\n‣ Bot : ${randItem}\n\n Puntos *-${perder} XP*`)
                    }
                } else if (m.text == 'tijera') {
                    if (randItem == 'papel') {
                        User.exp += ganar
                        m.reply(`▢ *Ganaste* 🎊\n\n‣ Tú : ${m.text}\n‣ Bot : ${randItem}\n\n🎁 Puntos *+${ganar} XP*`)
                    } else {
                        User.exp = premium(m.sender) ? User.exp - 0 : items(User.exp, perder) ? User.exp - perder : 0
                        m.reply(`▢ *Perdiste*\n\n‣ Tú : ${m.text}\n‣ Bot : ${randItem}\n\nPuntos *-${perder} XP*`)
                    }
                } else if (m.text == 'papel') {
                    if (randItem == 'piedra') {
                        User.exp += ganar
                        m.reply(`▢ *Ganaste* 🎊\n\n‣ Tú : ${m.text}\n‣ Bot : ${randItem}\n\n🎁 Puntos *+${ganar} XP*`)
                    } else {
                        User.exp = premium(m.sender) ? User.exp - 0 : items(User.exp, perder) ? User.exp - perder : 0
                        m.reply(`▢ *Perdiste*\n\n‣ Tú : ${m.text}\n‣ Bot : ${randItem}\n\nPuntos *-${perder} XP*`)
                    }
                } else { m.reply(`Seleccione piedra/papel/tijera\n\nEjemplo : *${global.prefix + m.command}* papel`) }
            } break

            case 'transferir': {
                if (!m.text) return m.reply(`• Para utilizar el comando cada parte de este debe estar separada por “|”. Espesifica el item (ejemplo coin, xp), la cantidad y el usuario de destino. transferir [ item ] | [ cantidad ] | [ destino ].\n\n• Ejemplo : *.transferir coin | 10 | @${m.sender.split`@`[0]}.*`)

                if (conn.transferencia[m.sender]) return m.reply('Ya estas haciendo una transferencia')
                const [objeto, cantidad, destino] = m.text.split('|')
                if (!(objeto && cantidad && destino)) return m.reply(`• Para utilizar el comando cada parte de este debe estar separada por “|”. Espesifica el item (ejemplo coin, xp), la cantidad y el usuario de destino. transferir [ item ] | [ cantidad ] | [ destino ].\n\n• Ejemplo : *.transferir coin | 10 |  @${m.sender.split`@`[0]}.*`)

                let UserDestino = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : destino ? (destino.replace(/[@ .+-]/g, '') + '@s.whatsapp.net') : ''

                if (!(UserDestino in global.db.data.users)) return m.reply(`El Usuario no está en mi base de datos`)

                const Cantidad = parseInt(cantidad)
                const { exp, coin } = database('users', m.sender)

                let item = false
                if (objeto == 'coin' || objeto == 'coins') {
                    if (m.isPrems && !m.isModr) return m.reply('Como usuario premium, dispones de una cantidad ilimitada de coins. Sin embargo, debido a esto no puedes compartir ninguna de estas coins')

                    if (coin < Cantidad) return m.reply('No tienes sufientes coins para transferir'); item = 'coin'
                } else if (objeto == 'exp' || objeto == 'xp') { if (exp < Cantidad) return m.reply('No tienes sufiente *EXP* para transferir'); item = 'exp' }

                if (!item) return m.reply('El item a transferir no existe en base de datos')
                const numero = UserDestino.split`@`[0]

                conn.transferencia[m.sender] = {
                    User: m.sender,
                    destino: UserDestino,
                    numero: numero,
                    object: { item: item, cantidad: Cantidad },
                    message: m.key,
                    setTimeout: setTimeout(() => (m.reply('Se acabó el tiempo, transferencia cancelada'), delete conn.transferencia[m.sender]), 60 * 1000)
                }

                m.reply(`¿Está seguro de que desea transferir *${Cantidad} ${objeto}* a  *@${UserDestino.split('@')[0]}* ?\n\nTienes  *60* segundos. Confirme  que desea realizar la transferencia repondiendo con un 'si'. Si no esta deacuerdo, puede responder con un 'no' para cancelar esta acción`.trim())
            } break;

            case 'unreg': {
                const user = database('users', m.sender)
                if (!user.registered) return m.sms('unreg')
                if (!m.args[0]) m.reply(`*Ingrese su número de serie*\nVerifique su número de serie con el comando:\n\n*${global.prefix}nserie*`)
                let NumeroSerie = createHash('md5').update(m.sender).digest('hex')
                if (!(m.args[0] == NumeroSerie)) m.reply('Número de serie incorrecto!')
                user.registered = false
                m.reply(`Registro eliminado ✓`)
            } break

            case 'nserie': case 'sn': case 'mysn': {
                const user = database('users', m.sender)
                if (!user.registered) return m.sms('unreg')
                let NumeroSerie = createHash('md5').update(m.sender).digest('hex')
                m.reply(`\n● *Numero de serie* : ${NumeroSerie}`.trim())
            } break

            case 'verify': case 'reg': case 'register': case 'registrar': {
                let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i
                const user = database('users', m.sender)

                if (user.registered === true) return m.reply(`Ya estás registrado\n\n¿Quiere volver a registrarse?\n\nUse este comando para eliminar su registro \n*${global.prefix}unreg* <Número de serie>`)

                if (!Reg.test(m.text)) return m.reply(`Formato incorrecto\n\n Uso del comamdo: *${global.prefix + command} nombre.edad*\nEjemplo : *${global.prefix + command}* ${m.name}.16`)

                let [_, name, splitter, age] = m.text.match(Reg)

                if (!name) return m.reply('El nombre no puede estar vacío')
                if (!age) return m.reply('La edad no puede estar vacía')
                if (name.length >= 30) return m.reply('El nombre es demasiado largo')
                age = parseInt(age)
                if (age > 100) return m.reply('Mas de 100 años, de verdad?')
                if (age < 5) return m.reply('Menos de 5 años, de verdad?')

                user.name = name.trim()
                user.age = age
                user.registered = true

                let NumeroSerie = createHash('md5').update(m.sender).digest('hex')

                m.reply(`『 *REGISTRADO* 』\n● *Nombre:* ${name}\n▢ *Edad* : ${age} años\n▢ *Numero de serie* :\n${NumeroSerie}\n\n*${prefix}help* para ver el Menu`.trim())
            } break
        }
    }

    ////////////////////////RANDOM
    switch (m.command) {
        case 'info': case 'informacion': {
            let format = sizeFormatter({ std: 'JEDEC', decimalPlaces: 2, keepTrailingZeroes: false, render: (literal, symbol) => `${literal} ${symbol}B` })
            const used = process.memoryUsage()
            const cpus = _cpus().map(cpu => { cpu.total = Object.keys(cpu.times).reduce((last, type) => last + cpu.times[type], 0); return cpu })

            const cpu = cpus.reduce((last, cpu, _, { length }) => {
                last.total += cpu.total
                last.speed += cpu.speed / length
                last.times.user += cpu.times.user
                last.times.nice += cpu.times.nice
                last.times.sys += cpu.times.sys
                last.times.idle += cpu.times.idle
                last.times.irq += cpu.times.irq
                return last
            }, { speed: 0, total: 0, times: { user: 0, nice: 0, sys: 0, idle: 0, irq: 0 } })

            const message = m.reply('Obteniendo información...')
            let old = performance.now(); await message
            let neww = performance.now()
            let speed = neww - old
            var timestamp = now()
            let texto = (`*INFORMACIÓN DEL BOT*
${readMore}
▢ *Bot : (activo)*
▢ *Tiempo de ejecucion :* [ ${global.uptime} ]
▢ *Apodo en Whatsapp :*
● ${conn.user.name}
▢ *Creador :* Zeppt 
▢ *Version del bot :* 2.0.0 beta
▢ *Velocidad de procesamiento : ${speed} MLS...*
▢ *Velocidad de conexion: ${now() - timestamp.toFixed(4)} S...*
▢ *RAM: ${format(totalmem() - freemem())} / ${format(totalmem())}*
▢ *Plataforma : ${platform()}*
▢ *Base OS : ${type()}*
▢ *Arquitectura : ${arch()}*
▢ *Host :* ${hostname()}

● *Consumó de memoria :*
${'```' + Object.keys(used).map((key, _, arr) => `${key.padEnd(Math.max(...arr.map(v => v.length)), ' ')}: ${format(used[key])}`).join('\n') + '```'}

● ${cpus[0] ? ` *Uso total de CPU*
${cpus[0].model.trim()} (${cpu.speed} MHZ)\n${Object.keys(cpu.times).map(type => `- *${(type + '*').padEnd(6)}: ${(100 * cpu.times[type] / cpu.total).toFixed(2)}%`).join('\n')}

*CPU Core(s) Usado (${cpus.length} Core CPU)*
${cpus.map((cpu, i) => `${i + 1}. ${cpu.model.trim()} (${cpu.speed} MHZ)\n${Object.keys(cpu.times).map(type => `- *${(type + '*').padEnd(6)}: ${(100 * cpu.times[type] / cpu.total).toFixed(2)}%`).join('\n')}`).join('\n\n')}` : ''}`)

            await conn.sendMessage(m.chat, { text: texto, contextInfo: { externalAdReply: { title: 'Zenn Bot MD (en proceso)', body: `Activo: ${global.uptime} / procesamiento : ${speed} milisegundos`, thumbnail: fs.readFileSync('./multimedia/imagenes/thumbnail.jpg'), mediaType: 1, renderLargerThumbnail: true } } }, { quoted: m })
        } break

        case 'menu': case 'help': case 'comandos': {
            const comandos = database('chats', m.chat).commands
            const defaultMenu = () => {
                let menu = `${Menu}\n\n*● Comandos RPG :* ${comandos.rpg ? 'encendido' : 'apagado'}\n*● Comandos Servicio :* ${comandos.servicio ? 'encendido' : 'apagado'}\n\n${MenuRandom}\n\n${MenuGrupos}${comandos.rpg ? '\n\n' + MenuRpg : ''}${comandos.servicio ? '\n\n' + MenuServicio : ''}\n\n${MenuPropietario}`

                let text = menu.split('%prefix ').join(global.prefix)
                text = text.replace('%name', `@${m.sender.split`@`[0]}`).replace('%prem', m.isPrems ? 'Si' : 'No').replace('%coin', m.isPrems ? '∞' : database('users', m.sender).coin).replace('%rol', database('users', m.sender).role)
                return text
            }

            const { path } = await overlayImages(['./multimedia/imagenes/logo.png', './multimedia/iconos/nodejs.png'], { tamano: [100, 100], localizacion: ['abajoIzquierda', 50] })

            conn.sendMessage(m.chat, { image: fs.readFileSync(path), caption: defaultMenu(), contextInfo: { mentionedJid: [...defaultMenu().matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net'), externalAdReply: { title: 'Zenn Bot MD (en desarrollo)', body: 'Simple Bot de WhatsApp', thumbnail: fs.readFileSync('./multimedia/imagenes/thumbnail.jpg'), showAdAttribution: true } }, mentions: [m.sender] }, { quoted: m }); m.react('📚')
        } break

        case 'creador': case 'owner': {
            await sendContactArray(conn, m.chat, [[`5216673877887`, `${database('users', '5216673877887@s.whatsapp.net').name || null}`, `⚡ Creador principal`, null], [`51907182818`, `${database('users', '51907182818@s.whatsapp.net').name || null}`, `🤝 Colaborador`, null], [`5216671993513`, `${database('users', '5216671993513@s.whatsapp.net').name || null}`, `🤝 Colaborador`, null]], { key: { fromMe: false, participant: "0@s.whatsapp.net", ...(m.chat ? { remoteJid: "status@broadcast" } : {}) }, message: { contactMessage: { displayName: 'Zenn-Bot 24/7', vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;0,;;;\nFN:0,\nitem1.TEL;waid=${global.owner.find(o => o[2])?.[0]}:${global.owner.find(o => o[2])?.[0]}\nitem1.X-ABLabell:Ponsel\nEND:VCARD` } } })

            async function sendContactArray(conn, jid, data, quoted, options) {
                if (!Array.isArray(data[0]) && typeof data[0] === 'string') data = [data]
                let contacts = []
                for (let [number, name, isi, isi1] of data) { let vcard = `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:${name.replace(/\n/g, '\\n')}\nitem.ORG:${isi}\nitem1.TEL;waid=${number.replace(/[^0-9]/g, '')}:${PhoneNumber('+' + number.replace(/[^0-9]/g, '')).getNumber('international')}\nitem1.X-ABLabel:${isi1}\nEND:VCARD`.trim(); contacts.push({ vcard, displayName: name }) }
                return await conn.sendMessage(jid, { contacts: { displayName: (contacts.length > 1 ? `2013 kontak` : contacts[0].displayName) || null, contacts } }, { quoted, ...options })
            }
        } break
    }

    ////////////////////////CREADOR
    switch (m.command) {
        case 'addexp': case 'addxp': case 'addcoin': {
            let who
            if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
            else who = m.chat
            if (!(who in global.db.data.users)) return m.reply(`El usuario no se encuentra en mi base de datos`)
            if (!m.isROwner ?? !m.isOwner ?? !m.isModr) return m.sms('owner')
            if (!who) return m.reply('Taguea al usuario')
            let txt = m.text.replace('@' + who.split`@`[0], '').trim()

            if (m.command == 'addcoin') {
                if (!txt) return m.reply('Ingrese la cantidad de *coins* que quiere añadir')
                if (isNaN(txt)) return m.reply('sólo números')
                let cn = parseInt(txt)
                let coins = cn
                if (coins < 1) return m.reply('Mínimo es  *1*')
                let users = global.db.data.users
                users[who].coin += cn
                await m.reply(`*『©️ / Coin - AÑADIDO 』*\n\n▢ *Total:* ${cn}`)
                m.reply(`● @${who.split`@`[0]}\n▢ *RECIBISTE :* +${cn} coins`)
            }

            if (m.command == 'addexp' || m.command == 'addxp') {
                if (!txt) return m.reply('Ingrese la cantidad de *XP* que quiere añadir')
                if (isNaN(txt)) return m.reply('Sólo números')
                let xp = parseInt(txt)
                let exp = xp
                if (exp < 1) return m.reply('Mínimo es  *1*')
                let users = global.db.data.users
                users[who].exp += xp
                await m.reply(`*『 ✨ / XP - AÑADIDO 』*\n\n▢  *Total:* ${xp}`)
                m.reply(`● @${who.split`@`[0]}\n▢ *RECIBISTE :* +${xp} XP`)
            }
        } break

        case 'banchat': case 'unbanchat': case 'banear': case 'desbanear': {
            if (!(m.isModr || m.isOwner || m.isROwner)) return m.sms('owner')
            const chat = (object) => m.args[0] ? m.args[0] + '' : object
            const sender = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'

            if (m.command == 'banchat') {
                data.chats[chat(m.chat)].isBanned = true
                m.reply('Ahora este Bot no responderá a los comandos enviados a este chat')
            }
            if (m.command == 'unbanchat') {
                data.chats[chat(m.chat)].isBanned = false
                m.reply('Ahora este Bot responderá a los comandos enviados a este chat')
            }

            if (m.command == 'banear') {
                if (data.users[chat(sender)].banned) m.reply(`El usuario ${sender.split`@`[0]} ya estuvo baneado U.U`)
                data.users[chat(sender)].banned = true
                data.users[chat(sender)].banActor = m.sender
                m.reply('Ahora el Bot no respondera a ningun comando enviado por este usuario')
            }

            if (m.command == 'desbanear') {
                const creador = global.owner.find(o => o[2])?.[0] + '@s.whatsapp.net'
                if (!data.users[chat(sender)].banned) return m.reply(`El usuario ${sender.split`@`[0]}, no esta baneado`)
                if (m.sender == creador) {
                    data.users[chat(sender)].banActor = ''
                    data.users[chat(sender)].banned = false
                    m.reply('Usuario desbaneado ✓')
                } else {
                    if (data.users[chat(sender)].banActor.startsWith(creador)) return m.reply(`Este usuario fue baneado por el creador del Bot, no puedes desbanearlo.`)
                    data.users[chat(sender)].banActor = ''
                    data.users[chat(sender)].banned = false
                    m.reply('Usuario desbaneado ✓')
                }
            }
        } break

        case 'banlist': case 'premlist': case 'modrlist': case 'moderadorlist': case 'ownerlist': case 'rownerlist': {
            if (!m.isModr ?? !m.isOwner ?? !m.isROwner) return m.sms('owner')
            if (m.command == 'banlist') {
                let users = Object.entries(global.db.data.users).filter(user => user[1].banned)
                m.reply(`*『 USUARIOS BANEADOS 』*\n\n▢ Total : *${users.length}*\n\n${users ? '\n' + users.map(([jid], i) => `${i + 1}. ${conn.getName(jid) == undefined ? 'Desconocido' : conn.getName(jid)}\n▢ ${jid}`.trim()).join('\n\n') : ''}`.trim())
            }

            else if (m.command == 'premlist') {
                let users = Object.entries(global.db.data.users).filter(user => user[1].premium)
                m.reply(`*『 USUARIOS PREMIUM 』*\n\n▢ Total : *${users.length}*\n\n${users ? '\n' + users.map(([jid], i) => `${i + 1}. ${conn.getName(jid) == undefined ? 'Desconocido' : conn.getName(jid)}\n▢ ${jid}`.trim()).join('\n\n') : ''}`.trim())
            }

            else if (m.command == 'modrlist' || m.command == 'moderadorlist') {
                let users = Object.entries(global.db.data.users).filter(user => user[1].modr)
                m.reply(`*『 MODERADORES 』*\n\n▢ Total : *${users.length}*\n\n${users ? '\n' + users.map(([jid], i) => `${i + 1}. ${conn.getName(jid) == undefined ? 'Desconocido' : conn.getName(jid)}\n▢ ${jid}`.trim()).join('\n\n') : ''}`.trim())
            }

            else if (m.command == 'ownerlist') {
                let users = Object.entries(global.db.data.users).filter(user => user[1].owner)
                m.reply(`*『 OWNERS 』*\n\n▢ Total : *${users.length}*\n\n${users ? '\n' + users.map(([jid], i) => `${i + 1}. ${conn.getName(jid) == undefined ? 'Desconocido' : conn.getName(jid)}\n▢ ${jid}`.trim()).join('\n\n') : ''}`.trim())
            }

            else if (m.command == 'rownerlist') {
                let users = Object.entries(global.db.data.users).filter(user => user[1].rowner)
                m.reply(`*『 ROWNERS ${llavec}*\n\n▢ Total : *${users.length}*\n\n${users ? '\n' + users.map(([jid], i) => ` ${i + 1}. ${conn.getName(jid) == undefined ? 'Desconocido' : conn.getName(jid)}\n▢ ${jid}`.trim()).join('\n\n') : ''}`.trim())
            }
        } break

        case 'addowner': case 'delowner': case 'addmodr': case 'addmoderador': case 'delmodr': case 'delmoderador': case 'addprem': case 'addpremium': case 'delprem': case 'delpremium': {
            const sender = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
            const db = global.db.data.users[sender]
            const usuario = sender.slice(0, -15)
            const textMention = `Etiqueta o menciona al usuario`
            const User = `@${sender.split`@`[0]}`
            if (!(sender in global.db.data.users)) return m.reply(`El usuario no se encuentra en mi base de datos`)

            conn.reply = (text) => { conn.sendMessage(m.chat, { text: text, mentions: [sender] }, { quoted: m }) }

            if (m.command == 'addowner') {
                if (!m.isROwner) return m.sms('owner')
                if (!isNaN(usuario && m.mentionedJid[0] && m.text)) return m.reply(textMention)
                if (db.owner) return m.reply('El usuario mensionado ya es owner')
                db.owner = true
                db.modr = true
                db.premium = true
                conn.reply(User + ' ahora te conviertes en Owner')
            }

            else if (m.command == 'delowner') {
                if (!m.isROwner) return m.sms('owner')
                if (!isNaN(usuario && m.mentionedJid[0] && m.text)) return m.reply(textMention)
                if (!db.owner) return m.reply('El usuario mensionado no es owner')
                db.owner = false
                db.modr = false
                db.premium = false
                conn.reply(User + ' ya no eres owner')
            }

            else if (m.command == 'addmodr' || m.command == 'addmoderador') {
                if (!m.isOwner ?? !m.isROwner) return m.sms('owner')
                if (!isNaN(usuario && m.mentionedJid[0] && m.text)) return m.reply(textMention)
                conn.reply(db.owner ? User + ' Has sido degradado a solo moderador' : User + ' ahora te conviertes en moderador')
                db.owner = false
                ///////
                db.modr = true
                db.premium = true
            }

            else if (m.command == 'delmodr' || m.command == 'delmoderador') {
                if (!m.isOwner ?? !m.isROwner) return m.sms('owner')
                if (!isNaN(usuario && m.mentionedJid[0] && m.text)) return m.reply(textMention)
                db.owner = false
                ///////
                db.modr = false
                db.premium = false
                conn.reply(User + ' ya no eres moderador')
            }

            else if (m.command == 'addprem' || m.command == 'addpremium') {
                if (!m.isModr ?? !m.isOwner ?? !m.isROwner) return m.sms('modr')
                if (!isNaN(usuario && m.mentionedJid[0] && m.text)) return m.reply(textMention)
                const text = User + ' Has sido degradado a solo usuario premium'
                conn.reply(db.owner ? text : db.modr ? text : User + ' ahora te conviertes en un usuario premium')
                db.owner = false
                db.modr = false
                ///////
                db.premium = true
            }

            else if (m.command == 'delprem' || m.command == 'delpremium') {
                if (!m.isModr ?? !m.isOwner ?? !m.isROwner) return m.sms('modr')
                if (!isNaN(usuario && m.mentionedJid[0] && m.text)) return m.reply(textMention)
                db.owner = false
                db.modr = false
                ///////
                db.premium = false
                conn.reply(User + ' Ya no eres usuario premium')
            }
        } break

        default:
            if (m.budy.startsWith('=>')) {
                if (!m.isROwner) return m.sms('owner')
                function Return(sul) {
                    const sat = JSON.stringify(sul, null, 2)
                    const bang = util.format(sat)
                    if (sat == undefined) { bang = util.format(sul) }
                    return m.reply(bang)
                }
                try { m.reply(util.format(eval(`(async () => { return ${m.budy.slice(3)} })()`))) } catch (e) { m.reply(String(e)) }
            }

            if (m.budy.startsWith('>')) {
                if (!m.isROwner) return m.sms('owner')
                try {
                    let evaled = await eval(m.budy.slice(2))
                    if (typeof evaled !== 'string') evaled = util.inspect(evaled)
                    if (evaled == 'undefined') { } else await m.reply(evaled)
                } catch (err) {
                    if (err == 'undefined') { } else await m.reply(String(err))
                }
            }
            if (m.budy.startsWith('$')) {
                if (!m.isROwner) return m.sms('owner')
                exec(m.budy.slice(2), (err, stdout) => {
                    if (err) return m.reply(err)
                    if (stdout) return m.reply(stdout)
                })
            }
    }
}

async function mediafireDl(url) {
    if (!url) return;
    const res = await axios.get(`https://www-mediafire-com.translate.goog/${url.replace('https://www.mediafire.com/', '')}?_x_tr_sl=en&_x_tr_tl=fr&_x_tr_hl=en&_x_tr_pto=wapp`);
    const $ = cheerio.load(res.data);
    const link = $('#downloadButton').attr('href');
    const name = $('body > main > div.content > div.center > div > div.dl-btn-cont > div.dl-btn-labelWrap > div.promoDownloadName.notranslate > div').attr('title').replaceAll(' ', '').replaceAll('\n', '');
    const date = $('body > main > div.content > div.center > div > div.dl-info > ul > li:nth-child(2) > span').text();
    const size = $('#downloadButton').text().replace('Download', '').replace('(', '').replace(')', '').replace('\n', '').replace('\n', '').replace('                         ', '').replaceAll(' ', '');
    let mime = '';
    const rese = await axios.head(link);
    mime = rese.headers['content-type'];
    return { name, size, date, mime, link };
}

async function tts(text = 'error', lang = 'es') {
    return new Promise((resolve, reject) => { try { const tts = gtts(lang); const filePath = path.join(global.__dirname(import.meta.url), './tmp', (1 * new Date) + '.wav'); tts.save(filePath, text, () => { resolve(fs.readFileSync(filePath)); unlinkSync(filePath) }) } catch (e) { reject(e) } })
}

async function GDriveDl(url) {
    let id;
    if (!(url && url.match(/drive\.google/i))) throw 'Invalid URL';
    id = (url.match(/\/?id=(.+)/i) || url.match(/\/d\/(.*?)\//))[1];
    if (!id) throw 'ID Not Found';
    const res = await fetch(`https://drive.google.com/uc?id=${id}&authuser=0&export=download`, {
        method: 'post',
        headers: {
            'accept-encoding': 'gzip, deflate, br',
            'content-length': 0,
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            'origin': 'https://drive.google.com',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
            'x-client-data': 'CKG1yQEIkbbJAQiitskBCMS2yQEIqZ3KAQioo8oBGLeYygE=',
            'x-drive-first-party': 'DriveWebUi',
            'x-json-requested': 'true'
        }
    });
    const { fileName, sizeBytes, downloadUrl } = JSON.parse((await res.text()).slice(4));
    if (!downloadUrl) throw 'Link Download Limit!';
    const data = await fetch(downloadUrl);
    if (data.status !== 200) throw data.statusText;
    return { downloadUrl, fileName, fileSize: formatSize(sizeBytes), mimetype: data.headers.get('content-type') };
}

async function fetchJson(url, options) {
    if (!url) return;
    try {
        options ? options : {}
        const res = await axios({ method: 'GET', url: url, headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36' }, ...options })
        return res.data
    } catch (err) { return err }
}

function formatDate(n, locale = 'es') {
    let d = new Date(n)
    return d.toLocaleDateString(locale, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    })
}

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

let file = global.__filename(import.meta.url, true)
watchFile(file, async () => { unwatchFile(file); console.log(chalk.redBright(file + " fue actualizado correctamente ✓")) })
