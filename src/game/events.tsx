import { LocationType, SkillType } from "./data";

export type EventOutcome = 
  | { type: "gain-meat"; amount: number }
  | { type: "lose-meat"; amount: number }

export type EventOption = {
  skillRequired: SkillType;
  description  : JSX.Element;
  outcome      : EventOutcome;
}

export type EventType = {
  location   : LocationType;
  description: JSX.Element;
  difficulty : 1 | 2 | 3;
  options    : EventOption[];
}

export const AllEvents: EventType[] = [
  {
    location  : "Forest",
    difficulty: 1,
    options   : [
      {
        skillRequired: "WoodCutter",
        description: <span>Cut the forest down, one log at a time</span>
      }
    ]
  }
]