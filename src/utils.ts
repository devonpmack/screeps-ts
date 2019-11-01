export function isMaxEnergy(store: Store<"energy", false>) {
  return Boolean(store) && store.getFreeCapacity(RESOURCE_ENERGY) > 0;
}

export function codeToString(code: ScreepsReturnCode) {
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
