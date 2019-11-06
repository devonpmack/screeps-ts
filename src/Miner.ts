import CreepUnit from "./CreepUnit";

export default class Miner extends CreepUnit {
  tick() {
    // const container = this.ref.pos.findClosestByPath(FIND_STRUCTURES, {
    //   filter: structure => structure.structureType === STRUCTURE_CONTAINER && structure.pos.findInRange(FIND_CREEPS, 1)
    // });
    const source = this.getSource();
    if (source) {
      if (this.ref.harvest(source) === ERR_NOT_IN_RANGE) {
        this.visualMove(source);
      }
    }

    this.say("MINE!");
  }
}
