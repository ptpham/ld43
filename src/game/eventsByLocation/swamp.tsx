
import { EventDifficulty, EventType, PassOn } from '../eventDefinition';

const SwampFiller: EventType = {
  location     : "Swamp",
  description  : "After another day's journey, the party arrives at a swamp. The going is slow.",
  difficulty   : EventDifficulty.NothingHappens,
  stopsProgress: false,
  options: [
    {
      skillRequired: { type: "specific-skill", skill: "Bard", withoutRequirement: "Unlabeled" },
      description: "Play some catchy tunes.",
      followUpText : "When you stop and rest, the bard picks up her instrument and plays you a catchy tune. Suddenly an ogre appears out of the swamp! He says he likes your music, blushing a little. He offers you some swamp flowers and a bag of dried piranha innards. You begrudgingly accept.",
      outcome: [{ type: "gain-meat", amount: 10, hidden: true, }],
    },
    PassOn({ price: 10 }),
  ]
};

export const SwampEvents = [
  SwampFiller,
];