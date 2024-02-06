import chalk from 'chalk'
import { smsg } from './lib/simple.js'
import { sendCase } from './case.js'
import moment from 'moment-timezone'
import QRCode from 'qrcode-terminal'
import { Boom } from '@hapi/boom'
import { format } from 'util'
import './config.js'

const Prefix = ".¿?¡!#%&/;:,~-+="
global.prefix = Prefix[0]
const isNumber = x => typeof x === 'number' && !isNaN(x)
const { DisconnectReason } = (await import('@whiskeysockets/baileys')).default

export async function connection_update(update, StartBot) {
    console.log(update); const { connection, lastDisconnect, qr } = update
    if (connection === 'close') { const shouldReconnect = lastDisconnect.error instanceof Boom && lastDisconnect.error.output?.statusCode !== DisconnectReason.loggedOut; console.log('Conexión cerrada debido a ', lastDisconnect.error, ', reconectando... ', shouldReconnect); if (shouldReconnect) { await StartBot().catch(console.error) } } else if (connection === 'open') { console.log('Conectado ✓') }
    if (qr) QRCode.generate(qr, { small: true })
    if (global.db.data == null) loadDatabase()
}

export async function messages_upsert(conn, m, store, subBot = false) {
    if (global.db.data == null) await global.loadDatabase()
    if (!m.type === 'notify') return;
    if (!m) return;
    //console.log(JSON.stringify(m, undefined, 2))
    m.mek = m
    m.prefix = global.prefix
    m = m.messages[0]
    m = await smsg(conn, m, store)
    if (!m.message) return;

    if (m.key) {
        m.groupMetadata = m.isGroup ? await conn.groupMetadata(m.chat) : ''
        m.groupName = m.isGroup ? m.groupMetadata.subject : ''
        m.participants = m.isGroup ? await m.groupMetadata.participants : ''
        m.groupAdmins = m.isGroup ? await m.participants.filter(v => v.admin !== null).map(v => v.id) : ''

        m.groupOwner = m.isGroup ? m.groupMetadata.owner : ''
        m.groupMembers = m.isGroup ? m.groupMetadata.participants : ''
        m.isBotAdmin = m.isGroup ? m.groupAdmins.includes(m.Bot) : false
        m.isAdmin = m.isGroup ? m.groupAdmins.includes(m.sender) : false
    }

    const data = global.db.data
    m.data = (object, m) => global.db.data[object][m]
    m.user = (sender = m.sender) => { const user = data.users[sender]; return user.rowner ? 'rowner' : user.owner ? 'owner' : user.modr ? 'modr' : user.premium ? 'premium' : false }

    m.isROwner = m.user() == 'rowner'
    m.isOwner = m.user() == 'owner'
    m.isModr = m.user() == 'modr'
    m.isPrems = m.user() == 'premium'

    m.body = (m.type(m.message) === 'conversation') ? m.message.conversation : (m.type(m.message) == 'imageMessage') ? m.message.imageMessage.caption : (m.type(m.message) == 'videoMessage') ? m.message.videoMessage.caption : (m.type(m.message) == 'extendedTextMessage') ? m.message.extendedTextMessage.text : ''
    m.budy = (typeof m.body == 'string' ? m.body : '')

    m.isCmd = (Prefix).includes(m.body[0])
    m.command = m.isCmd ? m.body.substring(1).trim().split(/ +/).shift().toLowerCase() : false
    m.args = m.body.trim().split(/ +/).slice(1)
    m.text = m.args.join(" ")

    console.log('\x1b[1;31m~\x1b[1;37m>', chalk.white('['), chalk.blue(m.isCmd ? `EJECUTANDO` : `MENSAJE`), chalk.white(']'), chalk.green('{'), chalk.rgb(255, 131, 0).underline(m.budy), chalk.green('}'), chalk.blue(m.isCmd ? 'Por' : 'De'), chalk.cyan(m.name), 'Chat', m.isGroup ? chalk.bgGreen('grupo:' + m.groupName || m.chat) : chalk.bgRed('Privado:' + m.name || m.sender), 'Fecha', chalk.magenta(moment().tz(Intl.DateTimeFormat().resolvedOptions().timeZone).format('DD/MM/YY HH:mm:ss')).trim())

    m.reply = async (text) => { await conn.sendMessage(m.chat, { text: text, contextInfo: { mentionedJid: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net') } }, { quoted: m }) }

    if (global.db.data.chats[m.chat].antiPrivado) { if (!m.isGroup) { if (!(m.isPrems ?? m.isModr ?? m.isOwner ?? m.isROwner)) { m.reply('El chat privado esta prohibido'); return } } }

    if (global.db.data.chats[m.chat].antiTraba) {
        if (m.isAdmin) return;
        if (m.isOwner) return;
        if (m.isROwner) return;
        if (m.Bot == m.sender) return;
        if (m.budy.length > 4000) {
            await conn.sendMessage(m.chat, { text: `*Se ha detectado un mensaje que contiene muchos caracteres*\n@${m.sender.split("@")[0]} Adios...\n`, mentions: [m.sender] })
            conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: m.key.id, participant: m.key.participant } })
            setTimeout(() => { conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove') }, 1000)
            conn.sendMessage(m.chat, { text: `Marque el chat como leido.${('\n').repeat(200)}` })
        }
    }

    if (global.db.data.chats[m.chat].antiLink) {
        const Regex = /chat.whatsapp.com\/(?:invite\/)?([0-9A-Za-z]{20,24})/i
        const isGroupLink = Regex.exec(m.budy)
        const linkisGroup = `https://chat.whatsapp.com/${await conn.groupInviteCode(m.chat)}`
        if (isGroupLink) {
            if (m.isAdmin) return;
            if (m.isOwner) return;
            if (m.isROwner) return;
            if (m.Bot == m.sender) return;
            if (m.budy.includes(linkisGroup)) return;
            await conn.sendMessage(m.chat, { text: `*Enlace detectado*\n@${m.sender.split("@")[0]} Adios...\n`, mentions: [m.sender] })
            conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: m.key.id, participant: m.key.participant } })
            setTimeout(() => { conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove') }, 1000)
        }
    }

    if (global.db.data.settings[m.Bot].autoread) conn.readMessages([m.key])

    try { await sendCase(conn, m, store) } catch (e) { conn.sendMessage(global.owner.find(o => o[2])?.[0] + '@s.whatsapp.net', { text: `*¡Se detecto ${subBot ? 'en un subBot' : 'en el Bot'}¡:*\n\n*▢ Comando :* ${prefix + m.command}\n*▢ Usuario:* wa.me/${m.sender.split("@")[0]}\n*▢ Chat:* ${m.chat}\n\n\`\`\`${format(e)}\`\`\` \n`.trim() }, { quoted: m }); console.log(format(e)) }
}

export async function groups_update(conn, json) {
    const grupo = json[0]
    const id = grupo.id
    let detect = global.db.data.chats[grupo.id].detect
    if (!detect) return
    let text = ''
    if (!grupo.desc == '') text = ('*「 La descripción fue actualizada 」*\n@desc').replace('@desc', grupo.desc)
    else if (grupo.subject) text = ('*「 El nombre del grupo fue actualizado 」*\n@subject').replace('@subject', grupo.subject)
    else if (grupo.icon) text = ('*「 Imagen del grupo actualizada 」*').replace('@icon', grupo.icon)
    else if (grupo.revoke) text = ('*「 El link del grupo fue actualizado 」*\n@revoke').replace('@revoke', grupo.revoke)
    else if (grupo.announce == true) text = ('*「 Configuración del grupo cambiada 」*\n¡Ahora solo los administradores pueden enviar mensajes!')
    else if (grupo.announce == false) text = ('*「 Configuración del grupo cambiada 」*\n¡Ahora todos los participantes pueden enviar mensajes!')
    else if (grupo.restrict == true) text = ('*「 La configuración del grupo ha cambiado 」*\nLa información del grupo se ha restringido, ¡ahora solo los administradores pueden editar la información del grupo!')
    else if (grupo.restrict == false) text = ('*「 La configuración del grupo ha cambiado 」*\nSe ha abierto la información del grupo, ¡ahora todos los participantes pueden editar la información del grupo!')
    await conn.sendMessage(id, { text: text })
}

export async function group_participants_update(conn, anu) {
    const { id, participants, action } = anu
    let chat = global.db.data.chats[id] || {}
    let text = ''
    switch (action) {
        case 'add': case 'remove': {
            if (!chat.welcome) return;
            const groupMetadata = conn.groupMetadata(id)
            for (let user of participants) {
                let data = await conn.profilePictureUrl(user, 'image').catch(_ => './multimedia/imagenes/avatar.jpg')
                let fesha = moment().tz(Intl.DateTimeFormat().resolvedOptions().timeZone).format('DD/MM/YY HH:mm:ss')
                const welcome = '● *Bienvenid@ :* @user\n● *Normas del grupo*\n' + String.fromCharCode(8206).repeat(850) + '\n@desc'
                const bye = '[ ! ] C fue alv : @user'

                text = action === 'add' ? welcome.replace('@user', '@' + user.split('@')[0]).replace('@desc', groupMetadata.desc || 'indefinido') : bye.replace('@user', '@' + user.split('@')[0])

                const reply = { text: text, mentions: [user], contextInfo: { externalAdReply: { title: action === 'add' ? 'Fecha de ingreso | ' + fesha : 'Fecha de salida | ' + fesha, body: 'El bot mas chidori tercer mundista', thumbnail: data, mediaType: 1, renderLargerThumbnail: true } } }

                conn.sendMessage(id, reply, { quoted: { key: { participant: "0@s.whatsapp.net", "remoteJid": "0@s.whatsapp.net" }, "message": { "groupInviteMessage": { "groupJid": "573245088667-1616169743@g.us", "inviteCode": "m", "groupName": "P", "caption": action === 'add' ? 'Nuevo participante bienvenido!' : 'Menos un participante', 'jpegThumbnail': data } } } })
            }
        } break
        case 'promote': text = '@user Ahora es admin!'
        case 'demote': if (!text) text = '@user Ya no es admin'; text = text.replace('@user', '@' + participants[0].split('@')[0]); if (chat.detect) conn.sendMessage(id, { text: text, mentions: [participants] })
            break
    }
}

export async function database(conn, m) {
    if (!m) return;
    m = m.messages[0]
    m.chat = m.key.remoteJid
    m.sender = m.key.participant || m.participant || m.chat || ''
    m.Bot = conn.user.id.split(":")[0] + "@s.whatsapp.net"

    const globalOwner = (sender) => {
        const creador = (global.owner.find(o => o[2])?.[0] + '@s.whatsapp.net').includes(sender)
        const propietario = global.owner.map(owner => owner[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(sender)
        const moderador = global.mods.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(sender)
        const premium = moderador || global.prems.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(sender)
        if (creador) return 'rowner'
        else if (creador || propietario) return 'owner'
        else if (propietario || moderador) return 'modr'
        else if (moderador || premium) return 'premium'
        else return false
    }

    const creador = globalOwner(m.sender) == 'rowner'
    const propietario = globalOwner(m.sender) == 'owner'
    const moderador = globalOwner(m.sender) == 'modr'
    const premium = globalOwner(m.sender) == 'premium'

    let user = global.db.data.users[m.sender]
    if (typeof user !== 'object') global.db.data.users[m.sender] = {}
    if (user) {
        if (!isNumber(user.lastmiming)) user.lastmiming = 10
        if (!isNumber(user.lastrob)) user.lastrob = 10
        if (!isNumber(user.exp)) user.exp = 0
        if (!isNumber(user.coin)) user.coin = 10
        if (!('registered' in user)) user.registered = false
        if (!user.registered) { if (!('name' in user)) user.name = m.name }
        if (!('banned' in user)) user.banned = false
        if (!('rowner' in user)) user.rowner = creador ? true : false
        if (!('owner' in user)) user.owner = propietario ? true : false
        if (!('modr' in user)) user.modr = moderador ? true : false
        if (!('premium' in user)) user.premium = premium ? true : false
        if (!('banActor' in user)) user.banActor = ''
    } else global.db.data.users[m.sender] = {
        rowner: m.Bot == m.sender ? true : creador ? true : false,
        owner: m.Bot == m.sender ? true : propietario ? true : false,
        modr: m.Bot == m.sender ? true : moderador ? true : false,
        premium: m.Bot == m.sender ? true : premium ? true : false,
        banActor: '',
        lastmiming: 0,
        lastrob: 0,
        exp: global.rpg.data.exp,
        coin: global.rpg.data.coin,
        registered: false,
        getname: m.name,
        name: m.name,
        banned: false,
        role: global.rpg.data.role,
        nivel: global.rpg.data.nivel
    }

    let chat = global.db.data.chats[m.chat]
    if (typeof chat !== 'object') global.db.data.chats[m.chat] = {}
    if (chat) {
        if (!('isBanned' in chat)) chat.isBanned = false
        if (!('welcome' in chat)) chat.welcome = false
        if (!('detect' in chat)) chat.detect = true
        if (!('delete' in chat)) chat.delete = true
        if (!('antiTraba' in chat)) chat.antiTraba = true
        if (!('antiLink' in chat)) chat.antiLink = false
    } else global.db.data.chats[m.chat] = {
        commands: {
            servicio: true,
            rpg: true,
            adminUse: false,
        },
        isBanned: false,
        welcome: false,
        detect: true,
        delete: true,
        antiTraba: false,
        antiLink: false,
    }

    let settings = global.db.data.settings[m.Bot]
    if (typeof settings !== 'object') global.db.data.settings[m.Bot] = {}
    if (settings) {
        if (!('objecto' in settings)) settings.objecto = {}
        if (!('autoread' in settings)) settings.autoread = false
        if (!('restrict' in settings)) settings.restrict = true
    } else global.db.data.settings[m.Bot] = {
        objecto: {},
        SubBots: {},
        autoread: false,
        OwnerUse: false,
        antiPrivado: false
    }

    let cloud = global.db.data.cloud[m.sender]
    if (typeof cloud !== 'object') global.db.data.cloud[m.sender] = {}
    if (cloud) {
        if (!('saveFiles' in cloud)) cloud.saveFiles = []
    } else global.db.data.cloud[m.sender] = {
        saveFiles: []
    }
}