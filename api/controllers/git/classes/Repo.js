let Git = require('simple-git');
let ActionReport = require('./ActionReport');
let FetchReport = require('./FetchReport');
let StateReport = require('./StateReport');

let STATUS = {};
STATUS.SUCCESS = "success";
STATUS.FAILED = "failed";

const REMOTE_NAME = 'origin';
const REMOTE_BRANCH_PREFIX = 'remotes/origin/';

class Repo {
    constructor(config, params) {
        this.identifier = params.identifier;
        this.url = params.url;
        this.localpath = params.path;

        this.caches = {};

        let self = this;

        this.syncRemote().then(
            () => {
                console.log(`Synchronizing: ${self.identifier} : ${self.url}`)
            }
        ).then(
            () => {
                setInterval(async () => {
                    console.log(`Fetching: ${self.identifier} : ${self.url}`);
                    await self.fetch();
                }, 5000);
            }
        ).catch(err => {
            console.log(err);
        })
    }

    syncRemote() {
        let self = this;
        return new Promise((resolve, reject) => {
            Git(self.localpath).remote([
                "set-url",
                "origin",
                self.url
            ], function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            })
        })
    }

    async getCurrentBranch() {
        let self = this;
        return new Promise((resolve, reject) => {
            Git(self.localpath).branch([
                "-v",
            ], function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data.current);
                }
            })
        })
    }

    pull() {
        let self = this;
        return new Promise((resolve, reject) => {
            self.getCurrentBranch().then(
                (branchname) => {
                    let errors = [];
                    Git(self.localpath).pull(REMOTE_NAME, branchname, [], function (err, data) {
                        errors.push(err);
                        let report = new ActionReport('pull', self.indentifier, branchname, self.url, self.localpath, errors);
                        resolve(report);
                    });
                }
            )
        })
    }

    async fetch() {
        let self = this;
        return new Promise((resolve, reject) => {
            let errors = [];
            let branchname = "";
            Git(self.localpath).fetch(REMOTE_NAME, "", function (err, data) {
                self.getCurrentBranch().then(
                    (branch) => {
                        if (err) {
                            errors.push(err);
                        }
                        branchname = branch;
                        return branch;
                    }
                ).then(
                    (branch) => {
                        self.getAllBranches().then(
                            (branches) => {

                                let report = new FetchReport('fetch', self.identifier, branchname, self.url, self.localpath,
                                    branches, errors);
                            }
                        );
                    }
                )
            })
        })
    }

    getAllBranches() {
        let self = this;
        return new Promise((resolve, reject) => {
            Git(self.localpath).branch([
                "-a",
                "-v",
                "--sort=-committerdate"
            ], function (err, data) {
                let branches = {};
                for (let branchname in data.branches) {
                    let branch_details = data.branches[branchname];
                    let shortname = branchname; //Set the branch name as the default value
                    let remote_prefix_idx = branchname.indexOf(REMOTE_BRANCH_PREFIX);
                    if (remote_prefix_idx != -1) {
                        shortname = branchname.substring(remote_prefix_idx + REMOTE_BRANCH_PREFIX.length, branchname.length);
                    }
                    branches[shortname] = branch_details;
                }
                resolve(branches);
            })
        });

    }

    checkout(item) {
        let self = this;
        return new Promise((resolve, reject) => {
            let errors = [];
            let repo = Git(self.localpath)
            repo.checkout(item, function (err, data) {
                if (err) {
                    errors.push(err);
                }
                repo.submoduleInit([], function (err, data_1) {
                    if (err) {
                        errors.push(err);
                    }
                    repo.submoduleUpdate([], function (err, data_2) {
                        if (err) {
                            errors.push(err);
                        }
                        self.getCurrentBranch().then(
                            (branchname) => {
                                let report = new ActionReport('checkout', self.identifier, branchname, self.url, self.localpath, errors);
                                resolve(report);
                            }
                        )
                    });

                });
            });
        })
    }

    async summary() {
        let self = this;
        let errors = [];
        let branches = {};
        let release_branches = {};
        let cur_branch = "";
        try {
            cur_branch = await self.getCurrentBranch();
            branches = await self.getAllBranches();
            for (var branch in branches) {
                if (branch != "" && self.isReleaseBranch(branch)) {
                    release_branches[branch] = branches[branch];
                }
            }
        } catch (err) {
            errors.push(err.message);
        }
        return new StateReport(self.identifier, self.localpath, cur_branch, self.url, release_branches, branches, errors);
    }

    isReleaseBranch(branch) {
        let prefix = "release/";
        let index = branch.indexOf(prefix);
        if (index == 0) {
            let x = 1;
        }
        return index == 0;
    }

}

module.exports = Repo;