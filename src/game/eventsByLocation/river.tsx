
import { EventDifficulty, EventType, PassOn } from '../eventDefinition';

const RiverFiller: EventType = {
  location     : "River",
  description  : "The party arrives at a river. A makeshift bridge, consisting of some logs and stones left behind by previous travellers, makes it easy to cross.",
  difficulty   : EventDifficulty.NothingHappens,
  stopsProgress: false,
  options: [
    {
      skillRequired: { type: "specific-skill", skill: "Merchant", withoutRequirement: "Unlabeled" },
      description: "Find the river gypsies.",
      followUpText : "The merchant is good friends with a band of gypsies who travels up and down the river, trading goods along the way. Reading the signs along the riverbank that they leave behind, he is able to find them, and you have a fun little party together.",
      outcome: [{ type: "gain-meat", amount: 10, hidden: true, }],
    },
    PassOn({ price: 10 }),
  ]
};

export const RiverEvents = [
  RiverFiller,
]