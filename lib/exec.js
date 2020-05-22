"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.executeCommand = exports.stopWithError = void 0;
var chalk_1 = __importDefault(require("chalk"));
var fs_extra_1 = __importDefault(require("fs-extra"));
var _1 = require(".");
function stopWithError(error) {
    // Something went wrong at some point so we"re going to stop right away,
    // print out a nice error message and signal the parent process that we
    // stopped because of an error
    process.stderr.write("\n" + chalk_1.default.red("Error:") + "\n  " + chalk_1.default.red("✗") + " " + chalk_1.default.bold(error.message) + "\n\n");
}
exports.stopWithError = stopWithError;
function executeCommand(inventory, cli, dir) {
    if (!dir || !fs_extra_1.default.existsSync(dir)) {
        // We need to make sure the working directory exists before anything else
        throw new Error("Looks like your working directory is invalid");
    }
    // Keep track of all command executors
    var executors = {};
    // This is the fun part; we"re going to look through our inventory, command by command,
    // and tell yargs what commands to look for, along with each command"s options, if any
    inventory === null || inventory === void 0 ? void 0 : inventory.commands.forEach(function (command) {
        if (!command.name) {
            // We don"t let commands without a name go through
            throw new Error("Make sure each command in your command inventory has a name");
        }
        // Look for the command"s properties, including options, if any
        var cmd = _1.parseCommand(command, cli, dir);
        // The command is ready to be added to the parser
        cli.command(cmd.name, chalk_1.default.grey(cmd.description), cmd.options, cmd.executor);
    });
    // We've got ourselves a command line now, so let"s extract the command
    _1.extractCommand(cli, inventory);
}
exports.executeCommand = executeCommand;
function run(dir) {
    try {
        // We want to start off by investigating the inventory
        var inventory = _1.loadInventory(dir);
        // We start off by initializing from the inventory
        var cli = _1.initializeCLI(inventory, dir);
        // If the inventory is fine, we're going to execute the command
        executeCommand(inventory, cli, dir);
    }
    catch (error) {
        stopWithError(error);
    }
}
exports.run = run;
//# sourceMappingURL=exec.js.map