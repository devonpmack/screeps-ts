import CreepUnit from "./CreepUnit";
import { codeToString } from "utils";

const BUILDING = "building";
const MINING = "mining";
const BORED = "bored";

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
          const constructionSite = this.ref.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
          // if one is found
          if (constructionSite) {
            // try to build, if the constructionSite is not in range
            if (this.ref.build(constructionSite) == ERR_NOT_IN_RANGE) {
              // move towards the constructionSite
              this.visualMove(constructionSite);
            }
          } else {
            this.say(BORED);
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
}
