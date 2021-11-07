---
sidebar_position: 12
---

# Javascript + Selenium

```
import { expect } from "chai";
import { readFile } from "fs";
import { promisify } from "util";
import { Builder } from "selenium-webdriver";

describe("RTS Demo", () => {
    it("test selenium", async function () {
        // Arrange
        this.timeout(100000);
        const readFileAsync = promisify(readFile);
        const driver = await new Builder().forBrowser("chrome").usingServer(`http://127.0.0.1:4444/wd/hub`).build();
        await driver.get("https://react-test-selector.github.io/example-application-for-docs/");
        await driver.executeScript(await readFileAsync(require.resolve("react-test-selector"), "utf8"));

        // Act
        const inputNode = await driver.executeScript(
            'return rts.querySelector("Input").at(0).getDomElement()');
        await inputNode.sendKeys("Text");

        // Assert
        const textNode = await driver.executeScript(
            'return rts.querySelector("InputValueContent").at(0).getDomElement()'
        );
        const text = await textNode.getText();
        expect(text).to.eql("Input value: Text");
        await driver.close();
    });
});
```
