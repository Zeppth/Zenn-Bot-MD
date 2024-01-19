//by Zeppt 5216673877887

import yargs from 'yargs'
import lodash from 'lodash'
import { Low, JSONFile } from 'lowdb'
import pino from 'pino'
import NodeCache from 'node-cache'
import chalk from 'chalk'
import { join } from 'path'
import { format } from 'util'
import path from 'path'
import { readdirSync, unlinkSync } from 'fs'
import readline from 'readline'
import fs from 'fs'
import moment from 'moment-timezone'
import './config.js'
import { messages_upsert, groups_update, group_participants_update, connection_update } from './script.js'

const { default: makeWAconnet, useMultiFileAuthState, PHONENUMBER_MCC, makeInMemoryStore, fetchLatestBaileysVersion, proto } = (await import('@whiskeysockets/baileys')).default
const { chain } = lodash

global.uptime = timeString(process.uptime())
global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse());
global.db = new Low(/https?:\/\//.test(opts['db'] || '') ? new cloudDBAdapter(opts['db']) : new JSONFile(`${opts._[0] ? opts._[0] + '_' : ''}database.json`));

const __dirname = global.__dirname(import.meta.url);

global.DATABASE = global.db;
global.loadDatabase = async function loadDatabase() { if (global.db.READ) { return new Promise((resolve) => setInterval(async function () { if (!global.db.READ) { clearInterval(this); resolve(global.db.data == null ? global.loadDatabase() : global.db.data) } }, 1 * 1000)) } if (global.db.data !== null) return; global.db.READ = true; await global.db.read().catch(console.error); global.db.READ = null; global.db.data = { users: {}, chats: {}, cloud: {}, settings: {}, ...(global.db.data || {}) }; global.db.chain = chain(global.db.data) }
loadDatabase();

if (global.db) setInterval(async () => { if (global.db.data) await global.db.write() }, 20 * 1000)

const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })
const readLine = readline.createInterface({ input: process.stdin, output: process.stdout, prompt: '' })
const question = (texto) => { return new Promise((resolver) => { readLine.question(texto, (respuesta) => { resolver(respuesta.trim()) }) }) }
const msgNodeCache = new NodeCache()
const Sesion = 'Sesion'

const menu = (`╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
┊ ¿CÓMO DESEA CONECTARSE?
┠┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
┊ 1. Código QR.
┊ 2. Código de 8 digitos.
┠┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
┊ introduzca 1 o 2
┠┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅`)

let connect = {}

async function StartBot() {
  const { state, saveCreds } = await useMultiFileAuthState(Sesion)
  const { version } = await fetchLatestBaileysVersion()

  if (!fs.existsSync(`./${Sesion}/creds.json`)) {
    if (!connect.opcion) { connect.opcion = false }
    console.log(chalk.greenBright(menu))
    while (!connect.opcion) {
      const m = await question(chalk.white('┠') + chalk.red('┅') + chalk.white('> '))
      const comando = m.trim().split(/ +/).shift().toLowerCase()
      switch (comando) { case '1': { connect.opcion = '1' } break; case '2': { connect.opcion = '2' } break; default: { console.log(`${chalk.white('╰') + chalk.red('┅') + chalk.white('[ ') + chalk.greenBright('Por favor, introduce solo el número 1 o 2.') + chalk.white(' ]')}\n`) + console.log(chalk.greenBright(menu)) } }
    }
  }

  const connection = {
    version,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: connect.opcion == '1' ? true : false,
    mobile: false,
    browser: connect.opcion == '1' ? ['ZennBot-MD', 'Edge', '2.0.0'] : ['Chrome (Linux)', '', ''],
    auth: state,
    msgNodeCache,
    generateHighQualityLinkPreview: true,
    getMessage: async (key) => { if (store) { const msg = await store.loadMessage(key.remoteJid, key.id); return msg?.message || undefined } return proto.Message.fromObject({}) }
  }

  const conn = await makeWAconnet(connection)
  store?.bind(conn.ev)

  if (!fs.existsSync(`./${Sesion}/creds.json`)) {
    if (!connect.opcion === '2') return
    if (conn.authState.creds.registered) return
    if (!connect.Number) { connect.Number = false }

    while (!connect.Number) {
      const Number = await question(`${chalk.white('┠') + chalk.red('┅') + chalk.white('[ ') + chalk.greenBright('Escriba el número de WhatsApp que será Bot') + chalk.white(' ]') + '\n'}${chalk.white('┠') + chalk.red('┅') + chalk.white('>')} `)
      const numero = Number.replace(/[^0-9]/g, '')
      if (numero.match(/^\d+$/) && Object.keys(PHONENUMBER_MCC).some(v => numero.startsWith(v))) { connect.Number = numero; break } else { console.log('Error') }
    }

    setTimeout(async () => {
      let phoneVinculo = await conn.requestPairingCode(connect.Number)
      const code = phoneVinculo?.match(/.{1,4}/g)?.join("-") || phoneVinculo
      console.log(`${chalk.white('╰') + chalk.red('┅') + chalk.white('[ ') + chalk.greenBright('CODIGO : ' + code) + chalk.white(' ]')}\n`)
    }, 2000)
  }

  if (!conn.SubBotsList) conn.SubBotsList = {}
  conn.ev.on('creds.update', saveCreds);
  conn.ev.on('connection.update', async (update) => { await connection_update(update, StartBot).catch(e => connect.error = format(e)) });
  conn.ev.on('messages.upsert', async (m) => { await messages_upsert(conn, m, store, proto, false).catch(e => connect.error = format(e)) })
  conn.ev.on("groups.update", async (json) => { await groups_update(conn, json).catch(e => connect.error = format(e)) })
  conn.ev.on('group-participants.update', async (anu) => { await group_participants_update(conn, anu).catch(e => connect.error = format(e)) })

  setInterval(async () => { await conn.sendMessage(global.owner.find(o => o[2])?.[0] + '@s.whatsapp.net', { document: fs.readFileSync('./database.json'), caption: '● *fecha :* ' + moment().tz(Intl.DateTimeFormat().resolvedOptions().timeZone).format('DD/MM/YY HH:mm:ss'), mimetype: 'document/json', fileName: 'database.json' }) }, 2 * 60 * 60 * 1000)

  async function SubBots(ruta) {
    if (!fs.existsSync(ruta)) { return null }
    let SubBots = fs.readdirSync(ruta).filter(archivo => { return fs.statSync(path.join(ruta, archivo)).isDirectory() && !archivo.includes('@s.whatsapp.net') })
    conn.SubBotsList = SubBots
    console.log(SubBots)
  }

  await SubBots('./SubBots')
  if (connect.error) { conn.sendMessage(global.owner.find(o => o[2])?.[0] + '@s.whatsapp.net', { text: connect.error }), connect.error = false }
}

try { await StartBot() } catch (e) { console.log(e); connect.error = e }

function timeString(seconds) {
  seconds = Number(seconds);
  var d = Math.floor(seconds / (3600 * 24));
  var h = Math.floor(seconds % (3600 * 24) / 3600);
  var m = Math.floor(seconds % 3600 / 60);
  var s = Math.floor(seconds % 60);
  var dDisplay = d > 0 ? d + (d == 1 ? ":" : ":") : "";
  var hDisplay = h > 0 ? h + (h == 1 ? ":" : ":") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? ":" : ":") : "";
  var sDisplay = s > 0 ? s + (s == 1 ? "" : "") : "";
  return dDisplay + hDisplay + mDisplay + sDisplay;
}

function clearTmp() {
  const tmpDir = join(__dirname, 'tmp')
  readdirSync(tmpDir).forEach(file => { unlinkSync(join(tmpDir, file)) })
}

setInterval(async () => { clearTmp(); console.log(chalk.bold.cyanBright('ClearTmp')) }, 1000 * 60 * 2)
