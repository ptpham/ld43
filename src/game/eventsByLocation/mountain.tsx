
import { EventDifficulty, EventType, PassOn } from '../eventDefinition';

const MountainFiller: EventType = {
  location     : "Mountain",
  description  : "The mountain looms threateningly over the party, but after a few days of exploring, you find a pass that allows you to get through with little difficulty.",
  difficulty   : EventDifficulty.NothingHappens,
  stopsProgress: false,
  options: [
    {
      skillRequired: { type: "specific-skill", skill: "Assassin", withoutRequirement: "Unlabeled" },
      description: "Nimbly scale the mountain.",
      followUpText : "The assassin is experienced in climbing buildings. She scales the cliff and lets down a rope for you to rappel up. This saves you a good few days of climbing!",
      outcome: [],
    },
    {
      skillRequired: { type: "specific-skill", skill: "Architect", withoutRequirement: "Unlabeled" },
      description: "Create a footpath.",
      followUpText : "You decide to clear out a switchback trail to make it easier to cross next time.",
      outcome: [{ type: "lose-member-weak", skill: "Architect", hidden: false }],
      updateEventTo: {
        location: "Mountain",
        description: "This mountain pass is much easier to cross now that there is a real trail.",
        difficulty: EventDifficulty.NothingHappens,
        stopsProgress: false,
        options: [ PassOn({price: 5}) ]
      }
    },
    PassOn({ price: 15 }),
  ]
};

export const MountainEvents = [
  MountainFiller,
];