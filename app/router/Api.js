let express = require('express')
let router = express.Router()

// define the home page route
router.get('/', (req, res, next) => {
    res.send({status:'ok', page:'/api'})
    next()
})

// define the about route
router.get('/users', (req, res, next) => {
    res.send({status:'ok', page:'/api/users'})
    next()
})

module.exports = router