
import { EventDifficulty, EventOption, EventType, PassOn } from './eventDefinition';
import { DesertEvents } from './eventsByLocation/desert';
import { MountainEvents } from './eventsByLocation/mountain';
import { SwampEvents } from './eventsByLocation/swamp';
import { CanyonEvents } from './eventsByLocation/canyon';
import { FinalEvents } from './eventsByLocation/final';
import { GoblinNestFillerEvents } from './eventsByLocation/goblinnestfiller';
import { BarbarianVillageFillerEvents } from './eventsByLocation/barbarianvillagefiller';
import { RiverEvents } from './eventsByLocation/river';
import { ForestFillerEvents } from './eventsByLocation/forestfiller';

const ForestThatIsCutDown: EventType = {
  location     : "Forest",
  description  : "This forest has been cut down.",
  difficulty   : EventDifficulty.NothingHappens,
  stopsProgress: false,
  options: [
    PassOn({ price: 0 }),
  ]
};

const CutDownForestOption: EventOption = {
  skillRequired: { type: "specific-skill", skill: "Woodsman", withoutRequirement: "Everything" },
  description: "Cut the forest down, one log at a time.",
  outcome: [
    {
      type  : "lose-meat",
      amount: 10,
      hidden: false,
    },
    {
      type  : "lose-member-weak",
      skill: "Woodsman",
      hidden: false
    },
  ],
  updateEventTo: ForestThatIsCutDown,
  followUpText: "Your lumberjack gets to work, and after some time, the entire forest is leveled.",
};

const ForestWithHouse: EventType = {
  location     : "Forest",
  stopsProgress: false,
  description: 
    `This forest has a large, conspicuous house in the middle of it. With the
    house, it seems like some of the mystery of this forest has left.`,
  difficulty   : EventDifficulty.NothingHappens,
  options: [
    CutDownForestOption,
    PassOn({ price: 10 }),
  ]
};

const ForestElvesHappy: EventType = {
  location     : "Forest",
  description  : "You don't see any elves, but you have the sense that they are making the forest easier to pass through.",
  difficulty   : EventDifficulty.NothingHappens,
  stopsProgress: false,
  options: [
    PassOn({ price: 0 }),
  ]
};

const ForestElfEvent: EventType = {
  location     : "Forest",
  stopsProgress: false,
  description: 
    `You come to a misty forest. You hear the echo of soft, sad voices in the
    distance, but every time you come closer, they go further away. Passing
    through will be arduous, but is possible.`,
  difficulty   : EventDifficulty.NothingHappens,
  options: [
    CutDownForestOption,
    {
      skillRequired: { type: "specific-skill", skill: "Architect", withoutRequirement: "Everything" },
      description: "Build a house.",
      followUpText : "You cut down some trees and build a log cabin.",
      outcome: [{ type: "lose-meat", amount: 20, hidden: false, }],
      updateEventTo: ForestWithHouse,
    },
    {
      skillRequired: { type: "specific-skill", skill: "Priest", withoutRequirement: "Unlabeled" },
      description: "Commune with the forest elves.",
      followUpText : "The elves are amazed that you know the secret elvish language. Along with meat, they give you a rare silver talisman, telling you to treasure it.",
      updateEventTo: ForestElvesHappy,
      outcome: [
        { type: "gain-meat", amount: 20, hidden: true, },
        { type: "gain-item", item: "Tailisman" }
      ],
    },
    //PassOn({ price: 10 }),
  ],
};

const ForestElfEventBlighted: EventType = {
  location: "Forest",
  description: 
    `You come to a dark, misty forest. You hear the shrill echo of eerie laughter in the
    distance, and you feel uneasy. Passing through will not be easy.`,
  difficulty   : EventDifficulty.NothingHappens,
  stopsProgress: false,
  options: [
    {
      skillRequired: { type: "specific-skill", skill: "Woodsman", withoutRequirement: "Everything" },
      description: "Cut the forest down, one log at a time.",
      outcome: [{ type  : "lose-meat", amount: 50, hidden: false, }],
      followUpText: "Your lumberjack gets to work, but even after a significant amount of work, the forest seems as expansive as it always was.",
    },
    {
      skillRequired: { type: "specific-skill", skill: "Architect", withoutRequirement: "Everything" },
      description: "Build a house.",
      followUpText : "You cut down some trees and build a log cabin. However, after leaving one day, you never seem to be able to find it again...",
      outcome: [{ type: "lose-meat", amount: 20, hidden: false, }],
    },
    {
      skillRequired: { type: "specific-skill", skill: "Priest", withoutRequirement: "Invisible" },
      description: "Appease the angry forest elves.",
      followUpText : "The forest elves shriek at you for bringing misfortune to their forest! After some discussion, though, you convince them that your priest might be able to help them lift the curse and restore their way of life. Your priest will need to stay behind and attend to the spirits of the forest.",
      outcome: [{
        type: "lose-member-strong",
        skill: "Priest",
        hidden: false
      }],
      updateEventTo: ForestElfEvent
    },
    //PassOn({ price: 40 }),
  ]
};
ForestElfEvent.whenBlighted = ForestElfEventBlighted;


const BarbarianVillageRepaired: EventType = {
  location: "BarbarianVillage",
  description: "You find a barbarian village in state of good repair. The barbarians greet you with a friendly wave and let you continue on your way.",
  stopsProgress: false,
  difficulty   : EventDifficulty.NothingHappens,
  options: [
    PassOn({ price: 0 }),
  ]
};

const BarbarianVillageFailedAssassinationAttempt: EventType = {
  location: "BarbarianVillage",
  stopsProgress: false,
  description: `
    The barbarians all point and laugh at you. Then they 
    charge you money to pass on.`,
  difficulty: EventDifficulty.LoseMeat,
  options: [
    PassOn({ price: 5 }),
  ]
};

const BarbarianVillageWornDown: EventType = {
  location: "BarbarianVillage",
  stopsProgress: false,
  description: `
    After days of journeying, your party encounters a ramshackle 
    village of barbarians, with some buildings falling apart. 
    Thok, the gatekeeper to the village, looks you up and down 
    and says, 'Grunt.'`,
  difficulty: EventDifficulty.NormalDifficutly,
  options: [
    {
      skillRequired: { type: "specific-skill", skill: "Architect", withoutRequirement: "Unlabeled" },
      description  : "Repair some of the barbarian's buildings.",
      followUpText : 
      `Thok thanks you for your kindness and lets you pass. The barbarians
      give you some meat as you leave.`,
      outcome      : [{ type: "gain-meat", amount: 10, hidden: true }],
      updateEventTo: BarbarianVillageRepaired,
    },
    {
      skillRequired: { type: "specific-skill", skill: "Assassin", withoutRequirement: "Unlabeled" },
      description  : "Assassinate thok.",
      followUpText : 
        `You completely fail to assassinate Thok. He is much too fast for
        you. He laughs at how slow you are, and picks your meat-filled
        pockets while he's at at it.`,
      outcome      : [{ type: "lose-meat", amount: 10, hidden: true }],
      updateEventTo: BarbarianVillageFailedAssassinationAttempt,
    },
    PassOn({ price: 20 }),
  ]
}

const BlightedBarbarianVillageWornDown: EventType = {
  location: "BarbarianVillage",
  description: `
    After days of journeying, your party encounters a ramshackle 
    village of barbarians, with many buildings falling apart.
    There looks to be fresh blood on the walls of some.
    As you approach, a gigantic barbarian wearing a bone mask jumps out at you and demands, 
    'Grafff muuuuukinasa!'`,
  difficulty: EventDifficulty.NormalDifficutly,
  stopsProgress: true,
  options: [
    {
      skillRequired: { type: "specific-skill", skill: "Architect", withoutRequirement: "Unlabeled" },
      description  : "Repair some of the barbarian's buildings.",
      followUpText : 
      `You gesture to the giant barbarian your intentions to repair the buildings. He punches you in the head.
      Looks like he didn't understand very much.`,
      outcome      : [{ type: "lose-meat", amount: 10, hidden: true }],
    },
    {
      skillRequired: { type: "specific-skill", skill: "Assassin", withoutRequirement: "Unlabeled" },
      description  : "Assassinate the masked barbarian. Assassinate his friends hiding around the corner. Assassinate them all",
      followUpText : 
        //`Strong and tough as they are, it seems no one left is nearly as observant as old Thok the gatekeeper. You lie low for a period, tracking their movements and figuring out what allies you can find to oppose the masked gang. Eventually, you set up a trap and assassinate the masked gang with their help. The village is thrown into chaos and bloodshed as a result and by double-crossing your allies, you are able to help the "Democratic Republican Barbarians" eventually win out. In order to ensure they stay in power, your assassin stays behind as "military counselor".`,
        //`Strong and tough as they are, it seems no one left is nearly as observant as old Thok the gatekeeper. Your assassin slays an entire generation of barbarians. Hardly anyone is left after `,
        `Strong and tough as they are, it seems no one left is nearly as observant as old Thok the gatekeeper. Leaving your assassin behind, he slowly and strategically takes out all members of the ruling faction.`,
      outcome      : [
        { type: "lose-meat", amount: 10, hidden: false },
        { type: "lose-member-strong", skill: "Assassin", hidden: false }
      ], // TODO: lose assassin
      updateEventTo: {
        location: "BarbarianVillage",
        description: 
        //` Your assassin is helping the Democratic Republican Barbarians rule with an iron fist. You avoid the peasant riots and are able to pass through with their help.`,
        `There are no more barbarians here, blighted or otherwise.`,
        difficulty: EventDifficulty.NormalDifficutly,
        stopsProgress: false,
        options: [
          PassOn({ price: 10 }),
        ]
      },
    },
  ]
};
BarbarianVillageWornDown.whenBlighted = BlightedBarbarianVillageWornDown;

const GoblinNest: EventType = {
  location: "GoblinNest",
  stopsProgress: true,
  description: `
    You approach the outskirts of a nest of goblins. You believe
    the goblins are almost certainly warlike. You can overhear
    them talking about how much they hate humans - a favorite goblin
    conversational topic, along with how much they smell.
    `,
  difficulty: EventDifficulty.NormalDifficutly,
  options: [
    {
      skillRequired: { type: "specific-skill", skill: "Architect", withoutRequirement: "Unlabeled" },
      description: "Build a watch tower to attack the goblins from.",
      followUpText:
        `What were you thinking? The goblins notice your shoddy attempts at
        architecture immediately! You barely escape with your lives!`,
      outcome: [{ type: "lose-meat", amount: 10, hidden: true }],

      updateEventTo: {
        location: "GoblinNest",
        stopsProgress: true,
        description: `
          You approach the outskirts of a nest of goblins. There is the beginnings
          of a tower being built here.
          `,
        difficulty: EventDifficulty.NormalDifficutly,
        options: [
          {
            skillRequired: { type: "specific-skill", skill: "Architect", withoutRequirement: "Unlabeled" },
            description: "Continue to build the tower",
            followUpText:
              `You continue to try to build the tower. You make a little more
                progress, and then the goblins (again) notice and run you off. You
                barely escape with your lives. Again. When will you ever learn?`,
            outcome: [{ type: "lose-meat", amount: 10, hidden: true }],
            updateEventTo: {
              location: "GoblinNest",
              stopsProgress: false,
              description: `
                You approach the outskirts of a nest of goblins. There is a serviceable tower built here.
                `,
              difficulty: EventDifficulty.NormalDifficutly,
              options: [
                {
                  skillRequired: { type: "no-skill" },
                  description: "Shoot at the goblins from the tower.",
                  followUpText:
                    `Amazingly, your tower provides enough defense - or the goblins are stupid enough -
                     that you can shoot arrows down to the goblins without any risk of counterattack! The goblins
                     all flee the nest, and you take the opportunity to pick up some left-over goblin meat.`,
                  outcome: [{ type: "gain-meat", amount: 50, hidden: true }],
                  updateEventTo: {
                    location: "GoblinNest",
                    stopsProgress: false,
                    description: `
                      You see the outskirts of an abandoned goblin nest.
                    `,
                    difficulty: EventDifficulty.NormalDifficutly,
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
      skillRequired: { type: "specific-skill", skill: "Assassin", withoutRequirement: "Unlabeled" },
      description: "Assassinate the goblin leader.",
      followUpText:
        `Your assassin waits until nightfall, then sneaks through the camp and
        assassinates the leader of the goblins! She also finds a large treasure
        chest of meat in the leader's tent.`,
      outcome: [{ type: "gain-meat", amount: 100, hidden: true }],
      updateEventTo: {
        location: "GoblinNest",
        stopsProgress: false,
        description: `
          You approach the goblin nest. The goblins are swarming around
          aimlessly, confused, bemoaning the loss of their leader. Slipping
          past them should be easy.
        `,
        difficulty: EventDifficulty.NormalDifficutly,
        options: [
          PassOn({ price: 0 }),
        ]
      }
    },
  ],
};

export const AllEvents: EventType[] = [
  // Finish
  ...FinalEvents,

  // Forest

  ForestElfEvent,
  //ForestElfEventBlighted,
  ...ForestFillerEvents,

  // GoblinNest

  GoblinNest,
  ...GoblinNestFillerEvents,

  BarbarianVillageWornDown,
  //BlightedBarbarianVillageWornDown,

  ...BarbarianVillageFillerEvents,

  ...RiverEvents,

  ...DesertEvents,

  ...MountainEvents,

  ...SwampEvents,

  ...CanyonEvents,
];
