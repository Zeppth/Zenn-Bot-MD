import PhoneNumber from 'awesome-phonenumber'

const command = {
    command: ['creador', 'owner'],
    categoria: ['main']
}

command.script = async (m, { conn }) => {
    const name = (sender) => m.data('users', sender) ? m.data('users', sender).name ? m.data('users', sender).name : sender.split`@`[0] : sender.split`@`[0]

    await sendContactArray(conn, m.chat, [
        [`573206548526`, `${name('5216673877887@s.whatsapp.net')}`, `⚡ Creador`, null],
        [`51907182818`, `${name('51907182818@s.whatsapp.net')}`, `🤝 Colaborador`, null],
        [`5216671993513`, `${name('5216671993513@s.whatsapp.net')}`, `🤝 Colaborador`, null]
    ], { key: { fromMe: false, participant: "0@s.whatsapp.net", ...(m.chat ? { remoteJid: "status@broadcast" } : {}) }, message: { contactMessage: { displayName: 'Zenn-Bot 24/7', vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;0,;;;\nFN:0,\nitem1.TEL;waid=${global.owner.find(o => o[2])?.[0]}:${global.owner.find(o => o[2])?.[0]}\nitem1.X-ABLabell:Ponsel\nEND:VCARD` } } })
}

export default command

async function sendContactArray(conn, jid, data, quoted, options) {
    if (!Array.isArray(data[0]) && typeof data[0] === 'string') data = [data]
    let contacts = []
    for (let [number, name, isi, isi1] of data) { let vcard = `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:${name.replace(/\n/g, '\\n')}\nitem.ORG:${isi}\nitem1.TEL;waid=${number.replace(/[^0-9]/g, '')}:${PhoneNumber('+' + number.replace(/[^0-9]/g, '')).getNumber('international')}\nitem1.X-ABLabel:${isi1}\nEND:VCARD`.trim(); contacts.push({ vcard, displayName: name }) }
    return await conn.sendMessage(jid, { contacts: { displayName: (contacts.length > 1 ? `2013 kontak` : contacts[0].displayName) || null, contacts } }, { quoted, ...options })
}