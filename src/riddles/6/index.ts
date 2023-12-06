import { getLines } from "../../utils"

type Race = {
  time: number
  distance: number
}

const getValues = (values: string, seperator: string): number[] =>
  values
    .split(seperator)
    .map((value) => value.replaceAll(" ", ""))
    .filter((value) => value)
    .splice(1)
    .map(Number)

const parseRaces = (lines: string[]): Race[] => {
  const times = lines[0]
  const distances = lines[1]

  const timeValues = getValues(times, " ")
  const distanceValues = getValues(distances, " ")

  return timeValues.map((_, index) => ({
    time: timeValues[index],
    distance: distanceValues[index],
  }))
}

const parseRace = (lines: string[]): Race => {
  const times = lines[0]
  const distances = lines[1]

  const time = getValues(times, ": ")[0]
  const distance = getValues(distances, ": ")[0]

  return {
    time,
    distance,
  }
}

const winRace = (race: Race): number => {
  const lowestWinningTime = Math.floor(
    (race.time - Math.sqrt(Math.pow(race.time, 2) - 4 * race.distance)) / 2
  )

  const maxWinningTime = Math.ceil(
    (race.time + Math.sqrt(Math.pow(race.time, 2) - 4 * race.distance)) / 2
  )

  return maxWinningTime - lowestWinningTime - 1
}

const winRaces = (races: Race[]): number =>
  races.map(winRace).reduce<number>((acc, curr) => (acc *= curr), 1)

// Part 1
const lines = getLines(6)
const races = parseRaces(lines)
const product = winRaces(races)

console.log("Sum 1", product)

// Part 2

const race = parseRace(lines)
const product2 = winRaces([race])

console.log("Sum 2", product2)
