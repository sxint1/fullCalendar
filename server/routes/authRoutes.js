const Router = require('express')
const router = new Router()
const controller = require('../controllers/authController')
const { check } = require('express-validator')

router.post('/registration', [
    check('email', 'Некорректный формат ввода').isEmail(),
    controller.registration])
router.post('/login', controller.login)
router.post('/googleauth', controller.googleAuth)

module.exports = router