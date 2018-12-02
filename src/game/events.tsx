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
      outcome: {
        type: "gain-meat",
        amount: 20,
      },
    },
    PassOn({ price: 10 }),
  ]
}

export const AllEvents: EventType[] = [
  ForestElfEvent,
]