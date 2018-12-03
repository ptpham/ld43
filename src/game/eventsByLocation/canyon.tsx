
import { EventDifficulty, EventType, PassOn } from '../eventDefinition';

const CanyonFiller: EventType = {
  location: "Canyon",
  description: "A large canyon blocks your way.",
  difficulty: EventDifficulty.NothingHappens,
  stopsProgress: false,
  options: [
    {
      skillRequired: { type: "specific-skill", skill: "Sage", withoutRequirement: "Unlabeled" },
      description: "Begin chanting.",
      followUpText: `
        The Sage recognizes the area and begins to chant. The idol shakes a bit, as if wanting to be placed.
        A strange howl comes from the canyon and bats swarm out, showing the path.
      `,
      outcome: []
    },
    PassOn({ price: 20 }),
  ],
};

const CanyonBlighted: EventType = {
  location: "Canyon",
  description: `
    The canyon seems larger than before. A dark wind hums, blocking your vision and your path.
  `,
  difficulty: EventDifficulty.NothingHappens,
  stopsProgress: false,
  options: [
    {
      skillRequired: { type: "specific-skill", skill: "Bard", withoutRequirement: "Unlabeled" },
      description: "Hum with the wind",
      followUpText: "The wind seems to clear up a bit as the Bard sings along with it. Something sparkles nearby in the dirt. You pick it up.",
      outcome: [{ type: "gain-item", item: "Golden Snake" }],
    },
    {
      skillRequired: { type: "specific-skill", skill: "Cartographer", withoutRequirement: "Unlabeled" },
      description: "Remember your path",
      followUpText: "The cartographer pulls out a map and leads the way.",
      outcome: [],
    },
    {
      skillRequired: { type: "specific-skill", skill: "Fool", withoutRequirement: "Unlabeled" },
      description: "Leave behind a member of your party as bait.",
      followUpText: "You tell the fool that the big dogs have candy and want to snuggle. He tries to snuggle them. You get away while they are distracted.",
      outcome: [{ type: "lose-member-strong", skill: "Fool", hidden: false }],
    },
    PassOn({ price: 30 }),
  ],
}
CanyonFiller.whenBlighted = CanyonBlighted;

export const CanyonEvents = [
  CanyonFiller,
];

