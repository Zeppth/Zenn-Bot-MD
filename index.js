/// by DAVID-774
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { setupMaster, fork } from 'cluster'
import { watchFile, unwatchFile } from 'fs'
import { createInterface } from 'readline'
import chalk from 'chalk'
import yargs from 'yargs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
const rl = createInterface(process.stdin, process.stdout)

console.log(chalk.greenBright('conectado.\n'))
console.log(chalk.red('By Zeppth\n\n'))

var isRunning = false;

function start(file) {
    if (isRunning) return;
    isRunning = true;
    let args = [join(__dirname, file), ...process.argv.slice(2)]
    setupMaster({ exec: args[0], args: args.slice(1) })
    const p = fork();

    p.on('exit', (_, code) => { isRunning = false; console.error(chalk.bgRed('\n\n! Salió del código ! : '), chalk.bgWhite(code + '\n')); p.process.kill(); start.apply(this, arguments); if (code === 0) return; watchFile(args[0], () => { unwatchFile(args[0]); start(file) }) })

    if (!opts['test']) if (!rl.listenerCount()) rl.on('line', line => { p.emit('message', line.trim()) })
};

/*function start(file) {
    if (isRunning) return;
    isRunning = true;
    let args = [join(__dirname, file), ...process.argv.slice(2)]
    setupMaster({ exec: args[0], args: args.slice(1) })
    let p = fork(); p.on('message', data => {
        console.log('\n >', data + '\n')
        switch (data) { case 'reset': p.process.kill(); isRunning = false; start.apply(this, arguments); break; case 'uptime': p.send(process.uptime()); break }
    })

    p.on('exit', (_, code) => {
        isRunning = false;
        console.error(chalk.bgRed('\n\n! Salió del código ! : '), chalk.bgWhite(code + '\n')); p.process.kill()
        start.apply(this, arguments); if (code === 0) return; watchFile(args[0], () => { unwatchFile(args[0]); start(file) })
    })

    if (!opts['test']) if (!rl.listenerCount()) rl.on('line', line => { p.emit('message', line.trim()) })
};*/

start('main.js')