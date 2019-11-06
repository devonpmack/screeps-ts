export default function Tower(tower: StructureTower) {
  var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
  // if one is found...
  if (target) {
    // ...FIRE!
    tower.attack(target);
  }
}
