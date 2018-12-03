
import { EventDifficulty, EventType, PassOn } from '../eventDefinition';

const DesertFiller: EventType = {
  location     : "Desert",
  description  : "The caravan makes its way over a desert. The air is hot and the sand is harsh.",
  difficulty   : EventDifficulty.NothingHappens,
  stopsProgress: false,
  options: [
    {
      skillRequired: { type: "specific-skill", skill: "Cartographer", withoutRequirement: "Unlabeled" },
      description: "Locate an easy path through the desert.",
      followUpText : "With the cartographer's help, you locate a hidden oasis among the dunes!.",
      outcome: [{ type: "gain-meat", amount: 10, hidden: true, }],
    },
    PassOn({ price: 10 }),
  ],
};

const DesertBlighted: EventType = {
  location     : "Desert",
  description  : "The caravan makes its way over an unwelcoming desert. The air is hot and the sand is harsh, and a wild wolf pack accosts you as you attempt to cross.",
  difficulty   : EventDifficulty.NothingHappens,
  stopsProgress: false,
  options: [
    {
      skillRequired: { type: "specific-skill", skill: "Assassin", withoutRequirement: "Unlabeled" },
      description: "Slay the wolves from afar.",
      followUpText : "You quietly equip some poison arrows and shoot down the wolves from a distance. The corpses are tainted and are not edible.",
      outcome: [],
    },
    {
      skillRequired: { type: "specific-skill", skill: "Woodsman", withoutRequirement: "Unlabeled" },
      description: "Fight off the wolves in melee.",
      followUpText : "You pick off a few wolves from range and engage the rest by hand. You come out battered but the victor as the wolves scatter.",
      outcome: [],
    },
    {
      skillRequired: { type: "specific-skill", skill: "Fool", withoutRequirement: "Unlabeled" },
      description: "Leave behind a member of your party as bait.",
      followUpText : "You tell the fool that the big dogs have candy and want to snuggle. He tries to snuggle them. You get away while they are distracted.",
      outcome: [{ type: "lose-member-strong", skill: "Fool" , hidden: false}],
    },
    PassOn({ price: 20 }),
  ],
}
DesertFiller.whenBlighted = DesertBlighted;

export const DesertEvents = [
  DesertFiller,
  DesertBlighted
];

