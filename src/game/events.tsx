import { LocationType, SkillType } from "./data";

export type EventOutcome = 
  | { type: "gain-meat"; amount: number; additionalInfo?: string }
  | { type: "lose-meat"; amount: number; additionalInfo?: string }

export type EventOption = {
  skillRequired: SkillType;
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
    description: "You come to an eerie, misty forest.",
    difficulty : 1,
    options    : [
      {
        skillRequired: "WoodCutter",
        description: "Cut the forest down, one log at a time",
        outcome: { 
          type: "lose-meat", 
          amount: 10,
        },
      },

      {
        skillRequired: "Builder",
        description: "",
        outcome: { 
          type: "lose-meat", 
          amount: 10,
        },
      },

    ]
  }
]