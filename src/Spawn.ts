import { codeToString } from "utils";

const HARVESTER = "harvester";
const UPGRADER = "upgrader";
const BUILDER = "builder";

export default function tickSpawn(spawn: StructureSpawn) {
  if (spawn.store.energy > 200 && !spawn.spawning) {
    if (count(HARVESTER) < 2) {
      make(HARVESTER);
    }

    if (count(UPGRADER) < 2) {
      make(UPGRADER);
    }

    if (count(BUILDER) === 0) {
      make(BUILDER);
    }
  }

  function make(role: string) {
    const result = spawn.spawnCreep([WORK, CARRY, MOVE], `${role}${Math.floor(Math.random() * 100)}`, {
      memory: { role }
    });

    console.log(`Spawning ${role}: ${codeToString(result)}`);
  }

  function count(role: string) {
    return _.filter(Game.creeps, creep => creep.memory.role === role).length;
  }
}
