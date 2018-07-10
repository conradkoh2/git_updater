let path = require('path');
let Express = require('express');
let router = Express.Router();
let apirouter = require('./api/routers/main');
router.use('/api', apirouter);
router.get('/', (req, res) => {
    res.redirect('/summary.html');
})
router.use('/js', Express.static(path.join(__dirname, 'assets/js')));
router.use('/css', Express.static(path.join(__dirname, 'assets/css')));
router.use('/', Express.static(path.join(__dirname, 'assets/views')));
//Fallback
router.use('/', (req, res) => {
    res.end('Unable to get url');
})
module.exports = router;