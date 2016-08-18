var savor = require("savor");
var main  = savor.src("main");

savor.add("should fail without a working directory", (context, done) => {
  context.expect(() => main.loadInventory()).to.throw(Error);
  done();
}).

add("should fail with an invalid working directory", (context, done) => {
  context.expect(() => main.loadInventory("dummy-dir")).to.throw(Error);
  done();
}).

add("should fail without a Slana file", (context, done) => {
  context.expect(() => main.loadInventory(context.dir)).to.throw(Error);
  done();
}).

add("should fail with an empty Slana file", (context, done) => {
  savor.addAsset("assets/empty-inventory.yml", "slana.yml", context);
  context.expect(() => main.loadInventory(context.dir)).to.throw(Error);
  done();
}).

add("should fail with an invalid Slana file", (context, done) => {
  savor.addAsset("assets/invalid-inventory.yml", "slana.yml", context);
  context.expect(() => main.loadInventory(context.dir)).to.throw(Error);
  done();
}).

add("should fail with a nameless Slana file", (context, done) => {
  savor.addAsset("assets/nameless-inventory.yml", "slana.yml", context);
  context.expect(() => main.loadInventory(context.dir)).to.throw(Error);
  done();
}).

add("should fail with a commandless Slana file", (context, done) => {
  savor.addAsset("assets/commandless-inventory.yml", "slana.yml", context);
  context.expect(() => main.loadInventory(context.dir)).to.throw(Error);
  done();
}).

run("Inventory Error Handling");
