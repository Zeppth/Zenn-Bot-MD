import { fileURLToPath, pathToFileURL } from 'url'
import { platform } from 'process'
import path from 'path'

global.owner = [
    ['5216673877887', 'Zeppth', true],
    ['5216671993513'],
    ['51907182818']
]

global.mods = ['5216673877887', '5216671993513', '51907182818']
global.prems = ['5216673877887', '5216671993513', '51907182818']

global.rpg = {
    data: {
        exp: 0,
        coin: 10,
        nivel: 0,
        role: 'Novato'
    },
    cantidad: {
        mineria: 1500, //XP
        tiempoMinera: 2 * 60 * 60 * 1000, //2 horas

        robar: 1000, //XP
        tiempoRobar: 2 * 60 * 60 * 1000, //2 horas

        claimFree: 3000, //XP
        claimPrem: 5000, //XP
        TiempoClaim: 24 * 60 * 60 * 1000 //24 horas
    },
    precios: {
        coin: 100,
        nivel: 500
    },
    role: [
        { name: 'Novato', nivel: 1 },
        { name: 'Aprendiz', nivel: 2 },
        { name: 'Practicante', nivel: 3 },
        { name: 'Asistente', nivel: 4 },
        { name: 'Ayudante', nivel: 5 },
        { name: 'Oficial Junior', nivel: 6 },
        { name: 'Oficial', nivel: 7 },
        { name: 'Oficial Senior', nivel: 8 },
        { name: 'Supervisor', nivel: 9 },
        { name: 'Jefe de Equipo', nivel: 10 },
        { name: 'Coordinador', nivel: 11 },
        { name: 'Administrador', nivel: 12 },
        { name: 'Gerente Junior', nivel: 13 },
        { name: 'Gerente', nivel: 14 },
        { name: 'Gerente Senior', nivel: 15 },
        { name: 'Director Junior', nivel: 16 },
        { name: 'Director', nivel: 17 },
        { name: 'Director Senior', nivel: 18 },
        { name: 'Vicepresidente Junior', nivel: 19 },
        { name: 'Vicepresidente', nivel: 20 },
        { name: 'Vicepresidente Senior', nivel: 21 },
        { name: 'Presidente Junior', nivel: 22 },
        { name: 'Presidente', nivel: 23 },
        { name: 'Presidente Senior', nivel: 24 },
        { name: 'CEO Junior', nivel: 25 },
        { name: 'CEO', nivel: 26 },
        { name: 'CEO Senior', nivel: 27 },
        { name: 'Propietario', nivel: 28 },
        { name: 'Fundador', nivel: 29 },
        { name: 'Visionario', nivel: 30 },
        { name: 'Pionero', nivel: 31 },
        { name: 'Innovador', nivel: 32 },
        { name: 'Revolucionario', nivel: 33 },
        { name: 'Genio', nivel: 34 },
        { name: 'Maestro', nivel: 35 },
        { name: 'Experto', nivel: 36 },
        { name: 'Profesional', nivel: 37 },
        { name: 'Especialista', nivel: 38 },
        { name: 'Autoridad', nivel: 39 },
        { name: 'Líder', nivel: 40 },
        { name: 'Dominante', nivel: 41 },
        { name: 'Supremo', nivel: 42 },
        { name: 'Invencible', nivel: 43 },
        { name: 'Inigualable', nivel: 44 },
        { name: 'Insuperable', nivel: 45 },
        { name: 'Inconquistable', nivel: 46 },
        { name: 'Invulnerable', nivel: 47 },
        { name: 'Inmortal', nivel: 48 },
        { name: 'Divino', nivel: 49 },
        { name: 'Legendario', nivel: 50 },
        { name: 'Mítico', nivel: 51 },
        { name: 'Épico', nivel: 52 },
        { name: 'Heroico', nivel: 53 },
        { name: 'Majestuoso', nivel: 54 },
        { name: 'Regio', nivel: 55 },
        { name: 'Imperial', nivel: 56 },
        { name: 'Soberano', nivel: 57 },
        { name: 'Supremo', nivel: 58 },
        { name: 'Omnipotente', nivel: 59 },
        { name: 'Omnisciente', nivel: 60 },
        { name: 'Omnipresente', nivel: 61 },
        { name: 'Infinito', nivel: 62 },
        { name: 'Eterno', nivel: 63 },
        { name: 'Absoluto', nivel: 64 },
        { name: 'Universal', nivel: 65 },
        { name: 'Galáctico', nivel: 66 },
        { name: 'Cósmico', nivel: 67 },
        { name: 'Celestial', nivel: 68 },
        { name: 'Estelar', nivel: 69 },
        { name: 'Solar', nivel: 70 },
        { name: 'Lunar', nivel: 71 },
        { name: 'Planetario', nivel: 72 },
        { name: 'Astral', nivel: 73 },
        { name: 'Espacial', nivel: 74 },
        { name: 'Dimensional', nivel: 75 },
        { name: 'Temporal', nivel: 76 },
        { name: 'Cuántico', nivel: 77 },
        { name: 'Metafísico', nivel: 78 },
        { name: 'Espectral', nivel: 79 },
        { name: 'Fantasmal', nivel: 80 },
        { name: 'Etéreo', nivel: 81 },
        { name: 'Elemental', nivel: 82 },
        { name: 'Mágico', nivel: 83 },
        { name: 'Místico', nivel: 84 },
        { name: 'Espiritual', nivel: 85 },
        { name: 'Divino', nivel: 86 },
        { name: 'Sagrado', nivel: 87 },
        { name: 'Santo', nivel: 88 },
        { name: 'Angelical', nivel: 89 },
        { name: 'Arcángel', nivel: 90 },
        { name: 'Serafín', nivel: 91 },
        { name: 'Querubín', nivel: 92 },
        { name: 'Deidad', nivel: 93 },
        { name: 'Semidiós', nivel: 94 },
        { name: 'Dios', nivel: 95 },
        { name: 'Dios Mayor', nivel: 96 },
        { name: 'Dios Supremo', nivel: 97 },
        { name: 'Dios de Dioses', nivel: 98 },
        { name: 'Creador', nivel: 99 },
        { name: 'El Todo', nivel: 100 }
    ]
}

global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') { return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString() }

global.__dirname = function dirname(pathURL) { return path.dirname(global.__filename(pathURL, true)) }

