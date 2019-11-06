import { codeToString, noMiners, isRole } from "utils";

export default class CreepUnit {
  ref: Creep;

  constructor(creep: Creep) {
    this.ref = creep;
  }

  tick() {}

  getEnergy(): boolean {
    if (this.energy > 0) return false;
    const droppedEnergy = this.ref.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
      filter: resource => resource.resourceType === RESOURCE_ENERGY && resource.amount >= this.ref.store.getCapacity()
    });

    // this.ref.pos.inRangeTo(droppedEnergy.pos, 30) &&

    if (this.isRole(DISTRIBUTOR) && droppedEnergy && (!this.isMaxEnergy() || !this.ref.store.getCapacity())) {
      if (this.ref.pickup(droppedEnergy) === ERR_NOT_IN_RANGE) {
        this.visualMove(droppedEnergy);
      }
      return true;
    }

    // @ts-ignore
    const container: StructureContainer | null = this.ref.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: structure =>
        structure.structureType === STRUCTURE_CONTAINER && structure.store.energy >= this.ref.store.getCapacity()
    });

    if ((!this.isMaxEnergy() || !this.ref.store.getCapacity()) && container) {
      if (this.ref.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        this.visualMove(container);
      }

      return true;
    }

    if (droppedEnergy && (!this.isMaxEnergy() || !this.ref.store.getCapacity())) {
      if (this.ref.pickup(droppedEnergy) === ERR_NOT_IN_RANGE) {
        this.visualMove(droppedEnergy);
      }
      return true;
    }

    const source = this.getSource();
    if ((!this.isMaxEnergy() || !this.ref.store.getCapacity()) && source) {
      if (this.ref.harvest(source) === ERR_NOT_IN_RANGE) {
        this.visualMove(source);
      }
      return true;
    }

    return false;
  }

  getSource(): Source | null {
    if (this.memory.sourceId) {
      return Game.getObjectById(this.memory.sourceId);
    } else {
      let sources = this.ref.room.find(FIND_SOURCES_ACTIVE, {
        filter: s => noMiners(s.pos)
      });
      const source = sources[Math.floor(Math.random() * sources.length)];

      this.memory.sourceId = source.id;
      return source;
    }
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

  isRole(role: string) {
    return isRole(this.ref, role);
  }
}
