class ActionReport {
    constructor(action, identifier, branch, url, localpath, errors) {
        this.action = action;
        this.identifier = identifier;
        this.branch = branch;
        this.url = url;
        this.localpath = localpath;
        this.errors = errors;
    }

    json() {
        return JSON.stringify(this);
    }
}

module.exports = ActionReport;