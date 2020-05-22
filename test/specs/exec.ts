import savor, {
  Context, 
  Completion
} from 'savor'

import yargs from 'yargs'

import {
  extractCommand,
  Inventory,
  loadInventory,
  executeCommand,
  stopWithError,
  parseCommand
} from '../../src'


savor.add("should be able to extract a command without options", (context: Context, done: Completion) => {
  savor.addAsset("assets/exec-command-inventory.yml", "slana.yml", context);
  savor.addAsset("assets/valid-executor.js", "executor.js", context);
  savor.addAsset("assets/valid-package.json", "package.json", context);
  var inventory = loadInventory(context.dir);

  // Create a mock command line
  var cli = {argv: { _ : [ "hey" ] }, option: function() {} };

  // Let"s extract the command
  var command =  extractCommand(cli, inventory);
  context.expect(command).to.exist;
  context.expect(command.name).to.equal("hey");
  context.expect(Object.keys(command.options).length).to.equal(0);

  var cmd = parseCommand(inventory.commands[0], cli, context.dir);
  context.expect(cmd).to.exist;
  context.expect(cmd.name).to.equal("hey");

  done();
}).

add("should be able to extract a command with options", (context: Context, done: Completion) => {
  savor.addAsset("assets/exec-command-inventory.yml", "slana.yml", context);
  savor.addAsset("assets/valid-executor.js", "executor.js", context);
  savor.addAsset("assets/valid-package.json", "package.json", context);
  var inventory = loadInventory(context.dir);

  // Create a mock command line
  var cli = {argv: { _ : [ "hello" ] }};

  // Let"s extract the command
  var command =  extractCommand(cli, inventory);
  context.expect(command).to.exist;
  context.expect(command.name).to.equal("hello");
  context.expect(Object.keys(command.options).length).to.equal(3);

  done();
}).

add("should be able to parse command options", (context: Context, done: Completion) => {
  savor.addAsset("assets/exec-command-inventory.yml", "slana.yml", context);
  savor.addAsset("assets/valid-executor.js", "executor.js", context);
  savor.addAsset("assets/valid-package.json", "package.json", context);
  var inventory = loadInventory(context.dir);

  // Create a mock command line
  var cli = {argv: { _ : [ "hello" ] }, option: function() {} };

  // Let"s parse the command and its options
  var command = parseCommand(inventory.commands[1], cli, context.dir);
  context.expect(command).to.exist;
  context.expect(command.name).to.equal("hello");

  done();
}).

add("should be able to execute a command", (context: Context, done: Completion) => {
  savor.addAsset("assets/exec-command-inventory.yml", "slana.yml", context);
  savor.addAsset("assets/valid-executor.js", "executor.js", context);
  savor.addAsset("assets/valid-package.json", "package.json", context);
  var inventory = loadInventory(context.dir);

  // Create a mock command line
  var cli = {argv: { _ : [ "hello" ] }, option: function() {}, command: function () {} };

  // Let"s execute the command
  executeCommand(inventory, cli, context.dir);

  done();
}).

add("should fail without a working directory", (context: Context, done: Completion) => {
  context.expect(() => executeCommand()).to.throw(Error);
  done();
}).

add("should fail with an invalid working directory", (context: Context, done: Completion) => {
  context.expect(() => executeCommand({} as Inventory, {}, "dummy-dir")).to.throw(Error);
  done();
}).

add("should fail with an invalid inventory", (context: Context, done: Completion) => {
  context.expect(() => executeCommand({} as Inventory, {}, context.dir)).to.throw(Error);
  done();
}).

add("should fail with a commandless inventory", (context: Context, done: Completion) => {
  savor.addAsset("assets/nameless-command-inventory.yml", "slana.yml", context);
  var inventory = loadInventory(context.dir);
  context.expect(() => executeCommand(inventory, {}, context.dir)).to.throw(Error);
  done();
}).

add("should fail with a command that lacks an executor", (context: Context, done: Completion) => {
  savor.addAsset("assets/onecommand-inventory.yml", "slana.yml", context);
  var inventory = loadInventory(context.dir);
  context.expect(() => executeCommand(inventory, {}, context.dir)).to.throw(Error);
  done();
}).

add("should fail with a command that has a missing executor", (context: Context, done: Completion) => {
  savor.addAsset("assets/missingexec-command-inventory.yml", "slana.yml", context);
  var inventory = loadInventory(context.dir);
  context.expect(() => executeCommand(inventory, {}, context.dir)).to.throw(Error);
  done();
}).

add("should fail with a command that has an empty executor", (context: Context, done: Completion) => {
  savor.addAsset("assets/exec-command-inventory.yml", "slana.yml", context);
  savor.addAsset("assets/empty-executor.js", "executor.js", context);
  var inventory = loadInventory(context.dir);
  context.expect(() => executeCommand(inventory, {}, context.dir)).to.throw(Error);
  done();
}).

add("should fail with a command that has an non-function executor", (context: Context, done: Completion) => {
  savor.addAsset("assets/exec-command-inventory.yml", "slana.yml", context);
  savor.addAsset("assets/nonfunction-executor.js", "executor.js", context);
  var inventory = loadInventory(context.dir);
  context.expect(() => executeCommand(inventory, {}, context.dir)).to.throw(Error);
  done();
}).

add("should not be able to extract a unspecified command", (context: Context, done: Completion) => {
  const s1 = context.stub(yargs, "showHelp").callsFake(() => {})
  const s2 = context.stub(process, "exit").callsFake(() => {});

  // Create a mock command line
  var cli = {argv: { _ : [] }};

  // Let"s extract the command
  var command = extractCommand(cli);
  context.expect(command).to.not.exist;

  // Unstub the helpers
  s1.restore();
  s2.restore();

  done();
}).

add("should not be able to extract an unknown command", (context: Context, done: Completion) => {
  savor.addAsset("assets/exec-command-inventory.yml", "slana.yml", context);
  savor.addAsset("assets/valid-executor.js", "executor.js", context);
  savor.addAsset("assets/valid-package.json", "package.json", context);
  var inventory = loadInventory(context.dir);

  const s1 = context.stub(yargs, "showHelp").callsFake(() => {})

  // Create a mock command line
  var cli = {argv: { _ : ["oops"] }};

  // Let"s extract the command
  context.expect(() => { extractCommand(cli, inventory) }).to.throw(Error);

  // Unstub the helpers
  s1.restore();

  done();
}).

add("should not be able handle execution errors", (context: Context, done: Completion) => {
  const s1 = context.stub(process, "exit").callsFake(() => {});
  var stderr = savor.capture(process.stderr);
  stopWithError(new Error("Test error"));
  var expectedError = stderr.release();

  // Make sure the expected error was printed to the standard error stream
  context.expect(expectedError.match(/(Test error)/)).to.exist;

  // Unstub the helpers
  s1.restore();

  done();
}).

run("Execution");
