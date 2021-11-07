---
sidebar_position: 11
title: C# + Selenium
---

# C# + Selenium

Полный текст примера:

```cs
using System;
using System.IO;
using System.Threading.Tasks;
using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Remote;

public class RTSTest
{
	[Test]
	public async Task TestSelenium()
	{
        // Arrange
		using var driver = new RemoteWebDriver(
		    new Uri("http://127.0.0.1:4444/wd/hub"), new ChromeOptions()
        );
		driver.Navigate()
		    .GoToUrl("https://react-test-selector.github.io/example-application-for-docs/");
		driver.ExecuteScript(
			await File.ReadAllTextAsync(@"<path-to-script>\react-test-selector.js")
		);

        // Act
		var inputNode = driver.ExecuteScript(
			"return rts.querySelector('Input').at(0).getDomElement()"
		) as WebElement;
		inputNode.SendKeys("Text");

        // Assert
		var textNode = driver.ExecuteScript(
			"return rts.querySelector('InputValueContent').at(0).getDomElement()"
		) as WebElement;
		var text = textNode.GetDomProperty("textContent");
		Assert.AreEqual(text, "Input value: Text");
	}
}
```


