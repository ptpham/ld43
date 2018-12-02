import { LocationType, SkillType } from "./data";

export type EventOutcome = 
  | { type: "gain-meat"; amount: number; additionalInfo?: string }
  | { type: "lose-meat"; amount: number; additionalInfo?: string }

export type SkillRequirement =
  | { 
      type: "specific-skill"; 
      skill: SkillType; 
      withoutSkill: "Invisible" | "Unlabeled" | "Everything" 
    }
  | { type: "no-skill"      ; }

export type EventOption = {
  skillRequired : SkillRequirement;
  description   : string;
  followUpText  : string;
  outcome      ?: EventOutcome;
  updateEventTo?: EventType;
}

export type EventType = {
  location   : LocationType;
  description: string;
  difficulty : 1 | 2 | 3;
  options    : EventOption[];
}

const PassOn = ({ price = 0 }): EventOption => ({
  skillRequired: { type: "no-skill" },
  description  : "Pass on.",
  followUpText : "",
  ...(price === 0 ? undefined : { outcome: { type: "lose-meat", amount: 10 } }),
});

const ForestThatIsCutDown: EventType = {
  location   : "Forest",
  description: "This forest has been cut down.",
  difficulty : 1,
  options: [
    PassOn({ price: 0 }),
  ]
};

const CutDownForestOption: EventOption = {
  skillRequired: { type: "specific-skill", skill: "WoodCutter", withoutSkill: "Everything" },
  description: "Cut the forest down, one log at a time.",
  outcome: {
    type  : "lose-meat",
    amount: 10,
  },
  updateEventTo: ForestThatIsCutDown,
  followUpText: "Your lumberjack gets to work, and after some time, the entire forest is leveled.",
};

const ForestWithHouse: EventType = {
  location   : "Forest",
  description: "This forest has a large, conspicuous house in the middle of it. With the house, it seems like some of the mystery of this forest has left.",
  difficulty : 1,
  options: [
    CutDownForestOption,
    PassOn({ price: 10 }),
  ]
};

const ForestElfEvent: EventType = {
  location: "Forest",
  description: "You come to a misty forest. You hear the echo of eerie laughter in the distance. Passing through will be arduous, but is possible.",
  difficulty: 1,
  options: [
    CutDownForestOption,
    {
      skillRequired: { type: "specific-skill", skill: "Builder", withoutSkill: "Everything" },
      description: "Build a house.",
      followUpText : "You cut down some trees and build a log cabin.",
      outcome: { type: "lose-meat", amount: 20, },
      updateEventTo: ForestWithHouse,
    },
    {
      skillRequired: { type: "specific-skill", skill: "Priest", withoutSkill: "Unlabeled" },
      description: "Commune with the forest elves.",
      followUpText : "The forest elves pay you with lots of meat!",
      outcome: {
        type: "gain-meat",
        amount: 20,
      },
    },
    PassOn({ price: 10 }),
  ]
};

const BarbarianVillageRepaired: EventType = {
  location: "BarbarianVillage",
  description: "You find a barbarian village in state of good repair.",
  difficulty: 1,
  options: [
    PassOn({ price: 0 }),
  ]
};

const BarbarianVillageFailedAssassinationAttempt: EventType = {
  location: "BarbarianVillage",
  description: "The barbarians all point laugh at you. Then they charge you money to pass on.",
  difficulty: 1,
  options: [
    PassOn({ price: 10 }),
  ]
};

const BarbarianVillageWornDown: EventType = {
  location: "BarbarianVillage",
  description: "After days of journeying, your party encounters a ramshackle village of barbarians, with some buildings falling apart. Thok, the gatekeeper to the village, looks you up and down and says, 'Grunt.'",
  difficulty: 1,
  options: [
    {
      skillRequired: { type: "specific-skill", skill: "Builder", withoutSkill: "Unlabeled" },
      description  : "Repair some of the barbarian's buildings.",
      followUpText : "Thok thanks you for your kindness and lets you pass. The barbarians give you some meat as you leave.",
      outcome      : { type: "gain-meat", amount: 10, },
      updateEventTo: BarbarianVillageRepaired,
    },
    {
      skillRequired: { type: "specific-skill", skill: "Assassin", withoutSkill: "Unlabeled" },
      description  : "Assassinate thok.",
      followUpText : "You completely fail to assassinate Thok. He is much too fast for you. He laughs at how slow you are, and picks your meat-filled pockets while he's at at it.",
      outcome      : { type: "lose-meat", amount: 10, },
      updateEventTo: BarbarianVillageRepaired,
    },
    PassOn({ price: 20 }),
  ]
}

export const AllEvents: EventType[] = [
  ForestElfEvent,
  BarbarianVillageWornDown,
]