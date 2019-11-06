import { codeToString, noMiners, isRole, DISTRIBUTOR, findClosestStructure } from "utils";

export default class CreepUnit {
  ref: Creep;

  constructor(creep: Creep) {
    this.ref = creep;
  }

  tick() {}

  getEnergy(): boolean {
    if (this.energy > 0 || !this.ref.store.getCapacity()) return false;

    // const droppedEnergy = this.ref.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
    //   filter: resource => resource.resourceType === RESOURCE_ENERGY && resource.amount >= this.ref.store.getCapacity()
    // });

    // if (this.isRole(DISTRIBUTOR) && droppedEnergy) {
    //   if (this.ref.pickup(droppedEnergy) === ERR_NOT_IN_RANGE) {
    //     this.visualMove(droppedEnergy);
    //   }
    //   return true;
    // }

    // @ts-ignore
    // const container: StructureContainer | null = this.ref.pos.findClosestByPath(FIND_STRUCTURES, {
    //   filter: structure =>
    //     structure.structureType === STRUCTURE_CONTAINER && structure.store.energy >= this.ref.store.getCapacity()
    // });

    // if (container) {
    //   if (this.ref.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
    //     this.visualMove(container);
    //   }

    //   return true;
    // }

    // if (!this.isRole(DISTRIBUTOR)) {
    //   const storage = this.ref.pos.findClosestByPath(FIND_STRUCTURES, {
    //     filter: structure =>
    //       structure.structureType === STRUCTURE_STORAGE && structure.store.energy >= this.ref.store.getCapacity()
    //   });

    //   if (storage) {
    //     if (this.ref.withdraw(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
    //       this.visualMove(storage);
    //     }

    //     return true;
    //   }
    // }

    // if (droppedEnergy) {
    //   if (this.ref.pickup(droppedEnergy) === ERR_NOT_IN_RANGE) {
    //     this.visualMove(droppedEnergy);
    //   }
    //   return true;
    // }

    // const source = this.getSource();
    // if (source) {
    //   if (this.ref.harvest(source) === ERR_NOT_IN_RANGE) {
    //     this.visualMove(source);
    //   }
    //   return true;
    // }

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

  findClosestStructure<T extends StructureConstant>(
    type: T,
    condition?: (s: TypedStructure<T>) => boolean
  ): TypedStructure<T> | null {
    return findClosestStructure(this.ref.pos, type, condition);
  }

  get energySources() {
    return {
      droppedEnergy: () =>
        this.ref.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
          filter: resource =>
            resource.resourceType === RESOURCE_ENERGY && resource.amount >= this.ref.store.getCapacity()
        }),
      container: () =>
        this.findClosestStructure(STRUCTURE_CONTAINER, s => s.store.energy > this.ref.store.getCapacity()),
      storage: () => this.findClosestStructure(STRUCTURE_STORAGE, s => s.store.energy > this.ref.store.getCapacity()),
      source: this.getSource
    };
  }
}
