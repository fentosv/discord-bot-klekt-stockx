const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');


const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}



const busquedaStockx = () => {
    puppeteer.use(StealthPlugin());

    (async () => {

        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        // await page.setCacheEnabled(false)

        const sku = "FV3250"
        // const sku = "DC7770-160"

        // await page.goto("https://stockx.com/search?s=" + sku);


        /*
        await page.goto("https://www.google.com/")
        // await page.click("")
        await page.type("#tsf > div:nth-child(2) > div.A8SBwf > div.RNNXgb > div > div.a4bIc > input", sku + " stockx")

        await sleep(5000)*/


        await page.goto("https://www.google.com/search?q=stockx+" + sku);

        const enlaceItem_stockx = await page.$$eval('a', as => as.map(a => a.href));


        console.log(" ");
        console.log("ENLACE ITEM STOCKX");

        console.log(" ");
        console.log(enlaceItem_stockx[35]);
        console.log(enlaceItem_stockx[36]);


        await browser.close();



    })();
}



const test = () => {
    puppeteer.use(StealthPlugin());

    (async () => {

        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();

        await page.goto("https://www.klekt.com/store/pattern,FV3250/page,1");

        await sleep(500)

        const enlaceItem_klekt = await page.$eval("body>div>div>div>div>div>div>div>div>div>div>div>div>div>div>div>a", el => el.href);
        // const enlaceItem_klekt = await page.$eval('body>div>div>div>div>div>div>div>div>div>div>div>div>div>div>div>a', el => el.href);

        console.log(" ");
        console.log("ENLACE ITEM KLEKT");
        console.log(enlaceItem_klekt);

        await page.goto(enlaceItem_klekt);

        const titulo = await page.$eval("html>body>div>div>div>div>div>div>div>div>div>div>h1", el => el.innerText);

        console.log(" ");
        console.log("TITULO:");
        console.log(titulo);


        const sku = await page.$eval(".k-product-detail__basic_information .k-text-gray-50", el => el.innerText.substring(12));

        console.log(" ");
        console.log("SKU:");
        console.log(sku);




    })();
}

busquedaStockx()
// test()
