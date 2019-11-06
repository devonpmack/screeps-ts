import CreepUnit from "./CreepUnit";
import { codeToString } from "utils";

export default class Upgrader extends CreepUnit {
  tick() {
    const result = this.ref.upgradeController(this.ref.room.controller!);
    if (result === OK) {
      // good
      this.say("Upgrading");
    } else if (this.getEnergy()) {
      this.say("Energy🔜");
    } else if (result) {
      this.say(codeToString(result));
      this.upgradeController();
    } else {
      this.say("No targets");
    }
  }

  upgradeController() {
    const creep = this.ref;
    const controller = creep.room.controller;
    if (!controller) {
      return false;
    }

    const result = creep.upgradeController(controller);
    if (result === ERR_NOT_IN_RANGE) {
      this.visualMove(controller);
    }
    return result;
  }
}
