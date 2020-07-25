const drrrBot = require('./Structures/Bot');

let Bot = new drrrBot(`Bot Bot`, `bakyura`);

async function main()
{
    await Bot.siteLogin(); 
    await Bot.roomLogin('ccrAPWJCvY');  
    await Bot.roomLoop();
}

main();