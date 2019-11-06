// example declaration file - remove these and add your own custom typings

// memory extension samples
interface CreepMemory {
  role: string;
  room?: string;
  state?: string;
  sourceId?: string;
}

interface Memory {
  repairing: { [id: string]: string | undefined };
  uuid: number;
  log: any;
}

declare const DISTRIBUTOR = "distributor";
declare const MINER = "miner";
declare const BUILDER = "builder";
declare const UPGRADER = "upgrader";

// `global` extension samples
declare namespace NodeJS {
  interface Global {
    log: any;
  }
}
