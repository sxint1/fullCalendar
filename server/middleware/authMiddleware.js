const jwt = require('jsonwebtoken')
const {secret} = require('../config')

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next()
    }

    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            return res.status(401).json({message: 'No authorization'})
        } 
        const decodedToken = jwt.verify(token, secret)
        req.user = decodedToken
        next()
    } catch(e) {
        return res.status(401).json({message: 'No authorization'})
    }
}