var savor = require("savor");
var main  = savor.src("main");

savor.add("should load a valid package", (context, done) => {
  // Use a mock inventory
  var inventory = {name: "greeter"};

  // Add a package file
  savor.addAsset("assets/valid-package.json", "package.json", context);

  // Attempt to load it
  main.initializeCLI(inventory, context.dir);
  done();
}).

run("Package Loading");
