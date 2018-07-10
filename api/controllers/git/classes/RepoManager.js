let Repo = require('./Repo');
class RepoManager {
    /**
     * 
     * @param {string} publickey 
     * @param {string} privatekey 
     */
    constructor(config) {
        /**
         * @type {Object.<string, Repo>}
         * @description The list of file locations and the Repos attached
         */
        this.repos = {};
        this.config = config;
    }

    /**
     * List of objects, with key being a unique identifier. Object should have properties url and localpath
     * @param {Object.<string, string>} params 
     */
    load(params) {
        let self = this;
        let repos = {};
        for (let identifier in params) {
            let obj = params[identifier];
            //Construct the repos using the given configuration
            if (obj.url && identifier) {
                let repo = new Repo(self.config, {
                    identifier: identifier,
                    url: obj.url,
                    path: obj.path
                });
                let uniquekey = identifier;
                repos[uniquekey] = repo;
            }
        }
        this.repos = repos;
    }

    /**
     * Loads the contents of a file into the manager and construct the necessary repos
     * @param {string} path 
     */
    async loadFile(path) {
        let self = this;
        return new Promise((resolve, reject) => {
            let fs = require('fs');
            fs.readFile(path, (data) => {
                let params = JSON.parse(data);
                self.load(params); //Load the data and construct the repos
            });
        })
    }

    /**
     * Loads the contents of a file into the manager and construct the necessary repos
     * @param {string} path 
     */
    loadFileSync(path) {
        let self = this;
        let fs = require('fs');
        let data = fs.readFileSync(path);
        let params = JSON.parse(data);
        self.load(params); //Load the data and construct the repos
    }

    /**
     * Update all repos to use the given branch
     * @param {string} branch 
     */
    async checkout(identifier, branch) {
        let self = this;
        //Check parameters
        if (!identifier) {
            throw `Indentifier not specified.`;
        }
        if (!branch) {
            throw `Branch not specified`;
        }

        //Check that repos match identifier
        let repo = self.repos[identifier];
        if (!repo) {
            throw `Identifier ${identifier} not found in repos.`;
        }
        let report = await repo.checkout(branch);
        return report;
    }

    async pull() {
        let reports = [];
        let repos = this.repos;
        for (var i in repos) {
            let repo = repos[i];
            let report = await repo.pull();
            reports.push(report);
        }
    }

    async fetch() {
        let reports = [];
        let repos = this.repos;
        for (var i in repos) {
            let repo = repos[i];
            let report = await repo.fetch();
            reports.push(report);
        }
        return reports;
    }

    async getSummaries() {
        let reports = {};
        let repos = this.repos;
        for (let i in repos) {
            let repo = repos[i];
            let summary = await repo.summary();
            reports[repo.identifier] = summary;
        }
        return reports;
    }
}

module.exports = RepoManager;