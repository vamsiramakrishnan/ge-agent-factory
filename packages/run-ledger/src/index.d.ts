// Type surface for index.mjs.
export * from "./status";
export * from "./frames";
export * from "./reduce";

// Store surface (store.mjs is plain JS — declare the exported names loosely).
export declare const LEDGER_STAGES: string[];
export declare function factoryEventToLedgerOp(event: any): any;
export declare function createRunLedger(adapter: any): any;
export declare function sqliteAdapter(path?: string): Promise<any>;
export declare function pgAdapter(dsn: string): Promise<any>;
export declare function openRunLedger(path?: string): Promise<any>;
