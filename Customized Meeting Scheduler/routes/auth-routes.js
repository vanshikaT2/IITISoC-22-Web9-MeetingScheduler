const router = require('express').Router();
const passport = require('passport');

router.get('/login', (req, res) => {
    res.render('login')
})
router.get('/logout', (req, res) => {
    res.send('logout')
})


router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));

router.get('/google/dashboard', (req, res) => {
    res.send('call back war pohochla')
})

module.exports = router;