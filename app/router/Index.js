let express = require('express')
let router = express.Router()

// define the home page route
router.get('/', (req, res, next) => {
    res.send({status:'ok', page:'home'})
    next()
})

module.exports = router