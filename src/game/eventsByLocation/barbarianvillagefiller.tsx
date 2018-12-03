
import { EventDifficulty, EventType, PassOn } from '../eventDefinition';

const BarbarianVillageFiller: EventType = {
  location     : "BarbarianVillage",
  description  : "Your party comes to the barbarian village - but apparently it's filled with very sleepy barbarians who are more interested in napping than coming out to greet you.",
  difficulty   : EventDifficulty.NothingHappens,
  stopsProgress: false,
  options: [
    PassOn({ price: 10 }),
  ]
};

export const BarbarianVillageFillerEvents = [
  BarbarianVillageFiller,
]
