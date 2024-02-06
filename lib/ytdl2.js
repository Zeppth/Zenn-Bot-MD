import ytdl from 'youtubedl-core'
import fs from 'fs'
import { randomBytes } from 'crypto'
import axios from 'axios'

const ytIdRegex = /(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/

const fetchBuffer = async (url, options) => { try { options ? options : {}; const res = await axios({ method: "GET", url, headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.70 Safari/537.36", 'DNT': 1, 'Upgrade-Insecure-Request': 1 }, ...options, responseType: 'arraybuffer' }); return res.data } catch (err) { console.error(err); throw err } }

const isYTUrl = (url) => { return ytIdRegex.test(url) }
const getVideoID = (url) => { if (!isYTUrl(url)) { throw new Error('is not YouTube URL') } return ytIdRegex.exec(url)[1] }
const buildYTUrl = (query) => { const videoId = isYTUrl(query) ? getVideoID(query) : query; return 'https://www.youtube.com/watch?v=' + videoId }

const mp4 = async (query) => {
    try {
        if (!query) throw new Error('Video ID or YouTube Url is required')
        const videoInfo = await ytdl.getInfo(buildYTUrl(query), { lang: 'id' });
        const format = ytdl.chooseFormat(videoInfo.formats, { format: '136', filter: 'videoandaudio' });
        return {
            title: videoInfo.videoDetails.title,
            thumb: videoInfo.videoDetails.thumbnails.slice(-1)[0],
            date: videoInfo.videoDetails.publishDate,
            duration: videoInfo.videoDetails.lengthSeconds,
            channel: videoInfo.videoDetails.ownerChannelName,
            quality: format.qualityLabel,
            contentLength: format.contentLength,
            description: videoInfo.videoDetails.description,
            videoUrl: format.url
        };
    } catch (error) { console.error(error); throw error }
}

const mp3 = async (url) => {
    try {
        if (!url) throw new Error('Video ID or YouTube Url is required')
        url = buildYTUrl(url);
        const { videoDetails } = await ytdl.getInfo(url, { lang: 'id' });
        let stream = ytdl(url, { filter: 'audioonly', quality: 140 });
        let songPath = `./tmp/${randomBytes(3).toString('hex')}.mp3`

        await new Promise((resolve, reject) => { stream.pipe(fs.createWriteStream(songPath)).on('finish', () => resolve(songPath)).on('error', (error) => reject(error)) });

        return {
            path: songPath,
            info: {
                title: videoDetails.title,
                description: videoDetails.description,
                author: videoDetails.author.name,
                thumbnail2: videoDetails.thumbnail.thumbnails[0].url,
                image: videoDetails.thumbnails.slice(-1)[0].url,
                thumbnail: await fetchBuffer(videoDetails.thumbnail.thumbnails[0].url),
                videoId: videoDetails.videoId,
                timestamp: videoDetails.lengthSeconds + ' segundos',
                views: videoDetails.viewCount,
                ago: videoDetails.publishDate,
                url,
                size: fs.statSync(songPath).size
            },
        };
    } catch (error) { console.error(error); throw error }
}

export default { fetchBuffer, mp3, mp4 };
