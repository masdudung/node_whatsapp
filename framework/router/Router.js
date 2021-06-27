let express = require('express')
let router = express.Router()
const glob = require('glob');

glob('./app/router/*.js', {}, (err, files)=>{
    files.forEach( file => {
        var fullpath = '../.' + String(file)
        var groupName = String(file).replace('./app/router/', '').replace(' ', '-').replace('.js', '')
        var groupName = '/' + groupName.toLowerCase()
        if(groupName=='/index'){
            groupName = '/';
        }

        appRoute = require(fullpath)
        router.use(groupName, appRoute)
    });
})

module.exports = router