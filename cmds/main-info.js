import { sizeFormatter } from 'human-readable'
import { cpus as _cpus, arch, freemem, hostname, platform, totalmem, type } from 'os'
import { performance } from 'perf_hooks'
import now from 'performance-now'

const command = {
    command: ['info', 'informacion'],
    categoria: ['main']
}

command.script = async (m, { conn }) => {
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

    await conn.sendMessage(m.chat, {
        text: texto, contextInfo: {
            externalAdReply: {
                title: 'Zenn Bot MD (en proceso)', body: `Activo: ${global.uptime} / procesamiento : ${speed} milisegundos`, thumbnailUrl: m.multimedia('imagenes/thumbnail.jpg'), mediaType: 1, renderLargerThumbnail: true
            }
        }
    }, { quoted: m })
}

export default command