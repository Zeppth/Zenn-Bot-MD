import now from 'performance-now'
import { exec } from 'child_process'

const command = {
    command: ['ping'],
    categoria: ['main']
}

command.script = async (m, { conn }) => {
    let timestamp = now();
    let latensi = now() - timestamp;
    exec(`neofetch --stdout`, (error, stdout, stderr) => {
        let child = stdout.toString("utf-8");
        let ssd = child.replace(/Memory:/, "Ram:")
        let pongs = ["Pong!!!", "Pong!!!", "Pong!", "Pong!", "Pong!", "Pong!", "Pong", "Pong", "Pong", "Pong", "Pong ", "Pong!", "Pong!", "Pong", "Pong! Con un giro inesperado", "Pong! Con un golpe rápido", "Pong! Con un golpe fuerte", "Pong! Con un golpe preciso", "Pong! Con un golpe bajo", "Pong! Con un golpe alto", "Pong! Con un golpe de revés", "Pong! Con un golpe de derecha", "Pong! Con un golpe de efecto", "Pong! Con un golpe de sorpresa", "Pong! Con un golpe de suerte", "Pong! Con un golpe de genio", "Pong! Con un golpe de maestría", "Pong! Con un golpe de campeón", "Pong! Con un golpe de leyenda", "*Pierde la partida por un golpe inesperado*", "*Pierde la partida por un golpe rápido*", "*Pierde la partida por un golpe fuerte*", "*Pierde la partida por un golpe preciso*", "*Pierde la partida por un golpe bajo*", "*Pierde la partida por un golpe alto*", "*Pierde la partida por un golpe de revés*", "*Pierde la partida por un golpe de derecha*", "*Pierde la partida por un golpe de efecto*", "*Pierde la partida por un golpe de sorpresa*", "*Pierde la partida por un golpe de suerte*", "*Pierde la partida por un golpe de genio*", "*Pierde la partida por un golpe de maestría*", "*Pierde la partida por un golpe de campeón*", "*Pierde la partida por un golpe de leyenda*"]

        let Pong = pongs[Math.floor(Math.random() * pongs.length)]
        m.reply(`${ssd} ${Pong}. *Velocidad de Repuesta* ${latensi.toFixed(4)} ms`)
    })
}

export default command