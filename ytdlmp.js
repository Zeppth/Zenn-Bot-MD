import ytdl from 'ytdl-core'
import { randomBytes } from 'crypto'
import ffmpeg from 'fluent-ffmpeg'
import axios from 'axios'
import fs from 'fs'
import yts from 'yt-search'

//By Zephyr
const ytIdRegex = /(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/
function isYTUrl(url) { return ytIdRegex.test(url) }
function getVideoID(url) { if (!isYTUrl(url)) throw new Error('No es un link de YouTube'); return ytIdRegex.exec(url)[1] }
const fetchBuffer = async (url, options) => { try { options ? options : {}; const res = await axios({ method: "GET", url, headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.70 Safari/537.36", 'DNT': 1, 'Upgrade-Insecure-Request': 1 }, ...options, responseType: 'arraybuffer' }); return res.data } catch (err) { return err } }

async function dlmp4(Url, Quality = '360p', funcun = false, conn) {
    const url = isYTUrl(Url) ? 'https://www.youtube.com/watch?v=' + getVideoID(Url) : Url
    const info = await ytdl.getInfo(url)
    try {
        const format = ytdl.chooseFormat(info.formats, { quality: Quality == 'highest' ? 'highestvideo' : Quality == '1080p' ? '137' : Quality == '720p' ? '136' : Quality == '480p' ? '135' : Quality == '360p' ? '134' : '18' })
        const videoStream = ytdl(url, { format: format })

        let starttime
        videoStream.once('response', () => { starttime = Date.now() })
        if (funcun) {
            videoStream.on('progress', async (chunkLength, downloaded, total) => {
                const percent = downloaded / total
                const downloadedMinutes = (Date.now() - starttime) / 1000 / 60;
                const estimatedDownloadTime = (downloadedMinutes / percent) - downloadedMinutes
                Array.isArray(conn) ? await conn[0].sendMessage(conn[1].chat, { text: `${(percent * 100).toFixed(2)}% Downloaded, tiempo estimado: ${estimatedDownloadTime.toFixed(2)}minutes `, edit: conn[2] }) : null
            })
        }
        const audioFormat = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' })
        const audioStream = ytdl.downloadFromInfo(info, { format: audioFormat })
        const Calidad = info.formats.map((format, index) => { return `Calidad ${index + 1}: ${format.qualityLabel}` })
        const fileName = randomBytes(3).toString('hex')
        const outputPath = `./tmp/${fileName}.mp4`
        const audioPath = `./tmp/${fileName}_audio.mp4`

        await new Promise((resolve, reject) => { audioStream.pipe(fs.createWriteStream(audioPath)).on('finish', resolve).on('error', reject) })

        await new Promise((resolve, reject) => { ffmpeg().input(videoStream).input(audioPath).outputOptions('-c:v copy').outputOptions('-c:a aac').outputOptions('-map 0:v:0').outputOptions('-map 1:a:0').output(outputPath).on('error', reject).on('end', resolve).run() })
        fs.unlinkSync(audioPath)

        return {
            path: outputPath,
            info: {
                title: info.videoDetails.title,
                description: info.videoDetails.description,
                author: info.videoDetails.author?.name,
                thumbnail2: info.videoDetails.thumbnail?.thumbnails[0].url,
                thumbnail: await fetchBuffer(info.videoDetails.thumbnail.thumbnails[0].url),
                videoId: info.videoDetails.videoId || '',
                timestamp: info.videoDetails.lengthSeconds + ' segundos' || '',
                views: info.videoDetails.viewCount || '',
                ago: info.videoDetails.publishDate || '',
                url,
                qualitylist: Calidad,
                quality: Quality,
                size: fs.statSync(outputPath).size,
                linkdirecto: info.videoDetails.video_url || '',
                linkdirecto2: audioFormat.url,
            }
        }
    } catch (error) {
        console.error(error);
        return { error: error.message }
    }
}


async function mp3(Url) {
    const url = isYTUrl(Url) ? 'https://www.youtube.com/watch?v=' + getVideoID(Url) : Url
    const info = await ytdl.getInfo(url)
    try {
        const audioFormat = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' })
        const audioStream = ytdl.downloadFromInfo(info, { format: audioFormat })
        const fileName = randomBytes(3).toString('hex')
        const songPath = `./tmp/${fileName}.mp3`
        await new Promise((resolve, reject) => { audioStream.pipe(fs.createWriteStream(songPath)).on('finish', () => resolve(songPath)).on('error', (error) => reject(error)) })

        return {
            path: songPath,
            info: {
                title: info.videoDetails.title,
                description: info.videoDetails.description,
                author: info.videoDetails.author.name,
                thumbnail2: info.videoDetails.thumbnail.thumbnails[0].url,
                thumbnail: await fetchBuffer(info.videoDetails.thumbnail.thumbnails[0].url),
                videoId: info.videoDetails.videoId,
                timestamp: info.videoDetails.lengthSeconds + ' segundos',
                views: info.videoDetails.viewCount,
                ago: info.videoDetails.publishDate,
                url,
                size: fs.statSync(songPath).size
            }
        }
    } catch (error) {
        console.error(error)
        return { error: error.message }
    }
}

const ytSearch = async (url) => {
    try {
        const vid = (await yts(m.text)).all[0]
        if (!vid) return m.reply(`Sin resultados`)
    } catch {
        const info = await ytdl.getInfo(url)
    }
}

function YoutTube(texto) {
    var text = texto.split(' ')
    var enlaces = []
    var contador = 0

    for (var i = 0; i < text.length; i++) {
        if (ytIdRegex.test(text[i])) {
            enlaces.push(text[i]);
            contador++;
            if (contador === 5) { break }
        }
    }
    return enlaces
}


export { dlmp4, mp3, getVideoID, fetchBuffer, YoutTube, ytIdRegex }

