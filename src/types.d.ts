// example declaration file - remove these and add your own custom typings

// memory extension samples
interface CreepMemory {
  role: string;
  room?: string;
  state?: string;
  sourceId?: string;
}

type TypedStructure<T extends StructureConstant> = T extends STRUCTURE_CONTAINER
  ? StructureContainer
  : T extends STRUCTURE_CONTROLLER
  ? StructureController
  : T extends STRUCTURE_EXTENSION
  ? StructureExtension
  : T extends STRUCTURE_EXTRACTOR
  ? StructureExtractor
  : T extends STRUCTURE_KEEPER_LAIR
  ? StructureKeeperLair
  : T extends STRUCTURE_LAB
  ? StructureLab
  : T extends STRUCTURE_LINK
  ? StructureLink
  : T extends STRUCTURE_NUKER
  ? StructureNuker
  : T extends STRUCTURE_OBSERVER
  ? StructureObserver
  : T extends STRUCTURE_PORTAL
  ? StructurePortal
  : T extends STRUCTURE_POWER_BANK
  ? StructurePowerBank
  : T extends STRUCTURE_POWER_SPAWN
  ? StructurePowerSpawn
  : T extends STRUCTURE_RAMPART
  ? StructureRampart
  : T extends STRUCTURE_ROAD
  ? StructureRoad
  : T extends STRUCTURE_SPAWN
  ? StructureSpawn
  : T extends STRUCTURE_STORAGE
  ? StructureStorage
  : T extends STRUCTURE_TERMINAL
  ? StructureTerminal
  : T extends STRUCTURE_TOWER
  ? StructureTower
  : T extends STRUCTURE_WALL
  ? StructureWall
  : Structure<T>;

interface Memory {
  repairing: { [id: string]: string | undefined };
  uuid: number;
  log: any;
}

// `global` extension samples
declare namespace NodeJS {
  interface Global {
    log: any;
  }
}
