let fs = require('fs-extra');
let path = require('path');
let root = process.cwd();
let buildpath = path.join(root, 'build');

let paths = {
    'repos.json': 'repos.json',
    'config.json': 'config.json'
}
async function copyDependencies() {
    for (let base_src in paths) {
        let base_dest = paths[base_src];
        let source = path.join(root, base_src);
        let dest = path.join(buildpath, base_dest);
        await fs.copy(source, dest);
    }
}
copyDependencies().then(() => {
    console.log('Finished copying dependencies.');
}).catch((err) => {
    console.log(err);
})