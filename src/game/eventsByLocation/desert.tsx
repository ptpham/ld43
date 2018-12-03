
import { EventDifficulty, EventType, PassOn } from '../eventDefinition';

export const DesertFiller: EventType = {
  location     : "Desert",
  description  : "The caravan makes its way over a desert. The air is hot and the sand is harsh, but you make it through.",
  difficulty   : EventDifficulty.NothingHappens,
  stopsProgress: false,
  options: [
    {
      skillRequired: { type: "specific-skill", skill: "Cartographer", withoutRequirement: "Everything" },
      description: "Locate an easy path through the desert.",
      followUpText : "With the cartographer's help, you locate a hidden oasis among the dunes!.",
      outcome: [{ type: "gain-meat", amount: 10, hidden: true, }],
    },
    PassOn({ price: 10 }),
  ],
};

export const DesertEvents = [
  DesertFiller
];

