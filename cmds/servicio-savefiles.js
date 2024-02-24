import moment from 'moment-timezone'
import path from 'path'

const command = {
    command: ['cleancloud', 'cloudclean', 'delfiles', 'delfile', 'mycloud', 'editfile', 'guardar', 'savefile', 'save', 'savecloud', 'sendfile', 'listfile'],
    categoria: ['servicio']
}

command.script = async (m, { conn }) => {
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
            if (istrue) { saveFiles.push(filesave); m.react(done); m.remCoin(true) } else { m.reply('El archivo no coincide con los formatos admitidos.'); m.react(error) }
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
}

export default command