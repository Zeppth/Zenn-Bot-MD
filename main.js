import yargs from 'yargs'
import lodash from 'lodash'
import { Low, JSONFile } from 'lowdb'
import pino from 'pino'
import NodeCache from 'node-cache'
import chalk from 'chalk'
import path, { join } from 'path'
import { format } from 'util'
import { readdirSync, unlinkSync } from 'fs'
import readline from 'readline'
import fs from 'fs'
import moment from 'moment-timezone'
import './config.js'
import { messages_upsert, groups_update, group_participants_update, connection_update, database } from './script.js'

const menu = (`╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
┊ ¿CÓMO DESEA CONECTARSE?
┠┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
┊ 1. Código QR.
┊ 2. Código de 8 digitos.
┠┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
┊ introduzca 1 o 2
┠┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅`)

let connect = {}

const { chain } = lodash
const { default: makeWAconnet, useMultiFileAuthState, makeInMemoryStore, fetchLatestBaileysVersion, proto } = (await import('@whiskeysockets/baileys')).default
const __dirname = global.__dirname(import.meta.url);
const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })
const readLine = readline.createInterface({ input: process.stdin, output: process.stdout, prompt: '' })
const question = (texto) => { return new Promise((resolver) => { readLine.question(texto, (respuesta) => { resolver(respuesta.trim()) }) }) }
const msgNodeCache = new NodeCache()
const Sesion = 'Sesion'

let zenn = {
  creds: fs.existsSync(`./${Sesion}/creds.json`) ? true : false,
  conexion: false,
  numero: false,
  stop: false,
}

global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse());
global.db = new Low(/https?:\/\//.test(opts['db'] || '') ? new cloudDBAdapter(opts['db']) : new JSONFile(`${opts._[0] ? opts._[0] + '_' : ''}database.json`));

global.loadDatabase = async function loadDatabase() { if (global.db.READ) { return new Promise((resolve) => setInterval(async function () { if (!global.db.READ) { clearInterval(this); resolve(global.db.data == null ? global.loadDatabase() : global.db.data) } }, 1 * 1000)) } if (global.db.data !== null) return; global.db.READ = true; await global.db.read().catch(console.error); global.db.READ = null; global.db.data = { users: {}, chats: {}, cloud: {}, settings: {}, ...(global.db.data || {}) }; global.db.chain = chain(global.db.data) }
loadDatabase();

if (global.db) setInterval(async () => { if (global.db.data) await global.db.write() }, 20 * 1000)

async function StartBot() {
  const { state, saveCreds } = await useMultiFileAuthState(Sesion)
  const { version } = await fetchLatestBaileysVersion()

  if (!zenn.creds) {
    console.log(chalk.greenBright(menu))

    while (!zenn.stop) {
      if (zenn.conexion == '2') {
        const m = await question(`${chalk.white('┠') + chalk.red('┅') + chalk.white('[ ') + chalk.greenBright('Escriba el número de WhatsApp que será Bot') + chalk.white(' ]') + '\n'}${chalk.white('┠') + chalk.red('┅') + chalk.white('>')} `)
        const text = m.trim().split(/ +/).shift().toLowerCase()
        const regex = /(\+?\d{1,4}?[-.\s]?)?(\()?(\d{1,3}?)\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g;
        const numeros = text.match(regex);
        zenn.numero = numeros[0].replace(/\s|-|\(|\)|\+/g, '')
        zenn.stop = true

      } else {
        const m = await question(chalk.white('┠') + chalk.red('┅') + chalk.white('> '))
        const text = m.trim().split(/ +/).shift().toLowerCase()
        if (text == '1') { zenn.conexion = '1'; zenn.stop = true }
        else if (text == '2') { zenn.conexion = '2' }
        else if (!(text == '2' || text == '1')) console.log(`${chalk.white('╰') + chalk.red('┅') + chalk.white('[ ') + chalk.greenBright('Por favor, introduce solo el número 1 o 2.') + chalk.white(' ]')}\n`) + console.log(chalk.greenBright(menu))
      }
    }
  }

  const connection = {
    version,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false,
    mobile: false,
    browser: zenn.conexion == '1' ? ['ZennBot-MD', 'Edge', '2.0.0'] : ['Chrome (Linux)', '', ''],
    auth: state,
    msgNodeCache,
    generateHighQualityLinkPreview: true,
    getMessage: async (key) => { if (store) { const msg = await store.loadMessage(key.remoteJid, key.id); return msg?.message || undefined } return proto.Message.fromObject({}) }
  }

  const conn = await makeWAconnet(connection)
  store?.bind(conn.ev)

  if (zenn.conexion == '2') {
    if (conn.authState.creds.registered) return
    console.log(`${chalk.white('╰') + chalk.red('┅') + chalk.white('[ ') + chalk.greenBright('CODIGO : ' + (await conn.requestPairingCode(zenn.numero))?.match(/.{1,4}/g)?.join("-") || phoneVinculo) + chalk.white(' ]')}\n`)
  }

  conn.ev.on('creds.update', saveCreds);
  conn.ev.on('connection.update', async (update) => { await connection_update(update, StartBot).catch(e => { connect.error = format(e), console.log(format(e)) }) });
  conn.ev.on('messages.upsert', async (m) => {
    await database(conn, m).catch(e => { connect.error = format(e), console.log(format(e)) })
    await messages_upsert(conn, m, store, proto).catch(e => { connect.error = format(e), console.log(format(e)) })
  })
  conn.ev.on("groups.update", async (json) => { await groups_update(conn, json).catch(e => { connect.error = format(e), console.log(format(e)) }) })
  conn.ev.on('group-participants.update', async (anu) => { await group_participants_update(conn, anu).catch(e => { connect.error = format(e), console.log(format(e)) }) })

  setInterval(async () => { await conn.sendMessage(global.owner.find(o => o[2])?.[0] + '@s.whatsapp.net', { document: fs.readFileSync('./database.json'), caption: '● *fecha :* ' + moment().tz(Intl.DateTimeFormat().resolvedOptions().timeZone).format('DD/MM/YY HH:mm:ss'), mimetype: 'document/json', fileName: 'database.json' }) }, 2 * 60 * 60 * 1000)

  if (connect.error) { conn.sendMessage(global.owner.find(o => o[2])?.[0] + '@s.whatsapp.net', { text: connect.error }), connect.error = false }
}

await StartBot().catch(e => { console.log(format(e)); connect.error = format(e) })

function clearTmp() {
  const tmpDir = join(__dirname, 'tmp')
  readdirSync(tmpDir).forEach(file => { unlinkSync(join(tmpDir, file)) })
}

setInterval(async () => { clearTmp(); console.log(chalk.bold.cyanBright('ClearTmp')) }, 1000 * 60 * 2)
