import PhoneNumber from 'awesome-phonenumber'
import axios from 'axios'
import cheerio from 'cheerio'
import { fileTypeFromBuffer } from 'file-type'
import util from 'util'
import fs from 'fs'
import fetch from 'node-fetch'
import path, { join } from 'path'
import { imageToWebp, videoToWebp, writeExifImg, writeExifVid } from './converter.js'
import { spawn } from 'child_process'


const {
    proto,
    downloadContentFromMessage,
    jidDecode,
    areJidsSameUser,
    generateForwardMessageContent,
    generateWAMessageFromContent,
    extractMessageContent,
    getContentType,
    delay
} = (await import('@whiskeysockets/baileys')).default

export async function fetchJson(url, options) {
    if (!url) return;
    try {
        options ? options : {}
        const res = await axios({ method: 'GET', url: url, headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36' }, ...options })
        return res.data
    } catch (err) { return err }
}


export async function getBuffer(url, options) { try { options ? options : {}; const res = await axios({ method: "get", url, headers: { 'DNT': 1, 'Upgrade-Insecure-Request': 1 }, ...options, responseType: 'arraybuffer' }); return res.data } catch (err) { return err } }

export async function smsg(conn, m, store) {
    m.name = m.pushName || "indefinido"
    m.type = (object) => { return getContentType(object) }
    m.ObjectType = (text, object) => { if (!text) return; if (!object) return; const keys = Object.keys(text); let Type = false; for (let i = 0; i < keys.length; i++) { if (keys[i] === object) Type = text[keys[i]] } return Type }

    if (m.key) {
        m.id = m.key.id
        m.isBaileys = m.id.startsWith('BAE5') && m.id.length === 16
        m.chat = m.key.remoteJid
        m.fromMe = m.key.fromMe
        m.isGroup = m.chat.endsWith('@g.us')
        m.sender = m.key.participant || m.participant || m.chat || ''
        m.device = m.key.id.length > 21 ? 'Android' : m.key.id.substring(0, 2) == '3A' ? 'IOS' : 'whatsapp web'
        m.Bot = conn.user.id.split(":")[0] + "@s.whatsapp.net"
    }

    if (m.message) {
        m.msg = m.message[m.type(m.message)]
        m.quoted = m.ObjectType(m.msg, 'contextInfo') ? m.msg.contextInfo.quotedMessage : null
        m.mentionedJid = m.ObjectType(m.msg, 'contextInfo') ? m.msg.contextInfo.mentionedJid : []

        if (m.quoted) {
            m.quoted.id = m.msg.contextInfo.stanzaId
            m.quoted.chat = m.msg.contextInfo.remoteJid || m.chat
            m.quoted.isBaileys = m.quoted.id ? m.quoted.id.startsWith('BAE5') && m.quoted.id.length === 16 : false
            m.quoted.sender = m.msg.contextInfo.participant.split(":")[0] || m.msg.contextInfo.participant
            m.quoted.fromMe = m.quoted.sender === (conn.user && conn.user.id)
            m.quoted.text = m.quoted.text || m.quoted.caption || ''
            m.quoted.mentionedJid = m.msg.contextInfo ? m.msg.contextInfo.mentionedJid : []
        }
    }

    conn.download = () => { return conn.downloadMediaMessage(m.SMS().message[m.type(m.SMS().message)]) }
    conn.DownloadMedia = () => { return conn.DownloadSaveMedia(m.SMS().message[m.type(m.SMS().message)]) }

    conn.decodeJid = (jid) => {
        if (!jid) return jid
        if (/:\d+@/gi.test(jid)) { let decode = jidDecode(jid) || {}; return decode.user && decode.server && decode.user + '@' + decode.server || jid } else return jid
    }

    conn.getName = (jid, withoutContact = false) => {
        const id = conn.decodeJid(jid)
        withoutContact = conn.withoutContact || withoutContact
        let v
        if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
            v = store.contacts[id] || {}
            if (!(v.name || v.subject)) v = conn.groupMetadata(id) || {}
            resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
        })
        else v = id === '0@s.whatsapp.net' ? { id, name: 'WhatsApp' } : id === conn.decodeJid(conn.user.jid) ? conn.user : (store.contacts[id] || {})
        return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
    }

    conn.copyNForward = async (jid, message, forwardingScore = true, options = {}) => {
        let vtype
        if (options.readViewOnce && message.message.viewOnceMessage?.message) {
            vtype = Object.keys(message.message.viewOnceMessage.message)[0]
            delete message.message.viewOnceMessage.message[vtype].viewOnce
            message.message = proto.Message.fromObject(JSON.parse(JSON.stringify(message.message.viewOnceMessage.message)))
            message.message[vtype].contextInfo = message.message.viewOnceMessage.contextInfo
        }
        let mtype = getContentType(message.message)
        let m = generateForwardMessageContent(message, !!forwardingScore)
        let ctype = getContentType(m)
        if (forwardingScore && typeof forwardingScore === 'number' && forwardingScore > 1) m[ctype].contextInfo.forwardingScore += forwardingScore
        m[ctype].contextInfo = { ...(message.message[mtype].contextInfo || {}), ...(m[ctype].contextInfo || {}) }
        m = generateWAMessageFromContent(jid, m, { ...options, userJid: conn.user.jid })
        await conn.relayMessage(jid, m.message, { messageId: m.key.id, additionalAttributes: { ...options } })
        return m
    }

    conn.downloadMediaMessage = async (message) => {
        const mime = message.mimetype || "";
        let messageType = mime.split("/")[0];
        const stream = await downloadContentFromMessage(message, messageType);
        let buffer = Buffer.from([]);
        for await (const chunk of stream) { buffer = Buffer.concat([buffer, chunk]); }
        return buffer;
    }

    conn.DownloadSaveMedia = async (message, filename, attachExtension = true) => {
        const mime = message.mimetype || "";
        let messageType = mime.split("/")[0];
        const stream = await downloadContentFromMessage(quoted, messageType)
        let buffer = Buffer.from([])
        for await (const chunk of stream) { buffer = Buffer.concat([buffer, chunk]) }
        let type = await fileTypeFromBuffer(buffer)
        var trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
        fs.writeFileSync(trueFileName, buffer)
        return trueFileName
    }

    conn.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], "base64") : /^https?:\/\//.test(path) ? await getBuffer(path) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0);
        let buffer;
        if (options && (options.packname || options.author)) { buffer = await writeExifImg(buff, options) } else { buffer = await imageToWebp(buff) }

        await conn.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
        return buffer;
    };

    conn.sendBuffer = async (path) => {
        const buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], "base64") : /^https?:\/\//.test(path) ? await getBuffer(path) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0);
        return buffer
    }

    conn.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
        let buffer;
        let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], "base64") : /^https?:\/\//.test(path) ? await getBuffer(path) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0);

        if (options && (options.packname || options.author)) { buffer = await writeExifVid(buff, options) } else { buffer = await videoToWebp(buff) }

        await conn.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
        return buffer;
    }

    conn.getFile = async (PATH, saveToFile = false) => {
        let res, filename
        const data = Buffer.isBuffer(PATH) ? PATH : PATH instanceof ArrayBuffer ? PATH.toBuffer() : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,`[1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await fetch(PATH)).buffer() : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
        if (!Buffer.isBuffer(data)) m.reply('\n[!] El resultado no es un búfer\n')
        const type = await fileTypeFromBuffer(data) || { mime: 'application/octet-stream', ext: '.bin' }
        if (data && saveToFile && !filename) (filename = path.join(__dirname, './tmp/' + new Date * 1 + '.' + type.ext), await fs.promises.writeFile(filename, data))
        return { res, filename, ...type, data, deleteFile() { return filename && fs.promises.unlink(filename) } }
    }

    conn.converter = async (type = 'opus', buffer, ext) => {
        if (type == 'ogg') return ffmpeg(buffer, [
            '-vn',
            '-c:a', 'libopus',
            '-b:a', '128k',
            '-vbr', 'on',
        ], ext, 'ogg')

        else if (type == 'opus') return ffmpeg(buffer, [
            '-vn',
            '-c:a', 'libopus',
            '-b:a', '128k',
            '-vbr', 'on',
            '-compression_level', '10'
        ], ext, 'opus')

        else if (type == 'mp4') return ffmpeg(buffer, [
            '-c:v', 'libx264',
            '-c:a', 'aac',
            '-ab', '128k',
            '-ar', '44100',
            '-crf', '32',
            '-preset', 'slow'
        ], ext, 'mp4')
    }

    conn.sendhtml = async (url) => {
        if (!url) return 'URL?'
        try {
            const get = await axios.get(url)
            const $ = cheerio.load(get.data);
            return $.html()
        } catch (e) { return '*[ERROR]* No se puedo obtener la pagina: ' + util.format(e) }
    }

    m.react = (text) => { conn.sendMessage(m.chat, { react: { text, key: m.key } }) }

    m.SMS = () => {
        const mensage = m.quoted ? m.message.extendedTextMessage.contextInfo.quotedMessage : m.message
        return { key: { remoteJid: m.key.remoteJid, fromMe: m.key.fromMe, id: m.key.id, participant: m.key.participant }, messageTimestamp: m.messageTimestamp, pushName: m.pushName, broadcast: m.broadcast, message: { [m.type(mensage)]: mensage[m.type(mensage)] } }
    }

    m.download = () => conn.download()
    m.sms = (type) => {
        let msg = {
            rowner: 'Este comando solo puede ser utilizado por el *dueño*',
            owner: 'Este comando solo puede ser utilizado por un *propietario*',
            modr: '*Este comando solo puede ser utilizado por un *moderador*',
            premium: 'Esta solicitud es solo para usuarios *premium*',
            group: 'Este comando solo se puede usar en *grupos*',
            private: 'Este comando solo se puede usar por *chat privado*',
            admin: 'Este comando solo puede ser usado por los *administradores del grupo*',
            botAdmin: 'El bot necesita *ser administrador* para usar este comando',
            unreg: 'Regístrese para usar esta función escribiendo:\n\n.registrar nombre.edad',
            restrict: 'Esta función está desactivada'
        }[type]
        if (msg) return m.reply(msg)
    }

    return m
}

function ffmpeg(buffer, args = [], ext = '', ext2 = '') {
    return new Promise(async (resolve, reject) => {
        try {
            let tmp = join(global.__dirname(import.meta.url), '../tmp', + new Date + '.' + ext)
            let out = tmp + '.' + ext2
            await fs.promises.writeFile(tmp, buffer)
            spawn('ffmpeg', ['-y', '-i', tmp, ...args, out]).on('error', reject).on('close', async (code) => {
                try {
                    await fs.promises.unlink(tmp)
                    if (code !== 0) return reject(code)
                    resolve({ data: await fs.promises.readFile(out), filename: out, delete() { return fs.promises.unlink(out) } })
                } catch (e) { reject(e) }
            })
        } catch (e) { reject(e) }
    })
}