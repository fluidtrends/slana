"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeCLI = exports.loadInventory = void 0;
var chalk_1 = __importDefault(require("chalk"));
var yargs_1 = __importDefault(require("yargs"));
var path_1 = __importDefault(require("path"));
var js_yaml_1 = __importDefault(require("js-yaml"));
var fs_extra_1 = __importDefault(require("fs-extra"));
var _1 = require(".");
function loadInventory(dir) {
    if (!dir || !fs_extra_1.default.existsSync(dir)) {
        // We need to make sure the working directory exists before anything else
        throw new Error("Looks like your working directory is invalid");
    }
    // This is the inventory file we"re looking for
    var file = path_1.default.join(dir, "slana.yml");
    if (!fs_extra_1.default.existsSync(file)) {
        // We need to make sure the file exists before attempting to load it
        throw new Error("Looks like your Slana file is missing.");
    }
    // This is going to be our inventory content, if any
    var inventory;
    try {
        // First off, let"s try to find and load the command inventory file
        var contents = fs_extra_1.default.readFileSync(file);
        inventory = js_yaml_1.default.safeLoad("" + contents);
    }
    catch (e) {
        // Catch yaml syntax errors
        throw new Error("Slana error: " + e.message);
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
exports.loadInventory = loadInventory;
function initializeCLI(inventory, dir) {
    if (!dir || !fs_extra_1.default.existsSync(dir)) {
        // We need to make sure the working directory exists before anything else
        throw new Error("Looks like your working directory is invalid");
    }
    // This is the manifest file we"re looking for
    var file = path_1.default.join(dir, "package.json");
    if (!fs_extra_1.default.existsSync(file)) {
        // We need to make sure the file exists before attempting to load it
        throw new Error("Looks like your package file is missing.");
    }
    // This is going to be our package content, if any
    var pkg;
    try {
        // Load the package manifest to look through it for information
        pkg = require(file);
    }
    catch (e) {
        // Catch package syntax errors
        throw new Error("Looks like your package file is invalid.");
    }
    if (!pkg.bin || !pkg.bin[inventory.name]) {
        // Let"s make sure the command-line tool was defined in the module"s manifest
        throw new Error("Looks like your command-line tool name is not defined in your manifest");
    }
    var showDetails = (yargs_1.default.argv._ && yargs_1.default.argv._.length > 0 && yargs_1.default.argv._[0] === 'help');
    // This is a generic usage header that will prefix the help message
    var usage = "<" + chalk_1.default.bold("command") + "> [" + chalk_1.default.bold("subcommand") + "] [" + chalk_1.default.bold("options") + "]";
    // Let's tell yargs what we"re looking for based on our inventory
    return yargs_1.default.
        // Prepare a nicely-formatted usage message
        usage(chalk_1.default.green("Usage:") + "\n " + chalk_1.default.green(inventory.name) + " " + chalk_1.default.green(usage)).
        // Make sure the usage message prints out in a compact format
        wrap(0).
        // Insert the version from the package manifest, at the end of the usage message
        epilog(_1.epilog(pkg, showDetails, inventory));
}
exports.initializeCLI = initializeCLI;
//# sourceMappingURL=init.js.map