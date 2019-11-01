export default class CreepUnit {
  ref: Creep;

  constructor(creep: Creep) {
    this.ref = creep;
  }

  tick() {}

  getEnergy(): boolean {
    const source = this.ref.pos.findClosestByRange(FIND_SOURCES_ACTIVE);

    if (!this.isMaxEnergy() && source) {
      if (this.ref.harvest(source) === ERR_NOT_IN_RANGE) {
        this.visualMove(source);
      }
      return true;
    }
    return false;
  }

  isMaxEnergy(): boolean {
    return this.ref.store.getFreeCapacity(RESOURCE_ENERGY) === 0;
  }

  get energy() {
    return this.ref.store.energy;
  }

  get memory() {
    return this.ref.memory;
  }

  visualMove(target: any) {
    this.ref.moveTo(target, { visualizePathStyle: { stroke: "#ffffff" } });
  }

  say(message: string) {
    this.ref.say(message);
  }
}
