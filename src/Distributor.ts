import CreepUnit from "./CreepUnit";
import { isMaxEnergy, codeToString, noMiners, isRole, BUILDER } from "./utils";

const STRUCTURES_TO_REFILL = [STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_TOWER];

export default class Distributor extends CreepUnit {
  target: any;

  tick() {
    this.target = this.getTarget();

    if (this.deliver() === OK) {
      this.say("Transfer");
    } else if (this.getEnergy()) {
      this.say("Collecting");
    } else if (this.distributeEnergy()) {
      this.say("Deliver");
    } else {
      this.say(codeToString(this.deliver()));
    }
  }

  distributeEnergy() {
    if (this.deliver() === ERR_NOT_IN_RANGE) {
      this.visualMove(this.target);
      return true;
    }

    return false;
  }

  deliver() {
    if (this.target) {
      return this.ref.transfer(this.target, RESOURCE_ENERGY);
    }

    return false;
  }

  getTarget() {
    const refill = () =>
      this.ref.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: structure =>
          // @ts-ignore
          STRUCTURES_TO_REFILL.includes(structure.structureType) && !isMaxEnergy(structure.store)
      });

    const structure = () =>
      this.findClosestStructure(STRUCTURE_CONTAINER, s => !isMaxEnergy(s.store) && noMiners(s.pos));

    const creep = () =>
      this.ref.pos.findClosestByPath(FIND_CREEPS, {
        filter: creep =>
          isRole(creep, BUILDER) && creep.store && !isMaxEnergy(creep.store) && creep.pos.inRangeTo(this.ref, 5)
      });

    const storage = () => this.findClosestStructure(STRUCTURE_STORAGE, storage => !isMaxEnergy(storage.store));

    return refill() || structure() || creep() || storage();
  }

  getEnergy(): boolean {
    if (this.energy > 0 || !this.ref.store.getCapacity()) return false;

    const droppedEnergy = this.energySources.droppedEnergy();

    if (droppedEnergy) {
      if (this.ref.pickup(droppedEnergy) === ERR_NOT_IN_RANGE) {
        this.visualMove(droppedEnergy);
      }
      return true;
    }

    const container = this.energySources.container();

    if (container) {
      if (this.ref.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        this.visualMove(container);
      }

      return true;
    }

    const source = this.energySources.source();
    if (source) {
      if (this.ref.harvest(source) === ERR_NOT_IN_RANGE) {
        this.visualMove(source);
      }
      return true;
    }

    return false;
  }
}
