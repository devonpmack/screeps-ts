import { ErrorMapper } from "utils/ErrorMapper";
import CreepUnit from "./CreepUnit";
import Distributor from "Distributor";
import Upgrader from "Upgrader";
import tickSpawn from "Spawn";
import Builder from "Builder";
import Miner from "Miner";
import Tower from "Tower";
import { DISTRIBUTOR, UPGRADER, BUILDER, MINER } from "utils";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  // export const loop = () => {
  const room = Game.spawns["Spawn1"].room;
  tickSpawn(Game.spawns["Spawn1"]);

  // @ts-ignore
  const towers: StructureTower[] = room.find(FIND_STRUCTURES, {
    filter: struct => struct.structureType === STRUCTURE_TOWER
  });

  if (towers.length > 0) {
    Tower(towers[0]);
  }

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

  const visual = room.visual;
  for (const beingRepaired in Memory.repairing) {
    const thing: AnyStructure | null = Game.getObjectById(beingRepaired);

    if ((thing && thing.hits === thing.hitsMax) || !Game.getObjectById(Memory.repairing[beingRepaired])) {
      Memory.repairing[beingRepaired] = undefined;
    }

    thing && visual.circle(thing.pos, { fill: "transparent", radius: 0.55, stroke: "green" });
  }

  activateSafeModeIfNecessary();

  function activateSafeModeIfNecessary() {
    const hostiles = room.find(FIND_HOSTILE_CREEPS);

    if (hostiles.length > 0) {
      const ctl = room.controller;

      if (room.find(FIND_STRUCTURES, { filter: s => s.structureType === STRUCTURE_WALL && s.hits < 50 }).length > 0) {
        ctl && ctl.activateSafeMode();
      }
    }
  }

  function getCreep(creep: Creep): CreepUnit | null {
    if (creep.spawning) return null;

    if (!creep.memory.role) return null;

    switch (creep.memory.role) {
      case DISTRIBUTOR:
        return new Distributor(creep);
      case UPGRADER:
        return new Upgrader(creep);
      case BUILDER:
        return new Builder(creep);
      case MINER:
        return new Miner(creep);
    }

    return null;
  }
  // };
});
