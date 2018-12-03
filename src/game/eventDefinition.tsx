
import { LocationType, SkillType } from "./data";

export type EventItem =
  | "Tailisman"

export type EventOutcome = 
  | { type: "gain-meat"; amount: number; hidden: boolean }
  | { type: "lose-meat"; amount: number; hidden: boolean }
  | { type: "lose-member-strong"; skill: SkillType; hidden: boolean }
  | { type: "lose-member-weak"; skill: SkillType; hidden: boolean }
  | { type: "gain-item"; item: EventItem }
  | { type: "turn-back"; }
  | { type: "end-run"; }

export type Requirement =
  | { 
      type: "specific-skill"; 
      skill: SkillType; 
      withoutRequirement: "Invisible" | "Unlabeled" | "Everything" 
    }
  | { 
      type: "specific-item"; 
      skill: EventItem; 
      withoutRequirement: "Invisible" | "Unlabeled" | "Everything" 
    }
  | { type: "no-skill"      ; }

export enum EventDifficulty {
  NothingHappens   = 0,
  FreeMeat         = 1,
  NormalDifficutly = 2,
  HardDifficulty   = 3,

  // This is a placeholder difficulty, please do not make events at this difficulty
  MaxDifficulty    = 4,

  // let's not use this one (unless they do something stupid)
  LoseMeat         = 5,
}

export type EventOption = {
  skillRequired : Requirement;
  description   : string;
  followUpText  : string;
  outcome       : EventOutcome[];
  updateEventTo?: EventType;
  requiresIdol ?: boolean;
  winsGame     ?: boolean;
}

export type EventType = {
  location     : LocationType;
  stopsProgress: boolean;
  description  : string;
  difficulty   : EventDifficulty;
  options      : EventOption[];
  whenBlighted?: EventType;
}

export const CONTINUE_TEXT = "Continue with your journey.";

export const PassOn = (props: { price: number }): EventOption => ({
  skillRequired: { type: "no-skill" },
  description  : CONTINUE_TEXT,
  followUpText : "",
  outcome: props.price === 0 ? [] : [{ type: "lose-meat", amount: props.price, hidden: false }],
});


