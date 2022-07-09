require('dotenv').config()
const Discord = require("discord.js");
const { Webhook, MessageBuilder } = require('discord-webhook-node');

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

//privado
const DISCORD_BOT_KEY = process.env.DISCORD_BOT_KEY;
const DISCORD_WEBHOOK_URL = "https://discordapp.com/api/webhooks/784087492130373643/fm56vPehNvlovFq4u2HIiXHwoXRRZxFL8w7HQyk0V-ZaI2jJFUCQOz_kGLqomXofkCPT"


const Webhook_Stockx = (title, sku, linkImg, linkStockx, linkKlekt, linkKlekt_sell) => {

    const hook = new Webhook(DISCORD_WEBHOOK_URL);


    const embed = new MessageBuilder()
        .setTitle(title)

        .setDescription("``` SKU: " + sku + " ```")

        // .addField('Descripción', "test", true)

        // .addField('Enlaces: ', `:link: ${linkStockx}\n:link: ${linkKlekt}`)
        .addField('Stockx: ', linkStockx)
        .addField('Klekt: ', linkKlekt)
        .addField('Klekt (requiere login): ', linkKlekt_sell)


        // .setURL(link)
        .setColor('#26c014 ')
        // .setImage(linkImg)
        .setThumbnail(linkImg)
        .setFooter('Stockx&Klekt scraper, by Fentos', 'https://i.ibb.co/zxtL34D/pngwing-com.png')
        .setTimestamp();

    hook.setUsername('Stockx&Klekt');
    hook.setAvatar('https://i.ibb.co/7SzvnFJ/Stockx-klekt-icon.jpg')
    hook.send(embed);

}

const Webhook_Stockx_Fail = () => {

    const hook = new Webhook(DISCORD_WEBHOOK_URL);


    const embed = new MessageBuilder()
        .setTitle("Error en la búsqueda del producto")

        .setDescription("Producto no encontrado")

        // .addField('Descripción', "test", true)

        // .addField('Enlaces: ', `:link: ${linkStockx}\n:link: ${linkKlekt}`)
        .addField('Consejos: ', '- El bot usa el buscador de Klekt como base. \n- Especifica más el nombre.\n- Añade el nombre de la silueta (p.e.: Jordan 1 High).\n- Si tienes el SKU (style-code) a mano, ¡úsalo!')

        // .setURL(link)
        .setColor('#ed0a0a ')
        // .setImage(linkImg)
        .setThumbnail("https://i.ibb.co/h9rHV2c/ndice.png")
        .setFooter('Stockx&Klekt scraper, by Fentos', 'https://i.ibb.co/zxtL34D/pngwing-com.png')
        .setTimestamp();

    hook.setUsername('Stockx&Klekt');
    hook.setAvatar('https://i.ibb.co/7SzvnFJ/Stockx-klekt-icon.jpg')
    hook.send(embed);

}
const Klekt_Stockx = (linkBusquedaKlekt) => {
    puppeteer.use(StealthPlugin());

    (async () => {

        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        await page.goto(linkBusquedaKlekt);

        await sleep(100)

        try {
            const enlaceItem_klekt = await page.$eval("body>div>div>div>div>div>div>div>div>div>div>div>div>div>div>div>a", el => el.href);

            console.log(" ");
            console.log("ENLACE ITEM KLEKT");
            console.log(enlaceItem_klekt);

            const linkKlekt_sell = "https://www.klekt.com/sell/add/" + enlaceItem_klekt.slice(0, -5).slice(-5) + "/"

            await page.goto(enlaceItem_klekt);

            //titulo, sku, linkImg, linkStockx, linkKlekt
            const titulo = await page.$eval("html>body>div>div>div>div>div>div>div>div>div>div>h1", el => el.innerText);

            console.log(" ");
            console.log("TITULO:");
            console.log(titulo);

            const sku = await page.$eval(".k-product-detail__basic_information .k-text-gray-50", el => el.innerText.substring(12));

            console.log(" ");
            console.log("SKU:");
            console.log(sku);

            const linkImg = await page.$eval(".k-product__image_container", el => el.getAttribute("style").split('"')[1]);

            console.log(" ");
            console.log("LINK IMG:");
            console.log(linkImg);

            const linkTest = 'https://www.google.com/search?q=stockx+' + sku

            // console.log(linkTest);
            await page.goto(linkTest);

            await sleep(100)
            const googleStockx_array = await page.$$eval('a', as => as.map(a => a.href));


            console.log(" ");
            console.log("ENLACE GOOGLE STOCKX");

            console.log(googleStockx_array[35]);
            console.log(googleStockx_array[36]);
            console.log(googleStockx_array[37]);
            console.log(" ");

            await browser.close();


            const enlaceItem_stockx = googleStockx_array.slice(35, 38).filter(el => el.startsWith("https://stockx.com/"))
            console.log(enlaceItem_stockx[0]);

            Webhook_Stockx(titulo, sku, linkImg, enlaceItem_stockx[0], enlaceItem_klekt, linkKlekt_sell)
        } catch (error) {
            Webhook_Stockx_Fail()
            console.log(error);
        }

    })();
}

const discordStockx = async () => {

    console.log("Reading discord channel");
    const client = new Discord.Client();

    const prefix = "!";

    client.on("message", function (message) {
        if (message.author.bot) return;
        if (!message.content.startsWith(prefix)) return;

        const commandBody = message.content.slice(prefix.length).trim();

        console.log(commandBody);

        //Para saber el ID de un emoji:
        //En chat de discord \:emoji
        const pepecc = client.emojis.cache.get("782930385784799242")

        message.channel.send(`Este proceso tardará unos segundos. ${pepecc}`)
        // message.reply(`aquí tienes`)

        const linkBusquedaKlekt = "https://www.klekt.com/store/pattern," + commandBody.trim().replace(/ /gi, "_") + "/page,1"
        const linkBusquedaStockx = "https://stockx.com/search?s=" + commandBody.trim().replace(/ /gi, "%20")

        Klekt_Stockx(linkBusquedaKlekt)

    });
    client.login(DISCORD_BOT_KEY);
}

discordStockx()
