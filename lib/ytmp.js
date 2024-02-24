import fetch from 'node-fetch'
import ytdl from 'ytdl-core'

const ytmp4 = async (url) => {
    const video = await ytdl.getInfo(url)
    const response = await fetch(video.formats[0].url);
    return await response.buffer();
}

const ytmp3 = async (URL) => {
    var ytmp3ID = URL.replace('https://m.youtu.be/', '').replace('https://youtu.be/', '').replace('https://www.youtube.com/', '').replace('watch?v=', '')

    const audioFormat = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' })
    let stream = await ytdl(ytmp3ID, { quality: 'highestaudio' })
    const video = await ytdl.getInfo(ytmp3ID)

    linkdirecto: info.videoDetails.video_url || '',
        linkdirecto2: audioFormat.url,

            ffmpeg(stream).audioBitrate(128).save(`/sdcard/yt-downloader/${video.videoDetails.videoId}.mp3`)
                .on('end', () => {
                    console.log(chalk.green('finished downloading!'))
                });
}