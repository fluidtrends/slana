import yargs from "yargs";
import { Inventory } from '.';
export declare function loadInventory(dir?: string): any;
export declare function initializeCLI(inventory?: Inventory, dir?: string): yargs.Argv<{}>;
