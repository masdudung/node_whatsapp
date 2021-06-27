const { Client, MessageMedia } = require('whatsapp-web.js');
const { body, validationResult } = require('express-validator');
const { phoneNumberFormatter } = require('./helpers/formatter');

module.exports = (app, express, fileUpload, fs, qrcodeTerminal, mysql) => {
    console.log('whatsapp init')
    app.use(express.json());
    app.use(express.urlencoded({
        extended: true
    }));

    app.use(fileUpload({
        debug: true
    }));

    /** init mysql */
    let db = require('./mysql')(mysql)

    /** get token from database */
    let sessionCfg;
    sessionCfg = db.select('app_token ORDER BY id DESC')
    sessionCfg = sessionCfg.then((result)=>{
        console.log(result[0].text)
        return result[0].text
    })

    console.log(sessionCfg)
    
    /** init whatsapp client */
    const client = new Client({
        restartOnAuthFail: true,
        puppeteer: {
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                // '--single-process',
                '--disable-gpu'
            ],
        },
        session: {"WABrowserId":"\"xo3Q7gPAy+84ouBGdVNLiQ==\"","WASecretBundle":"{\"key\":\"SEZx74w547zrGy2YeTFi9LKlRxYD3vnxMMUCV3caeWg=\",\"encKey\":\"kMuid0t2ljaTaQtGBRBmOtsnbWU+RMk9P9z5MmGD6jE=\",\"macKey\":\"SEZx74w547zrGy2YeTFi9LKlRxYD3vnxMMUCV3caeWg=\"}","WAToken1":"\"icVB9EchrAAuaw/aTlpFAhiHfZqToNRBUmCEEGq8o34=\"","WAToken2":"\"1@oCA2+rYSHrflvc5+OxdAkIIrWNgIdO2s5xzQRVXPgqOTTuA+2wsCrMtPc6lEV7MvMO5gQaTXm5pArA==\""}
    });

    client.initialize();

    client.on('message', msg => {
        console.log(msg)
        if (msg.body == '!ping') {
          msg.reply('pong');
        } else if (msg.body == 'good morning') {
          msg.reply('selamat pagi');
        } else if (msg.body == '!groups') {
          client.getChats().then(chats => {
            const groups = chats.filter(chat => chat.isGroup);
      
            if (groups.length == 0) {
              msg.reply('You have no group yet.');
            } else {
              let replyMsg = '*YOUR GROUPS*\n\n';
              groups.forEach((group, i) => {
                replyMsg += `ID: ${group.id._serialized}\nName: ${group.name}\n\n`;
              });
              replyMsg += '_You can use the group id to send a message to the group._'
              msg.reply(replyMsg);
            }
          });
        }
      });
      
    client.on('qr', (qr) => {
        console.log('QR RECEIVED', qr);
        qrcodeTerminal.generate(qr, {small: true})
    });
      
    client.on('ready', () => {
        console.log('ready', 'Whatsapp is ready!');
        console.log('message', 'Whatsapp is ready!');
    });
      
    client.on('authenticated', (session) => {
        console.log('AUTHENTICATED', session);
        sessionCfg = session;
        db.insert('app_token', JSON.stringify(session))
    });
      
    client.on('auth_failure', function(session) {
        console.log('message', 'Auth failure, restarting...');
    });
      
    client.on('disconnected', (reason) => {
        fs.unlinkSync(SESSION_FILE_PATH, function(err) {
            if(err) return console.log(err);
            console.log('Session file deleted!');
        });
        client.destroy();
        client.initialize();
    });
      
    const checkRegisteredNumber = async function(number) {
        const isRegistered = await client.isRegisteredUser(number);
        return isRegistered;
    }
}