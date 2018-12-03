
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

const SwampBlighted: EventType = {
  location: "Desert",
  description: "The mud in the swamp appears to bubble. A giant toad approaches you.",
  difficulty: EventDifficulty.NothingHappens,
  stopsProgress: false,
  options: [
    {
      skillRequired: { type: "specific-skill", skill: "Assassin", withoutRequirement: "Unlabeled" },
      description: "Attack the toad.",
      followUpText: `
        The Assassin approaches the toad in an attempt to stab it,
        but unfortunately, she's too slow. The toad swallows her whole.
        You manage to escape with the rest of the party.`,
      outcome: [{ type: "lose-member-strong", skill: "Assassin", hidden: true }],
    },
    {
      skillRequired: { type: "specific-skill", skill: "Merchant", withoutRequirement: "Unlabeled" },
      description: "Barter with the toad.",
      followUpText: "You offer some meat to the giant toad. It appears to be pleased and grants you a red orb.",
      outcome: [
        { type: "lose-meat", amount: 5, hidden: false },
        { type: "gain-item", item: "Red Orb" },
      ],
    },
    PassOn({ price: 20 }),
  ],
}
SwampFiller.whenBlighted = SwampBlighted;

export const SwampEvents = [
  SwampFiller,
];