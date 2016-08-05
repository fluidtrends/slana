var savor = require('savor');
var main  = require('../src/main');

savor.add('should accept input', function(done, context) {
  console.log('running');
  // done && done(new Error('ddd'));
  done && done();
}).

run();
