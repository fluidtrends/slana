var savor = require('savor');
var main  = savor.src('main');

savor.add('should be able to extract a command without options', (context, done) => {
  savor.addAsset("assets/exec-command-inventory.yml", "slana.yml", context);
  savor.addAsset("assets/valid-executor.js", "executor.js", context);
  savor.addAsset("assets/valid-package.json", "package.json", context);
  var inventory = main.loadInventory(context.dir);

  // Create a mock command line
  var cli = {argv: { _ : [ "hey" ] }, option: function() {} };

  // Let's extract the command
  var command =  main.extractCommand(cli, inventory);
  context.expect(command).to.exist;
  context.expect(command.name).to.equal("hey");
  context.expect(Object.keys(command.options).length).to.equal(0);

  var cmd = main.parseCommand(inventory.commands[0], cli, context.dir);
  context.expect(cmd).to.exist;
  context.expect(cmd.name).to.equal("hey");

  done();
}).

add('should be able to extract a command with options', (context, done) => {
  savor.addAsset("assets/exec-command-inventory.yml", "slana.yml", context);
  savor.addAsset("assets/valid-executor.js", "executor.js", context);
  savor.addAsset("assets/valid-package.json", "package.json", context);
  var inventory = main.loadInventory(context.dir);

  // Create a mock command line
  var cli = {argv: { _ : [ "hello" ] }};

  // Let's extract the command
  var command =  main.extractCommand(cli, inventory);
  context.expect(command).to.exist;
  context.expect(command.name).to.equal("hello");
  context.expect(Object.keys(command.options).length).to.equal(3);

  done();
}).

add('should be able to parse command options', (context, done) => {
  savor.addAsset("assets/exec-command-inventory.yml", "slana.yml", context);
  savor.addAsset("assets/valid-executor.js", "executor.js", context);
  savor.addAsset("assets/valid-package.json", "package.json", context);
  var inventory = main.loadInventory(context.dir);

  // Create a mock command line
  var cli = {argv: { _ : [ "hello" ] }, option: function() {} };

  // Let's parse the command and its options
  var command = main.parseCommand(inventory.commands[1], cli, context.dir);
  context.expect(command).to.exist;
  context.expect(command.name).to.equal("hello");

  done();
}).

add('should be able to execute a command', (context, done) => {
  savor.addAsset("assets/exec-command-inventory.yml", "slana.yml", context);
  savor.addAsset("assets/valid-executor.js", "executor.js", context);
  savor.addAsset("assets/valid-package.json", "package.json", context);
  var inventory = main.loadInventory(context.dir);

  // Create a mock command line
  var cli = {argv: { _ : [ "hello" ] }, option: function() {}, command: function () {} };

  // Let's execute the command
  main.executeCommand(inventory, cli, context.dir);

  done();
}).

run("Command Execution");
