import CreepUnit from "./CreepUnit";
import { codeToString } from "utils";

const TO_REPAIR = [STRUCTURE_CONTAINER, STRUCTURE_WALL, STRUCTURE_ROAD, STRUCTURE_RAMPART, STRUCTURE_STORAGE];

const BUILDING = "building";
const MINING = "energy";
const BORED = "Upgrading";

export default class Builder extends CreepUnit {
  tick() {
    if (!this.memory.state) {
      this.chooseWork();
    }

    this.say(this.memory.state!);

    switch (this.memory.state) {
      case MINING:
        if (!this.isMaxEnergy()) {
          this.getEnergy();
        } else {
          this.memory.state = BUILDING;
        }
        break;
      case BUILDING:
        if (this.energy > 0) {
          if (this.repair(4000)) {
            return;
          }

          const constructionSite = this.ref.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
          // if one is found
          if (constructionSite) {
            // try to build, if the constructionSite is not in range
            if (this.ref.build(constructionSite) == ERR_NOT_IN_RANGE) {
              // move towards the constructionSite
              this.visualMove(constructionSite);
            }
          } else {
            if (this.repair(200000)) {
              return;
            }

            this.say(BORED);
            const result = this.ref.upgradeController(this.ref.room.controller!);
            if (result === ERR_NOT_IN_RANGE) {
              this.visualMove(this.ref.room.controller!);
            }
          }
        } else {
          this.memory.state = MINING;
        }
        break;
    }
  }

  chooseWork() {
    if (this.isMaxEnergy()) {
      this.memory.state = BUILDING;
    } else {
      this.memory.state = MINING;
    }
  }

  repair(threshold: number) {
    const needRepair = this.ref.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: struct =>
        // @ts-ignore
        TO_REPAIR.includes(struct.structureType) &&
        struct.hits < threshold &&
        struct.hits < struct.hitsMax &&
        !this.isBeingRepaired(struct.id)
    });

    if (needRepair) {
      this.say("REPAIR");
      if (this.ref.repair(needRepair) === ERR_NOT_IN_RANGE) {
        // move towards the constructionSite
        this.markRepairing(needRepair.id);
        this.visualMove(needRepair);
      } else {
        this.markDone(needRepair.id);
      }
      return true;
    }
    return false;
  }

  markRepairing(id: string) {
    Memory.repairing[id] = this.ref.id;
  }

  markDone(id: string) {
    Memory.repairing[id] = undefined;
  }

  isBeingRepaired(id: string) {
    return Boolean(Memory.repairing[id]) && Memory.repairing[id] !== this.ref.id;
  }
}
