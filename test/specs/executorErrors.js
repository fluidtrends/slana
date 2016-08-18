var savor = require("savor");
var main  = savor.src("main");

savor.add("should fail without a working directory", (context, done) => {
  context.expect(() => main.executeCommand()).to.throw(Error);
  done();
}).

add("should fail with an invalid working directory", (context, done) => {
  context.expect(() => main.executeCommand({}, {}, "dummy-dir")).to.throw(Error);
  done();
}).

add("should fail with an invalid inventory", (context, done) => {
  context.expect(() => main.executeCommand({}, {}, context.dir)).to.throw(Error);
  done();
}).

add("should fail with a commandless inventory", (context, done) => {
  savor.addAsset("assets/nameless-command-inventory.yml", "slana.yml", context);
  var inventory = main.loadInventory(context.dir);
  context.expect(() => main.executeCommand(inventory, {}, context.dir)).to.throw(Error);
  done();
}).

add("should fail with a command that lacks an executor", (context, done) => {
  savor.addAsset("assets/onecommand-inventory.yml", "slana.yml", context);
  var inventory = main.loadInventory(context.dir);
  context.expect(() => main.executeCommand(inventory, {}, context.dir)).to.throw(Error);
  done();
}).

add("should fail with a command that has a missing executor", (context, done) => {
  savor.addAsset("assets/missingexec-command-inventory.yml", "slana.yml", context);
  var inventory = main.loadInventory(context.dir);
  context.expect(() => main.executeCommand(inventory, {}, context.dir)).to.throw(Error);
  done();
}).

add("should fail with a command that has an empty executor", (context, done) => {
  savor.addAsset("assets/exec-command-inventory.yml", "slana.yml", context);
  savor.addAsset("assets/empty-executor.js", "executor.js", context);
  var inventory = main.loadInventory(context.dir);
  context.expect(() => main.executeCommand(inventory, {}, context.dir)).to.throw(Error);
  done();
}).

add("should fail with a command that has an non-function executor", (context, done) => {
  savor.addAsset("assets/exec-command-inventory.yml", "slana.yml", context);
  savor.addAsset("assets/nonfunction-executor.js", "executor.js", context);
  var inventory = main.loadInventory(context.dir);
  context.expect(() => main.executeCommand(inventory, {}, context.dir)).to.throw(Error);
  done();
}).

add("should not be able to extract a unspecified command", (context, done) => {
  var yargs = require("yargs");
  context.stub(yargs, "showHelp");
  context.stub(process, "exit");

  // Create a mock command line
  var cli = {argv: { _ : [] }};

  // Let"s extract the command
  var command = main.extractCommand(cli);
  context.expect(command).to.not.exist;

  // Unstub the helpers
  // main.exit.restore();
  process.exit.restore();
  yargs.showHelp.restore();

  done();
}).

add("should not be able to extract an unknown command", (context, done) => {
  savor.addAsset("assets/exec-command-inventory.yml", "slana.yml", context);
  savor.addAsset("assets/valid-executor.js", "executor.js", context);
  savor.addAsset("assets/valid-package.json", "package.json", context);
  var inventory = main.loadInventory(context.dir);

  var yargs = require("yargs");
  context.stub(yargs, "showHelp");

  // Create a mock command line
  var cli = {argv: { _ : ["oops"] }};

  // Let"s extract the command
  context.expect(() => { main.extractCommand(cli, inventory) }).to.throw(Error);

  // Unstub the helpers
  yargs.showHelp.restore();

  done();
}).

add("should not be able handle execution errors", (context, done) => {
  context.stub(process, "exit");
  var stderr = savor.capture(process.stderr);
  main.stopWithError(new Error("Test error"));
  var expectedError = stderr.release();

  // Make sure the expected error was printed to the standard error stream
  context.expect(expectedError.match(/(Test error)/)).to.exist;

  // Unstub the helpers
  process.exit.restore();

  done();
}).

run("Command Execution Error Handling");
