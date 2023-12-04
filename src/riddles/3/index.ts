import * as fs from 'fs';
import * as path from 'path';
import { getLines, isNumericChar } from '../../utils';

type GearBox = Array<Array<number | string>>

type Coordinate = `${string}-${string}`
type Gear = {values: number[], gearPosition: Coordinate}

const parseLine = (line: string): Array<number | string> => line.split('').map(character => isNumericChar(character) ? +character : character)

const parseGearBox = (lines: string[]): GearBox => lines.map(parseLine)

const gearBox = parseGearBox(getLines(3))

const isSymbol = (character: string | number): boolean => character === '*'

const hasSourroundingSymbol = (gearBox: GearBox, positionX: number, positionY: number): Coordinate | undefined => {
    // Check out of bounds
    if (positionX <= -1 || positionY <= -1) return undefined
    if (positionY >= gearBox.length) return undefined
    if (positionX >= gearBox[positionY].length) return undefined

    if ((positionY - 1 > -1) && isSymbol(gearBox[positionY - 1][positionX])) return `${positionY - 1}-${positionX}`
    if ((positionY - 1 > -1 && positionX - 1 > -1) && isSymbol(gearBox[positionY - 1][positionX - 1])) return `${positionY - 1}-${positionX - 1}`
    if ((positionY - 1 > -1 && positionX + 1 < gearBox[positionY - 1].length) && isSymbol(gearBox[positionY - 1][positionX + 1])) return `${positionY - 1}-${positionX + 1}`
    if ((positionX - 1 > -1) && isSymbol(gearBox[positionY][positionX - 1])) return `${positionY}-${positionX - 1}`
    if ((positionX + 1 < gearBox[positionY].length) && isSymbol(gearBox[positionY][positionX + 1])) return `${positionY}-${positionX + 1}`
    if ((positionY + 1 < gearBox.length) && isSymbol(gearBox[positionY + 1][positionX])) return `${positionY + 1}-${positionX}`
    if ((positionY + 1 < gearBox.length && positionX - 1 > -1) && isSymbol(gearBox[positionY + 1][positionX - 1])) return `${positionY + 1}-${positionX - 1}`
    if ((positionY + 1 < gearBox.length && positionX + 1 < gearBox[positionY + 1].length) && isSymbol(gearBox[positionY + 1][positionX + 1])) return `${positionY + 1}-${positionX + 1}`

    return undefined
}

const anaylzeGearBox = (gearbox: GearBox): Gear[] => {
    let gears: Gear[] = []


    for (const [rowKey, row] of gearBox.entries()) {
        let currentNumber = ''
        let gearPosition = undefined

        for (const [entryKey, entry] of row.entries()) {
            if (typeof entry === 'number') {
                currentNumber = `${currentNumber}${entry}`
                gearPosition = gearPosition || hasSourroundingSymbol(gearBox, entryKey, rowKey)
            }

            if (!(typeof entry === 'number') && gearPosition && currentNumber) {
                gears.push({
                    values: [+(currentNumber ?? 0)],
                    gearPosition
                })
            }
            
            if (!(typeof entry === 'number')) {
                currentNumber = ''
                gearPosition = undefined
            }
        }

        if (currentNumber && gearPosition) {
             gears.push({
                values: [+(currentNumber ?? 0)],
                gearPosition
             })
        }
    }

    return gears
}

const product = (values: number[]): number => values.reduce<number>((acc, curr) => acc *= curr, 1)

const analyzeGears = (gears: Gear[]): number => {
    const workingGears = gears.reduce<Gear[]>((acc, curr) => {
        const existingGear = acc.find(gear => gear.gearPosition === curr.gearPosition)

        if (existingGear) {
            const updatedGear: Gear = {
                gearPosition: existingGear.gearPosition,
                values: [...existingGear.values, ...curr.values]
            }

            return [...acc.filter(gear => gear.gearPosition !== existingGear.gearPosition), updatedGear]
        }

        return [...acc, curr]
    }, [])

    return workingGears.reduce<number>((acc, curr) => {
        if (curr.values.length > 1) return acc += product(curr.values)

        return acc
    }, 0)
}

const gears = anaylzeGearBox(gearBox)
const sum = analyzeGears(gears)
console.log('Sum', sum)