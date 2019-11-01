import CreepUnit from "./CreepUnit";
import { isMaxEnergy } from "./utils";

const STRUCTURES_TO_REFILL = [STRUCTURE_SPAWN, STRUCTURE_CONTROLLER];

export default class Harvester extends CreepUnit {
  target: any;

  tick() {
    this.target = this.getTarget();

    if (this.deliver() === OK) {
      this.say("Transfer");
    } else if (this.getEnergy()) {
      this.say("Energy🔜");
    } else if (this.distributeEnergy()) {
      this.say("Deliver");
    } else {
      this.say("No targets");
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
    return this.ref.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (structure: StructureSpawn) =>
        STRUCTURES_TO_REFILL.includes(structure.structureType) && !isMaxEnergy(structure.store)
    });
  }
}
