"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCommand = exports.extractCommand = exports.parseCommandOptionsAndExamples = void 0;
var chalk_1 = __importDefault(require("chalk"));
var yargs_1 = __importDefault(require("yargs"));
var path_1 = __importDefault(require("path"));
var exampleCounter = 1;
function parseCommandOptionsAndExamples(command, cli) {
    var options = {};
    var groupName = chalk_1.default.bold.green(command.name);
    if (command.more) {
        groupName = groupName + "\n\n" + " ".repeat(3) + chalk_1.default.grey(command.more);
    }
    groupName = groupName + "\n";
    if (command.options) {
        command.options.forEach(function (option) {
            if (option.name) {
                options[option.name] = {
                    name: option.name,
                    default: option.default,
                    describe: chalk_1.default.grey(option.description),
                    group: groupName,
                    type: option.type
                };
                cli.option(option.name, options[option.name]);
            }
        });
    }
    if (command.examples && cli.argv._.length > 0 && cli.argv._[0] === 'help') {
        if (command.options) {
            cli.option("-".repeat(12), {
                describe: "",
                group: groupName
            });
        }
        var counter = 1;
        command.examples.forEach(function (example) {
            if (example.command) {
                cli.option("➔ " + chalk_1.default.yellow("Example " + exampleCounter + "." + counter + ":") + "\n", {
                    describe: chalk_1.default.green(example.command) + "\n ↳ " + chalk_1.default.grey(example.description || ""),
                    group: groupName
                });
                counter = counter + 1;
            }
        });
        exampleCounter = exampleCounter + 1;
    }
    return options;
}
exports.parseCommandOptionsAndExamples = parseCommandOptionsAndExamples;
function extractCommand(cli, inventory) {
    // Actually do the hard work and parse the command line
    cli = cli.argv;
    if (cli._.length === 0) {
        // Looks like we did not specify a command so let"s
        // just bail out with the usage message
        yargs_1.default.showHelp();
        return;
    }
    // We have successfully parsed the command line, so now let"s construct a command;
    // first keep track of the command type and we assume no options to start with
    var command = {
        name: cli._[0],
        options: {}
    };
    if (command.name === 'help') {
        yargs_1.default.showHelp();
        return;
    }
    // We want to make sure that the command we've just parsed is one we support,
    // so to do that we"re going to look through our inventory and see if we can find it
    var unknown = true;
    inventory === null || inventory === void 0 ? void 0 : inventory.commands.forEach(function (cmd) {
        var cmdName = cmd.name.split(' ')[0];
        (cmdName === command.name) ? unknown = false : null;
    });
    if (unknown) {
        // If this command is one we don"t support, let"s just stop now with a nice
        // error message, but with the usage as well
        yargs_1.default.showHelp();
        throw new Error("Sorry, the " + chalk_1.default.red.bold(command.name) + " command is not supported.");
    }
    // We've now got ourselves a parsed command that we support so let's prepare it
    // for execution
    inventory === null || inventory === void 0 ? void 0 : inventory.commands.forEach(function (cmd) {
        var cmdName = cmd.name.split(' ')[0];
        cmdName === command.name && cmd.options &&
            // so first, let"s fill the command with all its expected options
            cmd.options.forEach(function (option) { return command.options[option.name] = cli[option.name]; });
    });
    // This command should now be ready for further manipulation
    return command;
}
exports.extractCommand = extractCommand;
function parseCommand(command, cli, dir) {
    if (!command.executor) {
        // We need a command executor, otherwise, there"s nothing to execute
        throw new Error("Make sure the " + chalk_1.default.green(command.name) + " command has a valid command executor");
    }
    // We will parse the command into this temporary structure and we start off
    // with the values from the inventory
    var cmd = {
        name: command.name,
        description: command.description,
        options: {}
    };
    try {
        // Attempt to resolve the executor
        cmd.executor = require(path_1.default.join(dir, command.executor)).default;
        if (typeof cmd.executor != "function") {
            // We need an executor function, not something else (ie. an object)
            throw new Error();
        }
    }
    catch (e) {
        // Looks like the executor could not be resolved
        throw new Error("Make sure the " + chalk_1.default.green(command.name) + " command has a valid command executor");
    }
    // Looks like this command has options, so let"s parse them
    Object.assign(cmd.options, parseCommandOptionsAndExamples(command, cli));
    // We"ve got ourselves a parsed command, ready for processing
    return cmd;
}
exports.parseCommand = parseCommand;
//# sourceMappingURL=parse.js.map