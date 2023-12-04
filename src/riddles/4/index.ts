import { getLines } from "../../utils"

type Card = {
    id: number,
    winning: number[],
    values: number[]
}

const CARD = 'Card '
const SEPERATOR_ID = ':'
const SEPERATOR_VALUES = '|'

const parseValues = (line: string): number[] => line.split(' ').map(value => +value)

const parseCard = (line: string): Card => {
    const splitId = line.split(SEPERATOR_ID)
    const splitValues = splitId[1].split(SEPERATOR_VALUES)

    const id = +splitId[0].replaceAll(CARD, '')
    const winning = parseValues(splitValues[0])
    const values = parseValues(splitValues[1])

    return {
        id,
        winning,
        values
    }
}

const parseCards = (lines: string[]): Card[] => lines.map(parseCard)

const winningNumbers = (card: Card): number => card.values.filter(value => card.winning.find(win => value === win)).length

const analyzeCards = (cards: Card[]): number => {
    const matches: number[] = cards.reduce<number[]>((acc, curr) => [...acc, winningNumbers(curr)], []).filter(win => win)

    return matches.map(match => Math.pow(2, (match - 1))).reduce<number>((acc, curr) => acc += curr, 0)
}

// PART 1
const lines = getLines(4)
const cards = parseCards(lines)
const sum1 = analyzeCards(cards)
console.log('Sum 1', sum1)

// PART 2
const multiplyCards = (cards: Card[], additionalCards: Card[]): Card[] => {
    const originalCards = [...cards]

    return additionalCards.reduce<Card[]>((acc, curr) => {
        const winningNumbersAmount = winningNumbers(curr)

        if (!winningNumbersAmount) return [...acc, curr]

        const newCards = originalCards.slice(curr.id, curr.id + winningNumbersAmount)
        const multipliedCards = multiplyCards(originalCards, newCards)
        return [...acc, curr, ...multipliedCards]
    },[])
}

const multipliedCards = multiplyCards(cards, cards)
console.log('Sum 2', multipliedCards.length)