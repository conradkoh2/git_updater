class ActionReport {
    constructor(action, identifier, branch, url, localpath, remote_branches, errors) {
        this.action = action;
        this.identifier = identifier;
        this.branch = branch;
        this.url = url;
        this.localpath = localpath;
        this.remote_branches = remote_branches;
        this.errors = errors;
    }

    json() {
        return JSON.stringify(this);
    }
}

module.exports = ActionReport;