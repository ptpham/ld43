import { LocationType, SkillType } from "./data";

export type EventOutcome = 
  | { type: "gain-meat"; amount: number; additionalInfo?: string }
  | { type: "lose-meat"; amount: number; additionalInfo?: string }

export type SkillRequirement =
  | { type: "specific-skill"; skill: SkillType }
  | { type: "no-skill"      ; }

export type EventOption = {
  skillRequired : SkillRequirement;
  description   : string;
  outcome      ?: EventOutcome;
  updateEventTo?: EventType;
}

export type EventType = {
  location   : LocationType;
  description: string;
  difficulty : 1 | 2 | 3;
  options    : EventOption[];
}

const ForestThatIsCutDown: EventType = {
  location   : "Forest",
  description: "This forest has been cut down.",
  difficulty : 1,
  options: [
    {
      skillRequired: { type: "no-skill" },
      description: "Pass on.",
    },
  ]
};

export const AllEvents: EventType[] = [
  {
    location   : "Forest",
    description: "You come to a misty forest. You hear the echo of eerie laughter in the distance.",
    difficulty : 1,
    options    : [
      {
        skillRequired: { type: "specific-skill", skill: "WoodCutter" },
        description: "Cut the forest down, one log at a time.",
        outcome: { 
          type: "lose-meat", 
          amount: 10,
        },
        updateEventTo: ForestThatIsCutDown,
      },

      {
        skillRequired: { type: "specific-skill", skill: "Builder" },
        description: "Build a house.",
        outcome: { 
          type: "lose-meat", 
          amount: 20,
        },
      },

      {
        skillRequired: { type: "specific-skill", skill: "Priest" },
        description: "Commune with the forest elves.",
        outcome: { 
          type: "gain-meat", 
          amount: 20,
        },
      },
    ]
  }
]