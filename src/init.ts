import out from "chalk"
import yargs from "yargs"
import path from "path"
import yaml from "js-yaml"
import fs from "fs-extra"

import {
    Inventory,
    epilog
} from '.'

export function loadInventory(dir?: string) {
    if (!dir || !fs.existsSync(dir)) {
        // We need to make sure the working directory exists before anything else
        throw new Error("Looks like your working directory is invalid");
    }

    // This is the inventory file we"re looking for
    var file = path.join(dir, "slana.yml");

    if (!fs.existsSync(file)) {
        // We need to make sure the file exists before attempting to load it
        throw new Error("Looks like your Slana file is missing.");
    }

    // This is going to be our inventory content, if any
    var inventory;

    try {
        // First off, let"s try to find and load the command inventory file
        const contents = fs.readFileSync(file);
        inventory = yaml.safeLoad(`${contents}`);
    } catch (e) {
        // Catch yaml syntax errors
        throw new Error(`Slana error: ${e.message}`);
    }

    if (!inventory) {
        // Add an extra sanity check
        throw new Error("Looks like your Slana file is empty.");
    }

    if (!inventory.name) {
        // Make sure we have a name defined
        throw new Error("Looks like your Slana file is missing the name of your command line tool");
    }

    if (!inventory.commands || inventory.commands.count === 0) {
        // Make sure we have one or more commands
        throw new Error("Looks like your Slana file does not specify any commands");
    }

    // This should be a valid inventory
    return inventory;
}

export function initializeCLI(inventory?: Inventory, dir?: string) {
    if (!dir || !fs.existsSync(dir)) {
        // We need to make sure the working directory exists before anything else
        throw new Error("Looks like your working directory is invalid");
    }

    // This is the manifest file we"re looking for
    var file = path.join(dir, "package.json");

    if (!fs.existsSync(file)) {
        // We need to make sure the file exists before attempting to load it
        throw new Error("Looks like your package file is missing.");
    }

    // This is going to be our package content, if any
    var pkg;

    try {
        // Load the package manifest to look through it for information
        pkg = require(file);
    } catch (e) {
        // Catch package syntax errors
        throw new Error("Looks like your package file is invalid.");
    }

    if (!pkg.bin || !pkg.bin[inventory!.name]) {
        // Let"s make sure the command-line tool was defined in the module"s manifest
        throw new Error("Looks like your command-line tool name is not defined in your manifest");
    }

    const showDetails = (yargs.argv._ && yargs.argv._.length > 0 && yargs.argv._[0] === 'help')

    // This is a generic usage header that will prefix the help message
    var usage = "<" + out.bold("command") + "> [" + out.bold("subcommand") + "] [" + out.bold("options") + "]";

    // Let's tell yargs what we"re looking for based on our inventory
    return yargs.

    // Prepare a nicely-formatted usage message
    usage(`${out.green("Usage:")}\n ${out.green(inventory!.name)} ${out.green(usage)}`).

    // Make sure the usage message prints out in a compact format
    wrap(0).

    // Insert the version from the package manifest, at the end of the usage message
    epilog(epilog(pkg, showDetails, inventory!));
}