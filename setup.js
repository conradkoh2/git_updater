//This file changes the working directory in the event that the process is not launched from the exact path that the binary is stored in
let path = require('path');
let execPath = process.execPath;
let binary_name = path.basename(execPath);
let ext_name = path.extname(execPath);
if (ext_name) {
    let ext_idx = binary_name.indexOf(ext_name);
    binary_name = binary_name.substr(0, ext_idx);
}
if (binary_name == 'node') { //if launched from system, change working directory to folder containing entry point
    process.chdir(__dirname);
} else {
    process.chdir(path.dirname(execPath)); //we assume this implies the program was packaged into an executable, so change folder to folder containing executable
}