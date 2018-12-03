import { EventDifficulty, EventOption, EventType } from '../eventDefinition';

const VolcanoStayOption: EventOption = {
  skillRequired: { type: "no-skill" },
  description: "Camp on the volcano.",
  followUpText: "",
  outcome: [{ type: "lose-meat", amount: 20, hidden: false }],
};

function getGambitOptions(updateEventTo: EventType): EventOption[] {
  return [
    {
      skillRequired: { type: "specific-item", skill: "Tailisman", withoutRequirement: "Unlabeled" },
      description: "Chant while holding the Tailisman.",
      followUpText: `
        You chant with the Tailisman. It begins to glow, then shake, then burst.
        The smoke seems to shrink a bit. A explosion causes you to stumble backwards.
      `,
      outcome: [
        { type: "lose-item", item: "Tailisman" },
        { type: "turn-back" }
      ],
      updateEventTo: updateEventTo,
    },
    {
      skillRequired: { type: "specific-item", skill: "Red Orb", withoutRequirement: "Unlabeled" },
      description: "Throw the Red Orb",
      followUpText: `
        You throw the Red Orb. It hits the ground and begins to spin, clearing up the smoke a bit.
        A gust of wind blows you backwards.
      `,
      outcome: [
        { type: "lose-item", item: "Red Orb" },
        { type: "turn-back" }
      ],
      updateEventTo: updateEventTo,
    },
    {
      skillRequired: { type: "specific-item", skill: "Golden Snake", withoutRequirement: "Unlabeled" },
      description: "Use the Golden Snake.",
      followUpText: `
        You hold up the Golden Snake. A purple glow emanates from the item. The snake's mouth opens
        and eats some of the smoke. The earth jolts, sending you backwards.
      `,
      outcome: [
        { type: "lose-item", item: "Golden Snake" },
        { type: "turn-back" }
      ],
      updateEventTo: updateEventTo,
    },
  ];
}

const Finale: EventType = {
  location: "Finish",
  description: `
    Lava bubbles inside the volcano's mouth waiting for its prize.`,
  difficulty: EventDifficulty.NothingHappens,
  stopsProgress: false,
  options: [
    {
      skillRequired: { type: "specific-skill", skill: "Fool", withoutRequirement: "Unlabeled" },
      description: "Drop the idol into the maws of the volcano from whence it came.",
      followUpText: "",
      winsGame: true,
      requiresIdol: true,
      outcome: [{ type: "lose-member-strong", skill: "Fool", hidden: true }],
    },
    VolcanoStayOption
  ]
};

const FinalFinalFinalGambit: EventType = {
  location: "Finish",
  description: `
    Strange clouds rise from the volcano as it bubbles.
    They prevent you from approaching the mouth. The smoke is almost cleared up.`,
  stopsProgress: true,
  difficulty: EventDifficulty.NormalDifficutly,
  options: [
    ...getGambitOptions(Finale),
    VolcanoStayOption
  ],
}

const FinalFinalGambit: EventType = {
  location: "Finish",
  description: `
    Strange clouds rise from the volcano as it bubbles.
    They prevent you from approaching the mouth. The smoke seems a bit better.`,
  stopsProgress: true,
  difficulty: EventDifficulty.NormalDifficutly,
  options: [
    ...getGambitOptions(FinalFinalFinalGambit),
    VolcanoStayOption
  ],
}

export const FinalGambit: EventType = {
  location: "Finish",
  description: `
    Strange clouds rise from the volcano as it bubbles.
    They prevent you from approaching the mouth.`,
  stopsProgress: true,
  difficulty: EventDifficulty.NormalDifficutly,
  options: [
    ...getGambitOptions(FinalFinalGambit),
    VolcanoStayOption
  ],
}

export const FinalEvents = [
  FinalGambit,
  FinalFinalGambit,
  Finale,
];
