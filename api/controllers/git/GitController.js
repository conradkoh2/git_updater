let RepoManager = require('./classes/RepoManager');
let configs = require('./../../../config');
class GitController {
    constructor() {
        this.repoManager = new RepoManager(configs);
        this.repoManager.loadFileSync(configs.filepath_repo);
    }
    async checkout(identifier, branch) {
        let result = await this.repoManager.checkout(identifier, branch);
        result.status = result.errors.length > 0 ? 'ERRORS' : result.status;
        return result;
    }

    async pull() {
        return await this.repoManager.pull();
    }

    async fetch() {
        return await this.repoManager.fetch();
    }

    async summary() {
        return await this.repoManager.getSummaries();
    }
}
module.exports = GitController;