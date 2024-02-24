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

const command = {
    command: ['encender', 'true', 'habilitar', 'deshabilitar', 'false', 'apagar'],
    cantegoria: ['grupos']
}

command.script = async (m, { conn }) => {
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
}

export default command