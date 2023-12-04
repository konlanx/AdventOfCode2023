import * as fs from 'fs';
import * as path from 'path';
import { getLines, isNumericChar } from '../../utils';

const NUMBERS: {[id: number]: string} = {1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'six', 7: 'seven', 8: 'eight', 9: 'nine'}

const convertLine = (line: string, result = ''): string => {
    if (!line) return result

    const numericChar = isNumericChar(line[0])

    if (numericChar) return convertLine(line.substring(1), `${result}${line[0]}`)

    const number = Object.keys(NUMBERS).find(number => line.startsWith(NUMBERS[+number]))
    if (number) return convertLine(line.substring(number.length), `${result}${number}`)

    return convertLine(line.substring(1), result)
}

const parseLine = (line: string): number => {
    const convertedLine = convertLine(line)
    const firstNumber = convertedLine[0]
    const lastNumber = convertedLine[convertedLine.length - 1]

    const sum = `${firstNumber}${lastNumber}`

    return +sum
}

const solve = (): number => {
    const lines = getLines(1)

    const sum = lines.reduce<number>((acc, curr) => acc += curr ? parseLine(curr): 0, 0)
    return sum
}

const sum = solve()
console.log('Sum', sum)