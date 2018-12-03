
import { EventDifficulty, EventType, PassOn } from '../eventDefinition';

const ForestFiller: EventType = {
  location     : "Forest",
  description  : "Your party makes it through the forest. Everyone remarks on how unremarkable the forest was.",
  difficulty   : EventDifficulty.NothingHappens,
  stopsProgress: false,
  options: [
    PassOn({ price: 10 }),
  ]
};

const ForestRandomGood: EventType = {
  location     : "Forest",
  description  : "As your party makes it through the forest, you successfully hunt a wild deer!",
  difficulty   : EventDifficulty.FreeMeat,
  stopsProgress: false,
  options: [
    {
      skillRequired: { type: "no-skill" },
      description  : "Take the meat.",
      followUpText : 
      `You'll eat well for the next few days.`,
      outcome      : [{ type: "gain-meat", amount: 30, hidden: false }],
      updateEventTo: ForestFiller,
    },
  ]
};

export const ForestFillerEvents = [
  ForestRandomGood,
]