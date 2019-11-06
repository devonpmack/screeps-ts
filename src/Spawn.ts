import { codeToString, isRole } from "utils";

// move = 2  * (O * 0.5 - M)
//     O = 2M

export default function tickSpawn(spawn: StructureSpawn) {
  const min = {
    BUILDER: 4,
    UPGRADER: 4,
    DISTRIBUTOR: 4,
    MINER: 2
    // MINER: countStructure(STRUCTURE_CONTAINER)
  };

  const { energyAvailable } = spawn.room;

  if (energyAvailable >= 200 && !spawn.spawning) {
    if (count(DISTRIBUTOR) < min.DISTRIBUTOR) {
      make(DISTRIBUTOR, count(MINER) > 0 ? [MOVE, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, CARRY, CARRY] : undefined); //, [MOVE, MOVE, CARRY, CARRY]);
      return;
    }

    if (count(MINER) < min.MINER) {
      make(MINER, [WORK, WORK, WORK, WORK, WORK, MOVE]);
      return;
    }

    if (count(UPGRADER) < min.UPGRADER) {
      make(UPGRADER, [WORK, WORK, CARRY, CARRY, MOVE, MOVE]);
      return;
    }

    if (count(BUILDER) < min.BUILDER) {
      make(BUILDER, [WORK, WORK, CARRY, CARRY, MOVE, MOVE]);
      return;
    }
  }

  function make(role: string, opts?: BodyPartConstant[]) {
    const result = spawn.spawnCreep(opts || [WORK, CARRY, MOVE], `${role}${Math.floor(Math.random() * 100)}`, {
      memory: { role }
    });

    console.log(`Spawning ${role}: ${codeToString(result)}`);
  }

  function countStructure(type: StructureConstant) {
    return spawn.room.find(FIND_STRUCTURES, { filter: structure => structure.structureType === type }).length;
  }
}

function count(role: string) {
  return _.filter(Game.creeps, creep => isRole(creep, role)).length;
}
