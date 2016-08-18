var main = require('./src/main');

function run (dir) {
  try {

    // We want to start off by investigating the inventory
    var inventory = main.loadInventory(dir);

    // We start off by initializing from the inventory
    var cli = main.initializeCLI(inventory, dir);

    // If the inventory is fine, we're going to execute the command
    main.executeCommand(inventory, cli, dir);
  } catch (error) {
    main.stopWithError(error);
  }
}


module.exports = {
  stopWithError: function(error) { return main.stopWithError(error); },
  loadInventory: function(dir) { return main.loadInventory(dir); },
  initializeCLI: function(inventory, dir) { return main.initializeCLI(inventory, dir) },
  executeCommand: function(inventory, cli, dir) { return main.executeCommand(inventory, cli, dir) },
  parseCommand: function(command, cli, dir) { return main.parseCommand(command, cli, dir) },
  extractCommand: function(cli, inventory, dir) { return main.extractCommand(cli, inventory, dir) },
  run: function(dir) { return run(dir) }
};
