const path = require('path');

// deprecated 됨
//module.exports = path.dirname(process.mainModule.filename);
module.exports = path.dirname(require.main.filename);