import out from "chalk"
import fs from "fs-extra"

import {
    Inventory,
    parseCommand,
    loadInventory,
    initializeCLI,
    extractCommand
} from '.'

export function stopWithError(error: TypeError) {
    // Something went wrong at some point so we"re going to stop right away,
    // print out a nice error message and signal the parent process that we
    // stopped because of an error
    process.stderr.write(`\n${out.red("Error:")}\n  ${out.red("✗")} ${out.bold(error.message)}\n\n`);
}

export function executeCommand(inventory?: Inventory, cli?: any, dir?: string) {
    if (!dir || !fs.existsSync(dir)) {
        // We need to make sure the working directory exists before anything else
        throw new Error("Looks like your working directory is invalid");
    }

    // Keep track of all command executors
    var executors = {};

    // This is the fun part; we"re going to look through our inventory, command by command,
    // and tell yargs what commands to look for, along with each command"s options, if any
    inventory?.commands.forEach((command) => {
        if (!command.name) {
            // We don"t let commands without a name go through
            throw new Error("Make sure each command in your command inventory has a name");
        }

        // Look for the command"s properties, including options, if any
        var cmd = parseCommand(command, cli, dir);

        // The command is ready to be added to the parser
        cli.command(cmd.name, out.grey(cmd.description), cmd.options, cmd.executor);
    });

    // We've got ourselves a command line now, so let"s extract the command
    extractCommand(cli, inventory);
}

export function run (dir: string) {
    try {
  
      // We want to start off by investigating the inventory
      var inventory = loadInventory(dir);
  
      // We start off by initializing from the inventory
      var cli = initializeCLI(inventory, dir);
  
      // If the inventory is fine, we're going to execute the command
      executeCommand(inventory, cli, dir);
    } catch (error) {
      stopWithError(error);
    }
}