import { codeToString, noMiners, isRole, DISTRIBUTOR, findClosestStructure } from "utils";

export default class CreepUnit {
  ref: Creep;

  constructor(creep: Creep) {
    this.ref = creep;
  }

  tick() {}

  getEnergy(): boolean {
    if (this.energy > 0 || !this.ref.store.getCapacity()) return false;

    const energySources: EnergySource[] = [];

    for (const f in this.energySources) {
      const source = this.energySources[f]();
      if (!source) continue;
      energySources.push();
    }

    const closest = this.ref.pos.findClosestByPath(energySources);
    return Boolean(closest) && this.grab(closest);
  }

  grab(src: EnergySource | null) {
    if (!src) return false;

    const tryGet = (resp: ScreepsReturnCode) => {
      if (resp === ERR_NOT_IN_RANGE) {
        this.visualMove(src);
        return true;
      } else if (resp === OK) {
        return true;
      }

      return false;
    };

    // @ts-ignore
    if (tryGet(this.ref.pickup(src))) {
      return true;
      // @ts-ignore
    } else if (tryGet(this.ref.withdraw(src))) {
      return true;
      // @ts-ignore
    } else if (tryGet(this.ref.harvest(src))) {
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

  findClosestStructure<T extends StructureConstant>(
    type: T,
    condition?: (s: TypedStructure<T>) => boolean
  ): TypedStructure<T> | null {
    return findClosestStructure(this.ref.pos, type, condition);
  }

  get energySources(): { [id: string]: () => EnergySource | null } {
    return {
      droppedEnergy: () =>
        this.ref.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
          filter: resource =>
            resource.resourceType === RESOURCE_ENERGY && resource.amount >= this.ref.store.getCapacity()
        }) as Resource<RESOURCE_ENERGY> | null,
      container: () =>
        this.findClosestStructure(STRUCTURE_CONTAINER, s => s.store.energy > this.ref.store.getCapacity()),
      storage: () => this.findClosestStructure(STRUCTURE_STORAGE, s => s.store.energy > this.ref.store.getCapacity()),
      source: this.getSource
    };
  }
}
