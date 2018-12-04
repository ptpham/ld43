
export function shuffle<T>(list:T[], random: () => number): T[] {
  const newList: T[] = [];
  const cloneList = [...list];

  while(cloneList.length) {
    const index = Math.floor(random() * cloneList.length);
    newList.push(...cloneList.splice(index, 1));
  }
  return newList;
}
