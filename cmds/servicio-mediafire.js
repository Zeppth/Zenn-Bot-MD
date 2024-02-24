import axios from 'axios'
import cheerio from 'cheerio'

const command = {
    command: ['mediafire', 'mdf'],
    categoria: ['servicio']
}

command.script = async (m, { conn }) => {
    if (!m.args[0]) return m.reply('Y el link?')
    const res = await mediafireDl(m.args[0]);
    const { name, size, date, mime, link } = res;
    m.react(rwait)
    const caption = `『 MEDIAFIRE / Zenn Bot MD 』
      
*▢ Nombre:*  ${name}
*▢ Tamaño:* ${size}
*▢ Extension:* ${mime}

Enviando archivo${readMore}`.trim();
    await m.reply(caption);
    await conn.sendMessage(m.chat, { document: { url: (await conn.getFile(link).data).catch(e => conn.getFile(link).data) }, mimetype: 'video/' + mime, fileName: name }, { quoted: m }); m.react(done)
}

export default command

async function mediafireDl(url) {
    if (!url) return;
    const res = await axios.get(`https://www-mediafire-com.translate.goog/${url.replace('https://www.mediafire.com/', '')}?_x_tr_sl=en&_x_tr_tl=fr&_x_tr_hl=en&_x_tr_pto=wapp`);
    const $ = cheerio.load(res.data);
    const link = $('#downloadButton').attr('href');
    const name = $('body > main > div.content > div.center > div > div.dl-btn-cont > div.dl-btn-labelWrap > div.promoDownloadName.notranslate > div').attr('title').replaceAll(' ', '').replaceAll('\n', '');
    const date = $('body > main > div.content > div.center > div > div.dl-info > ul > li:nth-child(2) > span').text();
    const size = $('#downloadButton').text().replace('Download', '').replace('(', '').replace(')', '').replace('\n', '').replace('\n', '').replace('                         ', '').replaceAll(' ', '');
    let mime = '';
    const rese = await axios.head(link);
    mime = rese.headers['content-type'];
    return { name, size, date, mime, link };
}