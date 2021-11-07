---
sidebar_position: 13
title: C# + Puppeteer
---

# C# + Puppeteer

Полный текст примера

```
using System;
using System.IO;
using System.Threading.Tasks;
using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Chromium;
using OpenQA.Selenium.Remote;
using PuppeteerSharp;

public class RTSTest
{
	[Test]
	public async Task TestPuppeteer()
	{
        // Arrange
		var browserFetcher = new BrowserFetcher();
		await browserFetcher.DownloadAsync();
		await using var browser = await Puppeteer.LaunchAsync(new LaunchOptions { Headless = false });
		await using var page = await browser.NewPageAsync();
		await page.GoToAsync("https://react-test-selector.github.io/example-application-for-docs/");
		await page.EvaluateExpressionAsync(
			await File.ReadAllTextAsync(@"<path-to-script>\react-test-selector.js")
		);

        // Act
		var inputNode = await page.EvaluateExpressionHandleAsync(
			"rts.querySelector('Input').at(0).getDomElement()"
		) as ElementHandle;
		await inputNode.TypeAsync("Text");

        // Assert
        var textNode = await page.EvaluateExpressionHandleAsync(
			"rts.querySelector('InputValueContent').at(0).getDomElement()"
		)  as ElementHandle;
		var text = await (await textNode.GetPropertyAsync("textContent")).JsonValueAsync();
		Assert.AreEqual(text, "Input value: Text");
	}
}
```
