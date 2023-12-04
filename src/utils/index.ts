import * as fs from 'fs';
import * as path from 'path';

export const getLines = (riddle: number): string[] => {
    const content = fs.readFileSync(path.resolve(__dirname, `../../assets/riddles/${riddle}/input.txt`), 'utf8')
    return content.split('\n')
}

export const isNumericChar = (character: string): boolean => /^\d+$/.test(character)