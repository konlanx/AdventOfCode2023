import * as fs from 'fs';
import * as path from 'path';

type Round = {
    red: number,
    green: number,
    blue: number
}

type Game = {
    id: string,
    rounds: Round[]
}

const CONSTRAINTS = {'red': 12, 'green': 13, 'blue': 14}
const GAME = 'Game '

const getLines = (): string[] => {
    const content = fs.readFileSync(path.resolve(__dirname, '../../../assets/riddles/2/input.txt'), 'utf8')
    return content.split('\n')
}

const convertScore = (scoreContent: string[], identifier: string): number => 
    +(scoreContent.find(score => score.endsWith(identifier))?.replace(` ${identifier}`, '') ?? 0)

const convertRounds = (roundContent: string): Round => {
    const scores = roundContent.split(',')

    const red = convertScore(scores, 'red')
    const blue = convertScore(scores, 'blue')
    const green = convertScore(scores, 'green')

    return {
        red,
        blue,
        green
    }
}

const convertGames = (): Game[] => getLines().map(line => {
    const contents = line.split(':')

    const id = contents[0].replace(GAME, '')

    const roundContents = contents[1].split(';')

    const rounds = roundContents.map(convertRounds)

    return {
        id,
        rounds
    }
})

const games = convertGames()

// PART 1
const verifyGame = (game: Game): boolean => !game.rounds.find(round => round.red > CONSTRAINTS.red || round.blue > CONSTRAINTS.blue || round.green > CONSTRAINTS.green)
const filterGames = (games: Game[]): Game[] => games.filter(verifyGame)

const filteredGames = filterGames(games)

const sum = filteredGames.reduce<number>((acc, curr) => acc += +curr.id, 0)
console.log('Sum', sum)

// PART 2
const minRound = (game: Game): Round => game.rounds.reduce<Round>((acc, curr) => (
    {
        red: acc.red > curr.red ? acc.red : curr.red, 
        green: acc.green > curr.green ? acc.green : curr.green, 
        blue: acc.blue > curr.blue ? acc.blue : curr.blue
    }), {red: 0, blue: 0, green: 0})

const minRounds = (games: Game[]): Round[] => games.map(minRound)

const powers = (rounds: Round[]): number[] => rounds.map(round => round.red * round.blue * round.green)

const minPowers = powers(minRounds(games))

const sum2 = minPowers.reduce((acc, curr) => acc += curr, 0)
console.log('Sum 2', sum2)