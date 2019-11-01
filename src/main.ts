import { ErrorMapper } from "utils/ErrorMapper";
import CreepUnit from "./CreepUnit";
import Harvester from "Harvester";
import Upgrader from "Upgrader";
import tickSpawn from "Spawn";
import Builder from "Builder";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  tickSpawn(Game.spawns["Spawn1"]);

  for (const name in Game.creeps) {
    const creep = getCreep(Game.creeps[name]);

    creep && creep.tick();
  }

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }

  function getCreep(creep: Creep): CreepUnit | null {
    switch (creep.memory.role) {
      case "harvester":
        return new Harvester(creep);
      case "upgrader":
        return new Upgrader(creep);
      case "builder":
        return new Builder(creep);
    }

    return null;
  }
});
