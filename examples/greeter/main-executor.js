function sayHello(name) {
  console.log("Hello " + name);
}

function sayGoodbye(name, shout) {
  var text = "Goodbye " + name;
  console.log(shout ? text.toUpperCase() : text);
}

module.exports = function(command) {
  if (command.name === 'hello') {
    sayHello(command.options.name);
  } else if (command.name === 'bye') {
    sayGoodbye(command.options.name, command.options.shout);
  }
};
