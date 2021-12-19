const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');
const fs = require('fs');

const SESSION_FILE_PATH = './session.json';
let sessionCfg;
if (fs.existsSync(SESSION_FILE_PATH)) {
    sessionCfg = require(SESSION_FILE_PATH);
}

const client = new Client({ puppeteer: { headless: true }, session: sessionCfg });

client.initialize();

client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
});

client.on('authenticated', (session) => {
    console.log('AUTHENTICATED', session);
    sessionCfg=session;
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
        if (err) {
            console.error(err);
        }
    });
});

client.on('ready', async () => {
    console.log('Client is ready!');

    // Get My Contact
    let contacts = await client.getContacts()
    mycontact = contacts.filter(con => con.isGroup == false && con.name != undefined);
    mycontact.forEach(item => {
        console.log("Name : "+item.name + " & Phone : " + item.number)
    })

    // Send Message
    setTimeout(async () => {
      console.log("Send Messsage");
      await client.sendMessage("62821453xxxx@c.us", "testing");
      console.log("Success Send Message")
      
      await client.destroy();
      console.log("Destroy Client")
    },5000);
});
