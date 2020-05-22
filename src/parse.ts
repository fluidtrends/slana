import out from "chalk"
import yargs from "yargs"
import path from "path"
import fs from "fs-extra"

import {
    Option,
    Command,
    Inventory,
    Example
} from '.'

var exampleCounter = 1

export function parseCommandOptionsAndExamples(command: any, cli: any) {    
    var options: any = {}
    var groupName =  out.bold.green(command.name);
    
    if (command.more) {
        groupName =  groupName + "\n\n" + " ".repeat(3) + out.grey(command.more);
    }

    groupName =  groupName + "\n";

    if (command.options) {
        command.options.forEach((option: Option) => {
            if (option.name) {
                options[option.name] = {
                    name: option.name,
                    default: option.default,
                    describe: out.grey(option.description),
                    group: groupName,
                    type: option.type
                } as Option
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

        var counter = 1
        command.examples.forEach((example: Example) => {
            if (example.command) {
                cli.option("➔ " + out.yellow("Example " + exampleCounter + "." + counter + ":") + "\n", {
                    describe:  out.green("chunky " + example.command) + "\n ↳ "  + out.grey(example.description || "") ,
                    group: groupName
                });
                counter = counter + 1;
            }
        });

        exampleCounter = exampleCounter + 1;
    }

    return options;
}

export function extractCommand(cli?: any, inventory?: Inventory) {
    // Actually do the hard work and parse the command line
    cli = cli.argv;

    if (cli._.length === 0) {
        // Looks like we did not specify a command so let"s
        // just bail out with the usage message
        yargs.showHelp();
        return;
    }

    // We have successfully parsed the command line, so now let"s construct a command;
    // first keep track of the command type and we assume no options to start with
    var command = {
        name: cli._[0],
        options: {}
    } as any;

    if (command.name === 'help') {
        yargs.showHelp();
        return;
    }

    // We want to make sure that the command we've just parsed is one we support,
    // so to do that we"re going to look through our inventory and see if we can find it
    var unknown = true;
    inventory?.commands.forEach((cmd) => {
        var cmdName = cmd.name.split(' ')[0];
        (cmdName === command.name) ? unknown = false : null
    });

    if (unknown) {
        // If this command is one we don"t support, let"s just stop now with a nice
        // error message, but with the usage as well
        yargs.showHelp();
        throw new Error(`Sorry, the ${out.red.bold(command.name)} command is not supported.`);
    }

    // We've now got ourselves a parsed command that we support so let's prepare it
    // for execution
    inventory?.commands.forEach((cmd) => {
        var cmdName = cmd.name.split(' ')[0];
        cmdName === command.name && cmd.options &&

            // so first, let"s fill the command with all its expected options
            cmd.options.forEach((option: Option) => command.options[option.name] = cli[option.name])
    });

    // This command should now be ready for further manipulation
    return command;
}

export function parseCommand(command: Command, cli: any, dir: string) {
    if (!command.executor) {
        // We need a command executor, otherwise, there"s nothing to execute
        throw new Error(`Make sure the ${out.green(command.name)} command has a valid command executor`);
    }

    // We will parse the command into this temporary structure and we start off
    // with the values from the inventory
    var cmd = {
        name: command.name,
        description: command.description,
        options: {}
    } as any

    try {
        // Attempt to resolve the executor
        cmd.executor = require(path.join(dir, command.executor));
        if (typeof cmd.executor != "function") {
            // We need an executor function, not something else (ie. an object)
            throw new Error();
        }
    } catch (e) {
        // Looks like the executor could not be resolved
        throw new Error(`Make sure the ${out.green(command.name)} command has a valid command executor`);
    }

    // Looks like this command has options, so let"s parse them
    Object.assign(cmd.options, parseCommandOptionsAndExamples(command, cli));

    // We"ve got ourselves a parsed command, ready for processing
    return cmd;
}