import { getContent } from "../../utils";

type Almanac = {
    seeds: Mapping[],
    maps: Map[]
}

type Map = {
    name: string,
    mappings: Mapping[]
}

type Mapping = {
    source: number,
    destination?: number,
    range: number
}

const SEED_IDENTIFIER = 'seeds: '
const MAP_IDENTIFIER = ' map:'

const parseMapping = (value: string): Mapping => {
    const values = value.split(' ').map(Number)
    const destination = values[0]
    const source = values[1]
    const range = values[2]

    return {
        source,
        destination,
        range
    }
}

const parseMaps = (blocks: string[]): Map[] => blocks.map(block => {
    const parts = block.split(MAP_IDENTIFIER)
    const name = parts[0]
    const values = parts[1].split('\n')

    const mappings = values.map(parseMapping)

    return {
        name,
        mappings
    }
})

const parseSeeds = (line: string): number[] => line.replaceAll(SEED_IDENTIFIER, '').split(' ').map(Number)

const parseAlmanac = (content: string): Almanac => {
    const blocks = content.split('\n\n')

    const seedValues = parseSeeds(blocks[0])
    const seedPairs = seedValues.flatMap((_, i, a) => i % 2 ? [] : [a.slice(i, i + 2)]);
    const seeds: Mapping[] = seedPairs.map(seed => ({
        source: seed[0],
        range: seed[1]
    }))

    const maps = parseMaps(blocks.slice(1))

    return {
        seeds,
        maps
    }
}

const hasRoute = (seed: number, mapping: Mapping): boolean => seed >= mapping.source && seed < mapping.source + mapping.range

const followRoute = (initialSeed: Mapping, maps: Map[]): number => maps.reduce<Mapping>((seed, curr) => {
    const route = curr.mappings.find(mapping => hasRoute(seed, mapping))

    if (route) {
        // return seed + (route.destination - route.source)
    } 

    return seed
}, initialSeed)

const findPoints = (almanac: Almanac): number[] => almanac.seeds.map(seed => followRoute(seed, almanac.maps))

const findSmallestPoint = (points: number[]): number => Math.min(...points)

const content = getContent(5)
const almanac = parseAlmanac(content)

console.log('Almanac', almanac)

const points = findPoints(almanac)
const smallestPoint = findSmallestPoint(points)
