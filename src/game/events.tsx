import { LocationType, SkillType } from "./data";

export type EventItems =
  | "Tailisman"

export type EventOutcome = 
  | { type: "gain-meat"; amount: number; hidden: boolean }
  | { type: "lose-meat"; amount: number; hidden: boolean }

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
  ...(price === 0 ? undefined : { outcome: { type: "lose-meat", amount: price, hidden: false } }),
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
    hidden: false,
  },
  updateEventTo: ForestThatIsCutDown,
  followUpText: "Your lumberjack gets to work, and after some time, the entire forest is leveled.",
};

const ForestWithHouse: EventType = {
  location   : "Forest",
  description: 
    `This forest has a large, conspicuous house in the middle of it. With the
    house, it seems like some of the mystery of this forest has left.`,
  difficulty : 1,
  options: [
    CutDownForestOption,
    PassOn({ price: 10 }),
  ]
};

const ForestElfEvent: EventType = {
  location: "Forest",
  description: 
    `You come to a misty forest. You hear the echo of eerie laughter in the
    distance. Passing through will be arduous, but is possible.`,
  difficulty: 1,
  options: [
    CutDownForestOption,
    {
      skillRequired: { type: "specific-skill", skill: "Builder", withoutSkill: "Everything" },
      description: "Build a house.",
      followUpText : "You cut down some trees and build a log cabin.",
      outcome: { type: "lose-meat", amount: 20, hidden: false, },
      updateEventTo: ForestWithHouse,
    },
    {
      skillRequired: { type: "specific-skill", skill: "Priest", withoutSkill: "Unlabeled" },
      description: "Commune with the forest elves.",
      followUpText : "The forest elves pay you with lots of meat!",
      outcome: {
        type: "gain-meat",
        amount: 20,
        hidden: true,
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
  description: `
    The barbarians all point and laugh at you. Then they 
    charge you money to pass on.`,
  difficulty: 1,
  options: [
    PassOn({ price: 10 }),
  ]
};

const BarbarianVillageWornDown: EventType = {
  location: "BarbarianVillage",
  description: `
    After days of journeying, your party encounters a ramshackle 
    village of barbarians, with some buildings falling apart. 
    Thok, the gatekeeper to the village, looks you up and down 
    and says, 'Grunt.'`,
  difficulty: 1,
  options: [
    {
      skillRequired: { type: "specific-skill", skill: "Builder", withoutSkill: "Unlabeled" },
      description  : "Repair some of the barbarian's buildings.",
      followUpText : 
      `Thok thanks you for your kindness and lets you pass. The barbarians
      give you some meat as you leave.`,
      outcome      : { type: "gain-meat", amount: 10, hidden: true },
      updateEventTo: BarbarianVillageRepaired,
    },
    {
      skillRequired: { type: "specific-skill", skill: "Assassin", withoutSkill: "Unlabeled" },
      description  : "Assassinate thok.",
      followUpText : 
        `You completely fail to assassinate Thok. He is much too fast for
        you. He laughs at how slow you are, and picks your meat-filled
        pockets while he's at at it.`,
      outcome      : { type: "lose-meat", amount: 10, hidden: true },
      updateEventTo: BarbarianVillageFailedAssassinationAttempt,
    },
    PassOn({ price: 20 }),
  ]
}

const GoblinNest: EventType = {
  location: "GoblinNest",
  description: `
    You approach the outskirts of a nest of goblins. You believe
    the goblins are almost certainly warlike. You can overhear
    them talking about how much they hate humans - a favorite goblin
    conversational topic, along with how much they smell.
    `,
  difficulty: 1,
  options: [
    {
      skillRequired: { type: "specific-skill", skill: "Builder", withoutSkill: "Unlabeled" },
      description: "Build a watch tower to attack the goblins from.",
      followUpText:
        `What were you thinking? The goblins notice you immediately! You barely escape
        with your lives!`,
      outcome: { type: "lose-meat", amount: 10, hidden: true },

      updateEventTo: {
        location: "GoblinNest",
        description: `
          You approach the outskirts of a nest of goblins. There is the beginnings
          of a tower being built here.
          `,
        difficulty: 1,
        options: [
          {
            skillRequired: { type: "specific-skill", skill: "Builder", withoutSkill: "Unlabeled" },
            description: "Continue to build the tower",
            followUpText:
              `You continue to try to build the tower. You make a little more
                progress, and then the goblins (again) notice and run you off. You
                barely escape with your lives. Again. When will you ever learn?`,
            outcome: { type: "lose-meat", amount: 10, hidden: true },
            updateEventTo: {
              location: "GoblinNest",
              description: `
                You approach the outskirts of a nest of goblins. There is a serviceable tower built here.
                `,
              difficulty: 1,
              options: [
                {
                  skillRequired: { type: "no-skill" },
                  description: "Shoot at the goblins from the tower.",
                  followUpText:
                    `Amazingly, your tower provides enough defense - or the goblins are stupid enough -
                     that you can shoot arrows down to the goblins without any risk of counterattack! The goblins
                     all flee the nest, and you take the opportunity to pick up some left-over goblin meat.`,
                  outcome: { type: "gain-meat", amount: 50, hidden: true },
                  updateEventTo: {
                    location: "GoblinNest",
                    description: `
                      You see the outskirts of an abandoned goblin nest.
                    `,
                    difficulty: 1,
                    options: [
                      PassOn({ price: 0 }),
                    ]
                  }
                }
              ]
            }
          },
        ]
      }
    },
    {
      skillRequired: { type: "specific-skill", skill: "Assassin", withoutSkill: "Unlabeled" },
      description: "Assassinate the goblin leader.",
      followUpText:
        `Your assassin waits until nightfall, then sneaks through the camp and
        assassinates the leader of the goblins! She also finds a large treasure
        chest of meat in the leader's tent.`,
      outcome: { type: "gain-meat", amount: 100, hidden: true },
      updateEventTo: {
        location: "GoblinNest",
        description: `
          You approach the goblin nest. The goblins are swarming around
          aimlessly, confused, bemoaning the loss of their leader. It seems like
          slipping through should be easy.
        `,
        difficulty: 1,
        options: [
          PassOn({ price: 0 }),
        ]
      }
    },
    PassOn({ price: 20 }),
  ],
};

export const AllEvents: EventType[] = [
  ForestElfEvent,
  BarbarianVillageWornDown,
  GoblinNest,
]