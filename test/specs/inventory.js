var savor = require("savor");
var main  = savor.src("main");

savor.add("should load an inventory with a single command", (context, done) => {

  // Load the test inventory
  savor.addAsset("assets/onecommand-inventory.yml", "slana.yml", context);
  var inventory = main.loadInventory(context.dir);

  // Let"s make sure our command is fetched from the inventory
  context.expect(inventory.commands).to.exist;
  context.expect(inventory.commands.length).to.equal(1);
  context.expect(inventory.commands[0]).to.exist;
  context.expect(inventory.commands[0].name).to.equal("hello");

  // Great stuff, our inventory loader looks good
  done();
}).

add("should initialize the command line", (context, done) => {

  // Load the test inventory
  savor.addAsset("assets/onecommand-inventory.yml", "slana.yml", context);
  var inventory = main.loadInventory(context.dir);

  // Let"s make sure our command is fetched from the inventory
  context.expect(inventory.commands).to.exist;
  context.expect(inventory.commands.length).to.equal(1);
  context.expect(inventory.commands[0]).to.exist;
  context.expect(inventory.commands[0].name).to.equal("hello");

  // Great stuff, our inventory loader looks good
  done();
}).

run("Inventory Loading");
