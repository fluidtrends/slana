// We use chalk to color the usage message
var out = require('chalk');

// yargs helps us elegantly parse the command line
var yargs = require('yargs');

// We use path to find the command inventory file
var path = require('path');

// The yaml module will come in handy for parsing the command inventory file
var yaml = require('js-yaml');

// We need this to load the inventory file
var fs = require('fs-extra');

// Keep track of the root directory of our module,
var rootDir = path.resolve(__dirname);

// Keep track of the current directory
var cwdDir = path.resolve(process.cwd());

function stopWithError(error) {
  // Something went wrong at some point so we're going to stop right away,
  // print out a nice error message and signal the parent process that we
  // stopped because of an error
  process.stderr.write(`\n${out.red('Error:')}\n  ${out.red('✗')} ${out.bold(error.message)}\n\n`) && process.exit(1);
}

function loadInventory() {
  // First off, let's try to find and load the command inventory file
  var inventory = yaml.safeLoad(fs.readFileSync(path.join(cwdDir, 'slana.yml')), 'utf8');

  if (!inventory) {
    // Add an extra sanity check
    throw new Error('Looks like your Slana file is invalid.');
  }

  if (!inventory.name) {
    // Make sure we have a name defined
    throw new Error('Looks like your Slana file is missing the name of your command line tool');
  }

  if (!inventory.commands || inventory.commands.count === 0) {
    // Make sure we have one or more commands
    throw new Error('Looks like your Slana file does not specify any commands');
  }

  // This should be a valid inventory
  return inventory;
}

function initializeCLI(inventory) {
  // Load the package manifest to look through it for information
  var pkg = require(path.join(cwdDir, 'package.json'));

  // This is a generic usage header that will prefix the help message
  var usage = "<command> [options]";

  // Let's tell yargs what we're looking for based on our inventory
  return yargs

          // Prepare a nicely-formatted usage message
         .usage(`${out.green('Usage:')}\n ${out.green(inventory.name)} ${out.green(usage)}`)

         // Define the help (usage) option (-h)
         .help('help')

         // Make sure the usage message prints out in a compact format
         .wrap(null)

         // Insert the version from the package manifest, at the end of the usage message
         .version(pkg.version)
         .epilog(`${out.gray('v')}${out.gray(pkg.version)}`);
}

function executeCommand(inventory, cli) {

  // Keep track of all command executors
  var executors = {};

  // This is the fun part; we're going to look through our inventory, command by command,
  // and tell yargs what commands to look for, along with each command's options, if any
  inventory.commands.forEach(command => {

    if (!command.name) {
      // We don't let commands without a name go through
      throw new Error('Make sure each command in your command inventory has a name');
    }

    // Look for the command's properties, including options, if any
    var cmd = parseCommand(command, cli);

    // The command is ready to be added to the parser
    cli.command(cmd.name, cmd.description, cmd.options);

    // Keep track of this command's executor
    executors[cmd.name] = cmd.executor;
  });

  // We've got ourselves a command line now, so let's extract the command
  var command = extractCommand(cli, inventory);

  if (!command) {
    // The command was not extracted successfully
    throw new Error(`Sorry, the command could not be proccessed. Please try again.`);
  }

  if (!executors[command.name]) {
    // The command was not extracted successfully
    throw new Error(`Make sure the ${out.green(command.name)} command has a valid command executor`);
  }

  // And finally, let's execute it
  runCommandExecutor(command, executors[command.name])
}

function runCommandExecutor(command, executor) {
  // Get ready to execute the command
  process.stdout.write(`${out.green('➜ Executing command')} ${out.bold(command.name)} ${out.green('...')}\n\n`)

  // Let's attempt to execute the command now
  executor(command);

  // The command finished successfully
  process.stdout.write(`\n${out.green('➜ Finished executing command')} ${out.bold(command.name)}\n`)
}

function parseCommand (command, cli) {
  if (!command.executor) {
    // We need a command executor, otherwise, there's nothing to execute
    throw new Error(`Make sure the ${out.green(command.name)} command has a valid command executor`);
  }

  // We will parse the command into this temporary structure and we start off
  // with the values from the inventory
  var cmd = {name: command.name, description: command.description, options: {}};

  try {
    // Attempt to resolve the executor
    cmd.executor = require(path.join(cwdDir, command.executor));

    if (typeof cmd.executor != 'function') {
      // We need an executor function, not something else (ie. an object)
      throw new Error();
    }
  } catch (e) {
    // Looks like the executor could not be resolved
    throw new Error(`Make sure the ${out.green(command.name)} command has a valid command executor`);
  }

  if (!command.options || command.options.length === 0) {
    // Not all commands have options
    return cmd;
  }

  // Looks like this command has options, so let's parse them
  Object.assign(cmd.options, parseCommandOptions(command, cli));

  Object.keys(cmd.options).forEach(optionKey => {
    // Include the options in the command help message
    cmd.description = "[--" + optionKey + ", -" + cmd.options[optionKey].alias + "] " + cmd.description;
  });

  // We've got ourselves a parsed command, ready for processing
  return cmd;
}

function parseCommandOptions(command, cli) {
  var options = {};

  command.options.forEach(option => {
    if (option.name) {
      options[option.name] = {};
      options[option.name]["alias"]    = option.alias;
      options[option.name]["describe"] = option.description;
      options[option.name]["default"]  = option.default;
      options[option.name]["type"]     = option.type;

      cli.option(option.name, {
        alias: option.alias,
        default: option.default,
        describe: option.description,
        type: option.type
      });
    }
  });

  return options;
}

function extractCommand(cli, inventory) {
  // Actually do the hard work and parse the command line
  cli = cli.argv;

  if (cli._.length === 0) {
    // Looks like we did not specify a command so let's
    // just bail out with the usage message
    yargs.showHelp();
    process.exit(1);
  }

  // We have successfully parsed the command line, so now let's construct a command;
  // first keep track of the command type and we assume no options to start with
  var command = {name: cli._[0], options: {}};

  // We want to make sure that the command we've just parsed is one we support,
  // so to do that we're going to look through our inventory and see if we can find it
  var unknown = true;
  inventory.commands.forEach(cmd => cmd.name === command.name ? unknown = false : null);

  if (unknown) {
    // If this command is one we don't support, let's just stop now with a nice
    // error message, but with the usage as well
    yargs.showHelp();
    throw new Error(`Sorry, the ${out.red.bold(command.name)} command is not supported.`);
  }

  // We've now got ourselves a parsed command that we support so let's prepare it
  // for execution
  inventory.commands.forEach(cmd => { cmd.name === command.name && cmd.options &&

    // so first, let's fill the command with all its expected options
    cmd.options.forEach(option => command.options[option.name] = cli[option.name])});

  // This command should now be ready for further manipulation
  return command;
}

function run () {
  try {

    // We want to start off by investigating the inventory
    var inventory = loadInventory();

    // We start off by initializing from the inventory
    var cli = initializeCLI(inventory);

    // If the inventory is fine, we're going to execute the command
    executeCommand(inventory, cli);
  } catch (error) {
    stopWithError(error);
  }
}

var slana = {
  run: function() {
    return run();
  }
}

module.exports = slana;
