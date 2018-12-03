
import { AllEvents, EventDifficulty } from './game/events';
import { LocationTypeNames, SkillTypeNames } from './game/data';
import _ from 'lodash';

export function printLocationTypeSummary() {
  for (let locationType of LocationTypeNames) {
    let locationEvents = _.filter(AllEvents, x => x.location == locationType);
    console.log(`Location ${locationType} has ${locationEvents.length}`);

    console.log('Difficulty distribution:');
    for (let i = 0; i < EventDifficulty.MaxDifficulty; i++) {
      console.log(`\t${i} - ${_.filter(locationEvents, x => x.difficulty == i).length}`);
    }

    let skillsUsed = new Set(_.flatMap(locationEvents, e => _.map(e.options, 'skillRequired.skill')));
    console.log('Character usage:');
    for (let skill of SkillTypeNames) {
      console.log(`\t${skill} - ${skillsUsed.has(skill)}`);
    }
  }
}

