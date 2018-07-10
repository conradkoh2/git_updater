let path = require('path');
let config = require(path.join(process.cwd(), '/config.json'));
config.filepath_repo = path.join(process.cwd(), '/repos.json');
module.exports = config;