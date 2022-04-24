const puppeteer = require("puppeteer");

function path(i) {
	return (
		"#mainIcons > div > div.row > div > div > section > div > div:nth-child(2) > table > tbody > tr:nth-child(" +
		i +
		") > td:nth-child(2)"
	);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function latestTitle() {
	const browser = await puppeteer.launch({
		executablePath: "X:\\Apps\\PC Apps\\Chromium\\chrome-win\\chrome.exe",
		headless: false,
	});
	const page = await browser.newPage();
	await page.goto("https://esale.ikco.ir/#!/goyaList", {
		waitUntil: "load",
	});

	var latest = "";

	for (let i = 1; i <= 20; i++) {
		try {
			const element = await page.waitForSelector(path(i));
			latest = await element.evaluate((el) => el.textContent);
			page.setDefaultTimeout(500);
		} catch (err) {
			break;
		}
	}

	page.setDefaultTimeout(30000);
	await browser.close();

	return latest;
}

const showMessage = (msg) => {
	var exec = require("child_process").exec;
	exec(`msg %username% ${msg}`);
};

async function main() {
	let latest = await latestTitle();
	const sleepHours = 6; // 6 hours

	while (true) {
		console.log(`> Sleep started ... (${sleepHours} Hours)`);
		await sleep(sleepHours * 3600 * 1000);
		console.log("> Checking ...");

		let newTitle = await latestTitle();

		if (newTitle !== latest) {
			console.log("\t> New title detected");
			showMessage(newTitle);
			latest = newTitle;
		} else {
			console.log("\t> No new title");
		}
	}
}

main();
