const command = {
    command: ['banlist', 'premlist', 'modrlist', 'moderadorlist', 'ownerlist', 'rownerlist'],
    categoria: ['propietario']
}

command.script = async (m, { conn }) => {
    if (!m.isModr ?? !m.isOwner ?? !m.isROwner) return m.sms('owner')
    if (m.command == 'banlist') {
        let users = Object.entries(global.db.data.users).filter(user => user[1].banned)
        m.reply(`*『 USUARIOS BANEADOS 』*\n\n▢ Total : *${users.length}*\n\n${users ? '\n' + users.map(([jid], i) => `${i + 1}. ${conn.getName(jid) == undefined ? 'Desconocido' : conn.getName(jid)}\n▢ ${jid}`.trim()).join('\n\n') : ''}`.trim())
    }

    else if (m.command == 'premlist') {
        let users = Object.entries(global.db.data.users).filter(user => user[1].premium)
        m.reply(`*『 USUARIOS premium 』*\n\n▢ Total : *${users.length}*\n\n${users ? '\n' + users.map(([jid], i) => `${i + 1}. ${conn.getName(jid) == undefined ? 'Desconocido' : conn.getName(jid)}\n▢ ${jid}`.trim()).join('\n\n') : ''}`.trim())
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
}

export default command