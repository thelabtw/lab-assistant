require('core-js/es5');
var context = require.context('./src/frontend', true, /-test\.jsx?$/);

context.keys().forEach(context);
