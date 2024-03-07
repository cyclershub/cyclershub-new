import { load } from "cheerio";
import puppeteer from "puppeteer";
import * as fs from "fs"

const idUser = process.argv[2];

if (!idUser) {
	console.log("Usage: bun copy-from-ws.ts <idUser>");
	process.exit(1);
}

const browser = await puppeteer.launch( {headless: false});

const page = await browser.newPage();

// We need to log in to view profile pages.

await page.goto("https://www.warmshowers.org/user/login")

await page.type("#edit-name", process.env.WS_EMAIL);
await page.type("#edit-pass", process.env.WS_PASSWORD);
await page.click("#edit-submit");

// Get the page we actually want

await page.goto(`https://www.warmshowers.org/user/${idUser}`);

const html = await page.content();

await browser.close();

// Continue with cheerio since that is faster

const $ = load(html);

const name = $(".field--name-field-display-name").eq(0).text();
const biography = $(".field--name-field-about-me .field__item").text();

const address = $(".views-field-field-address-address-line1 .address-details").text()
const city = $(".views-field-field-address-locality .address-details").text();
const state = $(".views-field-field-address-administrative-area .address-details").text();
const country = $(".views-field-field-address-country-code .address-details").text();

const facility_bike_maintenance = $(".field--name-field-bike-maintenance") ? true : false;
const facility_kitchen = $(".field--name-field-kitchen") ? true : false;
const facility_secure_storage = $(".field--name-field-secure-storage") ? true : false;
const facility_laundry = $(".field--name-field-washing-machine") ? true : false;
const facility_shower = $(".field--name-field-shower") ? true : false;
const facility_wifi = $(".field--name-field-wifi") ? true : false;
const facility_meals = $(".field--name-field-cakes") ? true : false;
const facility_private_room = $(".field--name-field-coffee") ? true : false;

const sleeping_bed = $(".field--name-field-bedrooms") ? true : false;
const sleeping_couch = $(".field--name-field-couchs") ? true : false;
const sleeping_camping = $(".field--name-field-camping") ? true : false;

const spaceAndFacilities = $(".field--name-field-my-space-and-facilities .field__item").text();

const profilePicture = $(".field--name-user-picture img").attr("src");

const profilePictureResponse = await fetch(profilePicture);

const profilePictureBuffer = await profilePictureResponse.arrayBuffer();

// Save the profile picture

fs.writeFileSync(`./persistent/images/${idUser}.jpg`, Buffer.from(profilePictureBuffer));

console.log(name, biography, address, city, state, country, facility_bike_maintenance, facility_kitchen, facility_secure_storage, facility_laundry, facility_shower, facility_wifi, facility_meals, facility_private_room, sleeping_bed, sleeping_couch, sleeping_camping, spaceAndFacilities);


export {}