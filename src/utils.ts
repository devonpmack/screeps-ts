export function isMaxEnergy(store: Store<"energy", false> | Store<ResourceConstant, false>) {
  return Boolean(store) && store.getFreeCapacity(RESOURCE_ENERGY) === 0;
}

export function codeToString(code: ScreepsReturnCode | false) {
  switch (code) {
    case 0:
      return "OK";
    case -1:
      return "NOT_OWNER";
    case -2:
      return "NO_PATH";
    case -3:
      return "NAME_EXISTS";
    case -4:
      return "BUSY";
    case -5:
      return "NOT_FOUND";
    case -6:
      return "NOT_ENOUGH_RESOURCES";
    case -7:
      return "INVALID_TARGET";
    case -8:
      return "FULL";
    case -9:
      return "O-O-Range";
    case -10:
      return "INVALID_ARGS";
    case -11:
      return "TIRED";
    case -12:
      return "NO_BODYPART";
    case -14:
      return "N-E-RCL";
    case -15:
      return "N-E-GCL";
    default:
      return "?";
  }
}

export function noMiners(pos: RoomPosition) {
  return (
    pos.findInRange(FIND_CREEPS, 2, {
      filter: c => isRole(c, MINER)
    }).length === 0
  );
}

export function isRole(creep: Creep, role: string) {
  return Boolean(creep.memory.role) && creep.memory.role === role;
}

export function findClosestStructure<T extends StructureConstant>(
  pos: RoomPosition,
  type: T,
  condition?: (s: TypedStructure<T>) => boolean
): TypedStructure<T> | null {
  return pos.findClosestByPath<TypedStructure<T>>(FIND_MY_STRUCTURES, {
    filter: s => s.structureType === type && (!condition || condition(s as TypedStructure<T>))
  });
}

export const DISTRIBUTOR = "distributor";
export const MINER = "miner";
export const BUILDER = "builder";
export const UPGRADER = "upgrader";
