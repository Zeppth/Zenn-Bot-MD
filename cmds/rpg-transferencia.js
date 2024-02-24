const command = {
    command: ['transferir'],
    categoria: ['rpg']
}

command.script = async (m, { conn }) => {
    if (!m.text) return m.reply(`• Para utilizar el comando cada parte de este debe estar separada por “|”. Espesifica el item (ejemplo coin, xp), la cantidad y el usuario de destino. transferir [ item ] | [ cantidad ] | [ destino ].\n\n• Ejemplo : *.transferir coin | 10 | @${m.sender.split`@`[0]}.*`)

    if (conn.before[m.sender]) return m.reply('Tienes una gestión en curso, por favor, procede a cerrarla antes de realizar este comando.')
    const [objeto, cantidad, destino] = (m.text.split(' ').join('')).split('|')
    if (!(objeto || cantidad || destino)) return m.reply(`• Para utilizar el comando cada parte de este debe estar separada por “|”. Espesifica el item (ejemplo coin, xp), la cantidad y el usuario de destino. transferir [ item ] | [ cantidad ] | [ destino ].\n\n• Ejemplo : *.transferir coin | 10 |  @${m.sender.split`@`[0]}.*`)

    let UserDestino = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : destino ? (destino.replace(/[@ .+-]/g, '') + '@s.whatsapp.net') : ''

    if (!(UserDestino in global.db.data.users)) return m.reply(`El Usuario no está en mi base de datos`)

    const Cantidad = parseInt(cantidad)
    const { exp, coin } = m.data('users', m.sender)

    let item = false
    if (objeto == 'coin' || objeto == 'coins') {
        if (m.isPrems && !m.isModr) return m.reply('Como usuario premium, dispones de una cantidad ilimitada de coins. Sin embargo, debido a esto no puedes compartir ninguna de estas coins')

        if (coin < Cantidad) return m.reply('No tienes sufientes coins para transferir'); item = 'coin'
    } else if (objeto == 'exp' || objeto == 'xp') { if (exp < Cantidad) return m.reply('No tienes sufiente *EXP* para transferir'); item = 'exp' }

    if (!item) return m.reply('El item a transferir no existe en base de datos')
    const Numero = UserDestino.split`@`[0]

    m.reply(`¿Está seguro de que desea transferir *${Cantidad} ${objeto}* a  *@${UserDestino.split('@')[0]}* ?\n\nTienes  *60* segundos. Confirme  que desea realizar la transferencia repondiendo con un 'si'. Si no esta deacuerdo, puede responder con un 'no' para cancelar esta acción`.trim())

    conn.before[m.sender] = {
        setTimeout: setTimeout(() => (m.reply('Se acabó el tiempo, transferencia cancelada'), delete conn.before[m.sender]), 60 * 1000),
        script: async (m, conn) => {
            const upsert = m.body.toLowerCase();
            const settimeout = conn.before[m.sender].setTimeout
            const { User, destino, object, numero } = {
                User: m.sender,
                destino: UserDestino,
                numero: Numero,
                object: { item: item, cantidad: Cantidad },
                message: m.key,
            }
            if (!(m.sender == User)) return;

            if (upsert == 'no') {
                clearTimeout(settimeout)
                delete conn.before[m.sender]
                return m.reply('● *Transferencia Cancelada ✓*')
            }

            if (upsert == 'si') {
                if (m.user(User)) console.log('@User')
                else m.data('users', User)[object.item] -= object.cantidad
                m.data('users', destino)[object.item] += object.cantidad
                m.reply(`● *Transferencia realizada ✓*\n\n*• ${object.cantidad} ${object.item}* a @${numero}`)
                clearTimeout(settimeout)
                delete conn.before[m.sender]
            }
        }
    }
}

export default command