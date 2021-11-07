---
sidebar_position: 14
---

# Javascript + Puppeteer

```
import { expect } from "chai";
import { readFile } from "fs";
import { promisify } from "util";
import puppeteer, { ElementHandle } from "puppeteer";

describe("RTS Demo", () => {
    it("test puppeteer", async function () {
        // Arrange
        this.timeout(100000);
        const readFileAsync = promisify(readFile);
        const browser = await puppeteer.launch({ headless: false, slowMo: 100 });
        const page = await browser.newPage();
        await page.goto("https://react-test-selector.github.io/example-application-for-docs/");
        await page.evaluate(await readFileAsync(require.resolve("react-test-selector"), "utf8"));

        // Act
        const inputNode = await page.evaluateHandle<ElementHandle>(() =>
            rts.querySelector("Input").at(0).getDomElement()
        );
        await inputNode.type("Text");

        // Assert
        const textNode = await page.evaluateHandle<ElementHandle>(() =>
            rts.querySelector("InputValueContent").at(0).getDomElement()
        );
        const text = await (await textNode.getProperty("textContent")).jsonValue();
        expect(text).to.eql("Input value: Text");

        await browser.close();
    });
});
```
