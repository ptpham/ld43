
import { EventDifficulty, EventType, PassOn } from '../eventDefinition';

const GoblinNestFiller: EventType = {
  location     : "GoblinNest",
  description  : "Your party comes to the goblin nest, only to find it abandoned long ago. The mystery nags at you.",
  difficulty   : EventDifficulty.NothingHappens,
  stopsProgress: false,
  options: [
    {
      skillRequired: {type: "specific-skill", skill: "Fool", withoutRequirement: "Invisible"},
      description: "Go into the houses and break all the pots",
      followUpText: "You let the fool do as he pleases. Unfortunately you find out this is a mistake as he goes into all the houses, breaks all the pots, and molests a few chickens. The chickens are not pleased, and somehow more chickens appear exact revenge upon the party. You try to remember not to molest the chickens next time. ",
      outcome: [{ type: 'lose-meat', amount: 60, hidden: true}],
      updateEventTo: {
        location     : "GoblinNest",
        description  : "Your party comes to the goblin nest, only to find it abandoned long ago. The mystery nags at you.",
        difficulty   : EventDifficulty.NothingHappens,
        stopsProgress: false,
        options: [
          {
            skillRequired: {type: "specific-skill", skill: "Fool", withoutRequirement: "Invisible"},
            description: "Go into the houses and break all the pots",
            followUpText: "Somehow, you let the fool run amok in the village, again. This time the chickens are not so merciful.",
            outcome: [{ type: 'lose-meat', amount: 60, hidden: false}, {type: 'lose-member-weak', skill: 'Fool', hidden: true}],
          },
          {
            skillRequired: {type: "specific-skill", skill: "Architect", withoutRequirement: "Unlabeled"},
            description: "Turn some of the dwellings into human-size shelters.",
            followUpText: "It takes some ingenuity but you are able to convert some of the abandoned goblin dwellings to human-sized ones. They are pretty rickety, though, and probably won't last very long after you leave.",
            outcome: [{ type: 'lose-meat', amount: 0, hidden: false}]
          },
          PassOn({ price: 5 }),
        ]
      }
    },
    {
      skillRequired: {type: "specific-skill", skill: "Architect", withoutRequirement: "Unlabeled"},
      description: "Turn some of the dwellings into human-size shelters.",
      followUpText: "It takes some ingenuity but you are able to convert some of the abandoned goblin dwellings to human-sized ones. They are pretty rickety, though, and probably won't last very long after you leave.",
      outcome: [{ type: 'lose-meat', amount: 0, hidden: false}]
    },
    PassOn({ price: 5 }),
  ]
};

export const GoblinNestFillerEvents = [
  GoblinNestFiller,
];