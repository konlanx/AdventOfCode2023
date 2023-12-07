import { getLines } from "../../utils";

type Hand = {
  cards: number[];
  points: number;
  rank?: number;
};

const TYPES: { [name: string]: number } = {
  FIVE_OF_A_KIND: 7,
  FOUR_OF_A_KIND: 6,
  FULL_HOUSE: 5,
  THREE_OF_A_KIND: 4,
  TWO_PAIR: 3,
  ONE_PAIR: 2,
  HIGH_CARD: 1,
};

const CARDS = [
  "A",
  "K",
  "Q",
  "T",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
  "J",
  "0",
].reverse();

const parseHand = (line: string): Hand => {
  const values = line.split(" ");
  const cards = values[0].split("").map((card) => CARDS.indexOf(card));
  const points = +values[1];

  return {
    cards,
    points,
  };
};

const parseHands = (lines: string[]): Hand[] => {
  return lines.map(parseHand);
};

const getOccurence = (cards: number[], value: number): number =>
  cards.filter((card) => card === value).length;

const getHandRank = (hand: Hand): number => {
  const individualCards = [...new Set(hand.cards.filter((card) => card !== 1))];
  const jokerAmount = hand.cards.filter((card) => card === 1).length;

  const firstCardAmount = getOccurence(hand.cards, individualCards[0]);

  if (firstCardAmount === 5 || firstCardAmount + jokerAmount === 5)
    return TYPES["FIVE_OF_A_KIND"];

  const secondCardAmount = getOccurence(hand.cards, individualCards[1]);
  if (
    firstCardAmount === 4 ||
    firstCardAmount + jokerAmount === 4 ||
    secondCardAmount === 4 ||
    secondCardAmount + jokerAmount === 4
  )
    return TYPES["FOUR_OF_A_KIND"];
  if (firstCardAmount + secondCardAmount + jokerAmount === 5)
    return TYPES["FULL_HOUSE"];

  const thirdCardAmount = getOccurence(hand.cards, individualCards[2]);
  if (
    firstCardAmount === 3 ||
    firstCardAmount + jokerAmount === 3 ||
    secondCardAmount === 3 ||
    secondCardAmount + jokerAmount === 3 ||
    thirdCardAmount === 3 ||
    thirdCardAmount + jokerAmount === 3
  )
    return TYPES["THREE_OF_A_KIND"];

  if (
    (firstCardAmount === 2 && secondCardAmount === 2) ||
    (firstCardAmount + jokerAmount === 2 && secondCardAmount === 2) ||
    (firstCardAmount === 2 && secondCardAmount + jokerAmount === 2) ||
    (firstCardAmount === 2 && thirdCardAmount === 2) ||
    (firstCardAmount + jokerAmount === 2 && thirdCardAmount === 2) ||
    (firstCardAmount === 2 && thirdCardAmount + jokerAmount === 2) ||
    (secondCardAmount === 2 && thirdCardAmount === 2) ||
    (secondCardAmount + jokerAmount === 2 && thirdCardAmount === 2) ||
    (secondCardAmount === 2 && thirdCardAmount + jokerAmount === 2)
  )
    return TYPES["TWO_PAIR"];

  const fourthCardAmount = getOccurence(hand.cards, individualCards[3]);
  if (
    firstCardAmount === 2 ||
    firstCardAmount + jokerAmount === 2 ||
    secondCardAmount === 2 ||
    secondCardAmount + jokerAmount === 2 ||
    thirdCardAmount === 2 ||
    thirdCardAmount + jokerAmount === 2 ||
    fourthCardAmount === 2 ||
    fourthCardAmount + jokerAmount === 2
  )
    return TYPES["ONE_PAIR"];

  return TYPES["HIGH_CARD"];
};

const compareHandsSameRank = (firstHand: Hand, secondHand: Hand): number => {
  for (let index = 0; index < firstHand.cards.length; index++) {
    if (firstHand.cards[index] !== secondHand.cards[index]) {
      return firstHand.cards[index] - secondHand.cards[index];
    }
  }

  return 0;
};

const sortHands = (hands: Hand[]): Hand[] => {
  const rankedHands = hands.map((hand) => ({
    ...hand,
    rank: getHandRank(hand),
  }));

  return rankedHands.sort((a, b) =>
    a.rank === b.rank ? compareHandsSameRank(a, b) : a.rank - b.rank
  );
};

const getScore = (hands: Hand[]): number =>
  hands.reduce<number>(
    (acc, curr, index) => acc + curr.points * (index + 1),
    0
  );

// Part 2
const lines = getLines(7);
const hands = parseHands(lines);
const sortedHands = sortHands(hands);
const sum2 = getScore(sortedHands);

console.log("Sum 2", sum2);
