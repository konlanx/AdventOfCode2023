import * as fs from 'fs';
import * as path from 'path';

export const getLines = (riddle: number): string[] => {
    return getContent(riddle).split('\n')
}

export const getContent = (riddle: number): string => fs.readFileSync(path.resolve(__dirname, `../../assets/riddles/${riddle}/input.txt`), 'utf8')

export const isNumericChar = (character: string): boolean => /^\d+$/.test(character)