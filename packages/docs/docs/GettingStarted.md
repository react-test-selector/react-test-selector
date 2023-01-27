---
sidebar_position: 1
---

# Быстрый старт

## Основа

Основу библиотеки составляет функция [`rts.querySelector`](/docs/ApiReference/QuerySelector), которая является аналогом `window.querySelector()`,
но позволяет искать React-компоненты. Добавить фукнцию можно путём выполнения скрипта react-test-selector.js в брауере. Если вы используете npm, то можно
установить пакет [react-test-selector](https://www.npmjs.com/package/react-test-selector):

```
npm install --save-dev react-test-selector
```

или просто добавить файл в проект, скачав его со страницы релиза:

[github.com/react-test-selector/react-test-selector/releases](https://github.com/react-test-selector/react-test-selector/releases)

## Пример подключения С# + Selenium

Рассмотрим вариант тестов на языке С# с использованием Selenium для усправления браузером. Примеры на других языках можно [найти в документации](/docs/Examples/Examples).

Добавим файл `react-test-selector.js` в проект со [страницы релиза](https://github.com/react-test-selector/react-test-selector/releases).

Напишем тест с примером использования. Приложение, которое тестируется:
[react-test-selector.github.io/example-application-for-docs/](https://react-test-selector.github.io/example-application-for-docs/)
состоит из двух полей ввода и текста.

Чтобы добавить функцию в браузер, выполним скрипт сразу после загрузки станицы:
```cs
driver.ExecuteScript(
    await File.ReadAllTextAsync(@"<path-to-script>\react-test-selector.js")
);
```

И воспользуемся результатами. Чтобы найти поле ввода:
```cs
var inputNode = driver.ExecuteScript(
    "return rts.querySelector('Input').at(0).getDomElement()"
) as WebElement;
```

и текст:

```cs
var textNode = driver.ExecuteScript(
    "return rts.querySelector('InputValueContent').at(0).getDomElement()"
) as WebElement;

```

Полный текст теста:

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
		using var driver = new RemoteWebDriver(
		    new Uri("http://127.0.0.1:4444/wd/hub"), new ChromeOptions()
		);
		driver.Navigate()
			.GoToUrl("https://react-test-selector.github.io/example-application-for-docs/");
		driver.ExecuteScript(
			await File.ReadAllTextAsync(@"<path-to-script>\react-test-selector.js")
		);
		var inputNode = driver.ExecuteScript(
			"return rts.querySelector('Input').at(0).getDomElement()"
		) as WebElement;
		inputNode.SendKeys("Text");

		var textNode = driver.ExecuteScript(
			"return rts.querySelector('InputValueContent').at(0).getDomElement()"
		) as WebElement;
		var text = textNode.GetDomProperty("textContent");
		Assert.AreEqual(text, "Input value: Text");
	}
}
```


