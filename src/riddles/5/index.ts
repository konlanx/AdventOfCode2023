import { getContent } from "../../utils";

type Almanac = {
    seeds: number[],
    maps: Map[]
}

type Map = {
    name: string,
    mappings: Mapping[]
}

type Mapping = {
    source: number,
    destination: number,
    range: number
}

type SpreadSeed = {
    source: number,
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

    const seeds = parseSeeds(blocks[0])
    const maps = parseMaps(blocks.slice(1))

    return {
        seeds,
        maps
    }
}

const hasRoute = (seed: number, mapping: Mapping): boolean => seed >= mapping.source && seed < mapping.source + mapping.range

const followRoute = (initialSeed: number, maps: Map[]): number => maps.reduce<number>((seed, curr) => {
    const route = curr.mappings.find(mapping => hasRoute(seed, mapping))

    if (route) {
        return seed + (route.destination - route.source)
    } 

    return seed
}, initialSeed)

const findPoints = (almanac: Almanac): number[] => almanac.seeds.map(seed => followRoute(seed, almanac.maps))

const findSmallestPoint = (points: number[]): number => Math.min(...points)

const spreadSeeds = (seeds: number[]): SpreadSeed[] => {
    const seedPairs = seeds.flatMap((_, index, array) => index % 2 ? [] : [array.slice(index, index + 2)]);
    return seedPairs.map(pair => ({source: pair[0], range: pair[1]}))
}

const followSpreadRoute = (seed: SpreadSeed, maps: Map[]): number => {
    let smallestLocation = followRoute(seed.source, maps)

    for (let index = seed.source + 1; index < (seed.source + seed.range); index++) {
        const location = followRoute(index, maps)
        smallestLocation = location < smallestLocation ? location : smallestLocation
    }

    return smallestLocation
}

const findSpreadPoints = (seeds: SpreadSeed[], maps: Map[]): number[] => seeds.map(seed => followSpreadRoute(seed, maps))

// Part 1
const content = getContent(5)
const almanac = parseAlmanac(content)
const points = findPoints(almanac)
const smallestPoint = findSmallestPoint(points)

console.log('Smallest point', smallestPoint)

// Part 2
const spreadedSeeds = spreadSeeds(almanac.seeds)
const spreadedPoints = findSpreadPoints(spreadedSeeds, almanac.maps)
const spreadedSmallestPoint = findSmallestPoint(spreadedPoints)

console.log('Spreaded smallest point', spreadedSmallestPoint)