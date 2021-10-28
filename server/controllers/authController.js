const User = require('../models/User')
const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const { secret } = require('../config')
const { OAuth2Client } = require('google-auth-library')

const client = new OAuth2Client('647404905515-cor9dhjn50b0p4emrjqu8su48tle37np.apps.googleusercontent.com')

const generateAccessToken = (id) => {
    const payload = {
        id
    }
    return jwt.sign(payload, secret, { expiresIn: '24h' })
}

class authController {
    async registration(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: 'Ошибка при регистрации', errors })
            }
            const { email, password } = req.body
            const candidate = await User.findOne({ email })
            if (candidate) {
                return res.status(400).json({ message: 'Пользователь с таким именем уже существует' })
            }
            const hashPassword = bcrypt.hashSync(password, 7)
            const user = new User({ email, password: hashPassword })
            await user.save()
            return res.json({ message: 'User created successfuly!' })
        } catch (e) {
            console.log(e)
            res.status(400).json({ message: 'Registration error' })
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body
            const user = await User.findOne({ email })
            if (!user) {
                return res.status(400).json({ message: `Пользователь ${email} не найден` })
            }
            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) {
                return res.status(400).json({ message: 'Введен неверный пароль' })
            }
            const token = generateAccessToken(user._id, user.roles)
            res.json({ token, userId: user.id })
        } catch (e) {
            console.log(e)
            res.status(400).json({ message: 'Login error' })
        }
    }

    async googleAuth(req, res) {
        const { tokenId } = req.body
        const response = await client.verifyIdToken({ idToken: tokenId, audience: '647404905515-cor9dhjn50b0p4emrjqu8su48tle37np.apps.googleusercontent.com' })
        const { email_verified, email } = response.payload

        if (email_verified) {
            const user = await User.findOne({ email: email })
            if (user) {
                const token = generateAccessToken(user._id)
                res.json({
                    token,
                    _id: user._id,
                    email: user.email
                })
            } else {
                const newUserPassword = email + Date.now()
                const hashPassword = bcrypt.hashSync(newUserPassword, 7)
                let user = new User({ email, password: hashPassword })
                await user.save()

                user = await User.findOne({ email: email })
                const token = generateAccessToken(user._id)
                res.json({
                    token,
                    _id: user._id,
                    email: user.email
                })
            }
        }
    }
}

module.exports = new authController()