import savor, {
  Context, 
  Completion
} from 'savor'

import {
  initializeCLI,
  loadInventory,
  Inventory
} from '../../src'

savor

.add("should load a valid package", (context: Context, done: Completion) => {
  // Use a mock inventory
  const inventory = { name: "greeter" } as Inventory;

  // Add a package file
  savor.addAsset("assets/valid-package.json", "package.json", context);

  // Attempt to load it
  initializeCLI(inventory, context.dir);
  done();
}).

add("should fail without a working directory", (context: Context, done: Completion) => {
  context.expect(() => initializeCLI()).to.throw(Error);
  done();
}).

add("should fail with an invalid working directory", (context: Context, done: Completion) => {
  context.expect(() => initializeCLI({} as Inventory, "dummy-dir")).to.throw(Error);
  done();
}).

add("should fail without a package file", (context: Context, done: Completion) => {
  context.expect(() => initializeCLI({} as Inventory, context.dir)).to.throw(Error);
  done();
}).

add("should fail with an empty package file", (context: Context, done: Completion) => {
  // Use a mock inventory
  var inventory = {name: "dummy"} as Inventory;

  // Add a package file
  savor.addAsset("assets/empty-package.json", "package.json", context);

  // Attempt to load it
  context.expect(() => initializeCLI(inventory, context.dir)).to.throw(Error);
  done();
}).

add("should fail without a bin package field", (context: Context, done: Completion) => {
  // Use a mock inventory
  var inventory = {name: "dummy"} as Inventory;

  // Add a package file
  savor.addAsset("assets/binless-package.json", "package.json", context);

  // Attempt to load it
  context.expect(() => initializeCLI(inventory, context.dir)).to.throw(Error);
  done();
}).

add("should fail without defining the tool in the bin package field", (context: Context, done: Completion) => {
  // Use a mock inventory
  var inventory = {name: "dummy"} as Inventory;

  // Add a package file
  savor.addAsset("assets/nameless-package.json", "package.json", context);

  // Attempt to load it
  context.expect(() => initializeCLI(inventory, context.dir)).to.throw(Error);
  done();
}).

add("should load an inventory with a single command", (context: Context, done: Completion) => {

  // Load the test inventory
  savor.addAsset("assets/onecommand-inventory.yml", "slana.yml", context);
  var inventory = loadInventory(context.dir);

  // Let"s make sure our command is fetched from the inventory
  context.expect(inventory.commands).to.exist;
  context.expect(inventory.commands.length).to.equal(1);
  context.expect(inventory.commands[0]).to.exist;
  context.expect(inventory.commands[0].name).to.equal("hello");

  // Great stuff, our inventory loader looks good
  done();
}).

add("should initialize the command line", (context: Context, done: Completion) => {

  // Load the test inventory
  savor.addAsset("assets/onecommand-inventory.yml", "slana.yml", context);
  var inventory = loadInventory(context.dir);

  // Let"s make sure our command is fetched from the inventory
  context.expect(inventory.commands).to.exist;
  context.expect(inventory.commands.length).to.equal(1);
  context.expect(inventory.commands[0]).to.exist;
  context.expect(inventory.commands[0].name).to.equal("hello");

  // Great stuff, our inventory loader looks good
  done();
}).

add("should fail without a working directory", (context: Context, done: Completion) => {
  context.expect(() => loadInventory()).to.throw(Error);
  done();
}).

add("should fail with an invalid working directory", (context: Context, done: Completion) => {
  context.expect(() => loadInventory("dummy-dir")).to.throw(Error);
  done();
}).

add("should fail without a Slana file", (context: Context, done: Completion) => {
  context.expect(() => loadInventory(context.dir)).to.throw(Error);
  done();
}).

add("should fail with an empty Slana file", (context: Context, done: Completion) => {
  savor.addAsset("assets/empty-inventory.yml", "slana.yml", context);
  context.expect(() => loadInventory(context.dir)).to.throw(Error);
  done();
}).

add("should fail with an invalid Slana file", (context: Context, done: Completion) => {
  savor.addAsset("assets/invalid-inventory.yml", "slana.yml", context);
  context.expect(() => loadInventory(context.dir)).to.throw(Error);
  done();
}).

add("should fail with a nameless Slana file", (context: Context, done: Completion) => {
  savor.addAsset("assets/nameless-inventory.yml", "slana.yml", context);
  context.expect(() => loadInventory(context.dir)).to.throw(Error);
  done();
}).

add("should fail with a commandless Slana file", (context: Context, done: Completion) => {
  savor.addAsset("assets/commandless-inventory.yml", "slana.yml", context);
  context.expect(() => loadInventory(context.dir)).to.throw(Error);
  done();
}).

run("Initializing")
