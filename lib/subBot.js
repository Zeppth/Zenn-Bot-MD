//Voy a mejorar este aspecto, ya que no es de lo mejor. XD.
import { messages_upsert, groups_update, group_participants_update } from '../script.js'
import { randomBytes } from 'crypto'
import fs from 'fs'
import { Boom } from '@hapi/boom'
import NodeCache from 'node-cache'
import qrcode from 'qrcode'
import pino from 'pino'
import util from "util"

let connect = {}
const { default: makeWAconnet, getContentType, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, PHONENUMBER_MCC } = (await import('@whiskeysockets/baileys')).default

export async function SubBot(conns, store, proto, sender, SubBot = false) {
    if (typeof connect.start == 'undefined') connect.start = true
    if (typeof connect.error == 'undefined') connect.error = false
    if (typeof connect.contador == 'undefined') connect.contador = false
    if (!connect.start) return;
    if (connect.error) { conns.sendMessage(global.owner.find(o => o[2])?.[0] + '@s.whatsapp.net', { text: '*SubBot :* ' + connect.error }), connect.error = false }
    try {
        async function StartBot() {
            if (!connect.start) return;
            const { state, saveCreds } = await useMultiFileAuthState(`SubBots/${sender}`)
            const { version } = await fetchLatestBaileysVersion()
            const msgNodeCache = new NodeCache()

            const opcion = (numero) => { if (numero) { if (SubBot) { return 'subBot' } else if (typeof conns !== 'undefined' && typeof conns.SubBot !== 'undefined' && typeof conns.SubBot[sender] !== 'undefined' && conns.SubBot[sender].opcion == numero) { return true } else { return false } } }

            const conn = await makeWAconnet({
                logger: pino({ level: 'silent' }),
                printQRInTerminal: false,
                mobile: false,
                browser: opcion('2') ? ['Chrome (Linux)', '', ''] : ['ZennBot-MD', 'Edge', '2.0.0'],
                auth: state,
                msgNodeCache,
                generateHighQualityLinkPreview: true,
                getMessage: async (key) => { if (store) { const msg = await store.loadMessage(key.remoteJid, key.id); return msg?.message || undefined } return proto.Message.fromObject({}) },
                version
            })

            if (typeof conn.mySubBot == 'undefined') conn.mySubBot = false

            if (SubBot) {
                connect.connection = async (update) => {
                    console.log(update); const { connection, lastDisconnect } = update
                    if (connection === 'close') {
                        const shouldReconnect = lastDisconnect.error instanceof Boom && lastDisconnect.error.output?.statusCode !== DisconnectReason.loggedOut; console.log('Conexión cerrada debido a ', lastDisconnect.error, ', reconectando... ', shouldReconnect); if (!connect.contador) { connect.contador = 0 } if (connect.contador) connect.contador += 1; if (shouldReconnect) { await StartBot().catch(console.error) }
                    } else if (connection === 'open') { console.log('Conectado ✓') } if (global.db.data == null) loadDatabase()
                }
            } else {
                const { chat, opcion } = conns.SubBot[sender]
                connect.connection = async (update) => {
                    const { connection, lastDisconnect, qr } = update

                    if (connection === 'close') { const shouldReconnect = lastDisconnect.error instanceof Boom && lastDisconnect.error.output?.statusCode !== DisconnectReason.loggedOut; console.log('Conexión cerrada debido a ', lastDisconnect.error, ', reconectando... ', shouldReconnect); if (connect.contador === false) { connect.contador = 1 } if (connect.contador) connect.contador += 1; if (shouldReconnect) { await StartBot().catch(console.error) } }
                    else if (connection === 'open') {
                        console.log('SubBot conectado ✓')
                        if (global.db.data == null) loadDatabase()
                        await conns.sendMessage(chat, { text: 'Conexion establecida' })
                        if (!global.db.data.settings[getContentType(global.db.data.settings)].SubBots[sender]) global.db.data.settings[getContentType(global.db.data.settings)].SubBots[sender] = { User: sender, SubBot: opcion('1') ? sender : conns.SubBot[sender].numero, clave: randomBytes(3).toString('hex') }
                        await conns.sendMessage(sender, { text: `*Clave de acceso:* indefinido` })
                        delete conns.SubBot[sender]
                    }

                    if (qr && opcion == '1') {
                        await conns.sendMessage(chat, { image: await qrcode.toBuffer(qr, { scale: 8 }), caption: "Escanea este QR para convertirte en un bot temporal\n\n*1)* Haz clic en los tres puntos en la esquina superior derecha\n*2)* Toca WhatsApp Web\n*3)* Escanea este QR\n\n*El QR expira a los 45 segundos*" }, { quoted: { key: { participant: '0@s.whatsapp.net' }, message: { documentMessage: { title: `Conexion por codigo Qr.`, jpegThumbnail: null } } } })
                    }

                    if (qr && opcion == '2') {
                        const { chat } = conns.SubBot[sender]
                        const numero = conns.SubBot[sender].numero.replace(/[^0-9]/g, '')
                        if (numero.match(/^\d+$/) && Object.keys(PHONENUMBER_MCC).some(v => numero.startsWith(v))) { await conns.sendMessage(chat, { text: "Conexion por codigo de *8 digitos.*\n\n*1)* Haz clic en los tres puntos en la esquina superior derecha\n*2)* Toca WhatsApp Web\n*3)* da click en vincular con codigo de teléfono\n*4)* pega el codigo a continuación" }, { quoted: { key: { participant: '0@s.whatsapp.net' }, message: { documentMessage: { title: `Conexion por codigo de 8 digitos.`, jpegThumbnail: null } } } }) }

                        setTimeout(async () => {
                            let phoneCode = await conn.requestPairingCode(numero)
                            await conns.sendMessage(chat, { text: phoneCode.match(/.{1,4}/g).join("-") })
                        }, 2000)
                    }
                }
            }


            store?.bind(conn.ev)
            conn.ev.on('creds.update', saveCreds)
            conn.ev.on("connection.update", async (update) => { await connect.connection(update).catch(e => connect.error = util.format(e)) })
            conn.ev.on('messages.upsert', async (m) => { await messages_upsert(conn, m, store).catch(e => connect.error = util.format(e)) })
            conn.ev.on("groups.update", async (json) => { await groups_update(conn, json).catch(e => connect.error = util.format(e)) })
            conn.ev.on('group-participants.update', async (anu) => { await group_participants_update(conn, anu).catch(e => connect.error = util.format(e)) })

            const stopBot = (stop = false) => {
                if (!stop) return
                try { conn.ws.close() } catch { };
                if (conns.SubBot[sender]) delete conns.SubBot[sender]
                console.log('Conexión cerrada')
                conn.ev.removeAllListeners();
                connect.start = false
            }

            if (conn.mySubBot) { stopBot(true) } else { setInterval(async () => { if (!conn.user) { stopBot(true) } }, 2 * 60 * 1000) }
        }

        await StartBot()

        if (connect.contador) {
            if (connect.contador > 4) {
                if (global.db.data.settings[getContentType(global.db.data.settings)].SubBots) delete global.db.data.settings[getContentType(global.db.data.settings)].SubBots[sender]
                fs.rmdir(`SubBots/${sender}`, { recursive: true })
                console.log(`La conexión fue eliminada después de cinco intentos fallidos al establecerla.`)
                connect.contador = false
                connect.start = false
            }
        }

        setInterval(async () => { if (connect.contador) { connect.contador = false } }, 3 * 60 * 1000)
    } catch (e) { connect.error = util.format(e) }
}
