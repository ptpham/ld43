import { LocationType, SkillType } from "./data";

export type EventOutcome = 
  | { type: "gain-meat"; amount: number; additionalInfo?: string }
  | { type: "lose-meat"; amount: number; additionalInfo?: string }

export type SkillRequirement =
  | { type: "specific-skill"; skill: SkillType }
  | { type: "no-skill"      ; }

export type EventOption = {
  skillRequired: SkillRequirement;
  description  : string;
  outcome      : EventOutcome;
}

export type EventType = {
  location   : LocationType;
  description: string;
  difficulty : 1 | 2 | 3;
  options    : EventOption[];
}

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
      },

      {
        skillRequired: { type: "specific-skill", skill: "Builder" },
        description: "Build a house.",
        outcome: { 
          type: "lose-meat", 
          amount: 20,
        },
      },
    ]
  }
]