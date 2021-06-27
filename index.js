const express = require('express');
const router = express.Router();
const qrcode = require('qrcode');
const qrcodeTerminal = require('qrcode-terminal');
const http = require('http');
const fs = require('fs');
const fileUpload = require('express-fileupload');
const axios = require('axios');
const mysql = require('mysql');

/** init EXPRESS JS */
let app = express()

/** init WHATSAPP API */
let whatsapp = require('./app/modules/whatsapp/index')(app, express, fileUpload, fs, qrcodeTerminal, mysql)
whatsapp

/** init API Routers */
let appRouter = require('./framework/router/Router')
app.use('/', appRouter)


/** init SERVER LISTENER */
let appPort = 8080;
app.listen(appPort, () => {
    console.log(`Server Running at port:${appPort}`)
});