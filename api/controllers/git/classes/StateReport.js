class StateReport {
    constructor(identifier, path, branch, url, release_branches, remote_branches, errors) {
        this.identifier = identifier;
        this.path = path;
        this.branch = branch;
        this.url = url;
        this.release_branches = release_branches;
        this.remote_branches = remote_branches;
        this.errors = errors;
    }
}

module.exports = StateReport;