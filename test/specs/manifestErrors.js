var savor = require("savor");
var main  = savor.src("main");

savor.add("should fail without a working directory", (context, done) => {
  context.expect(() => main.initializeCLI()).to.throw(Error);
  done();
}).

add("should fail with an invalid working directory", (context, done) => {
  context.expect(() => main.initializeCLI({}, "dummy-dir")).to.throw(Error);
  done();
}).

add("should fail without a package file", (context, done) => {
  context.expect(() => main.initializeCLI({}, context.dir)).to.throw(Error);
  done();
}).

add("should fail with an empty package file", (context, done) => {
  // Use a mock inventory
  var inventory = {name: "dummy"};

  // Add a package file
  savor.addAsset("assets/empty-package.json", "package.json", context);

  // Attempt to load it
  context.expect(() => main.initializeCLI(inventory, context.dir)).to.throw(Error);
  done();
}).

add("should fail without a bin package field", (context, done) => {
  // Use a mock inventory
  var inventory = {name: "dummy"};

  // Add a package file
  savor.addAsset("assets/binless-package.json", "package.json", context);

  // Attempt to load it
  context.expect(() => main.initializeCLI(inventory, context.dir)).to.throw(Error);
  done();
}).

add("should fail without defining the tool in the bin package field", (context, done) => {
  // Use a mock inventory
  var inventory = {name: "dummy"};

  // Add a package file
  savor.addAsset("assets/nameless-package.json", "package.json", context);

  // Attempt to load it
  context.expect(() => main.initializeCLI(inventory, context.dir)).to.throw(Error);
  done();
}).

run("Package Error Handling");
