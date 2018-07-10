let Express = require('express');
let fs = require('fs');
let config = require('./../../config');
let router = Express.Router();
let GitController = require('./../controllers/git/GitController');
let gitController = new GitController();
router.get('/checkout', (req, res) => {
    let branch = req.query.branch;
    let identifier = req.query.identifier;
    gitController.checkout(identifier, branch).then((report) => {
        report.status = report.status ? report.status : 'DONE';
        res.send(JSON.stringify(report));
    }).catch(err => {
        res.send({
            identifier: identifier,
            errors: [err.message],
            status: err.status ? err.status : 'FAILED'
        });
    });
})

router.get('/status', (req, res) => {
    let branch = req.query.branch;
    if (branch) {
        gitController.fetch().then((reports) => {
            res.send(JSON.stringify(reports));
        })
    }
})

router.get('/summary', (req, res) => {
    gitController.summary().then((reports) => {
        res.send(JSON.stringify(reports));
    })
})

process.on('unhandledRejection', r => console.log(r));

module.exports = router;;