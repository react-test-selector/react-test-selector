# react-test-selector

# Быстрый старт

## Основа

Основу библиотеки составляет функуия [`rts.querySelector`](//react-test-selector.github.io//docs/ApiReference/QuerySelector), которая является аналогом `window.querySelector()`,
но искать React-компоненты. Добавить фукнцию можно путём выполнения скрипта react-test-selector.js в брауере. Если вы используете npm, то можно
установить пакет [react-test-selector](//www.npmjs.com/package/react-test-selector):

```
npm install --save-dev react-test-selector
```

или просто добавить файл в проект, скачав его со страницы релиза:

[github.com/react-test-selector/react-test-selector/releases](//github.com/react-test-selector/react-test-selector/releases)

## Пример подключения С# + Selenium

Рассмотри вариант использования на С#, используя Selenium для усправления браузером. Примеры на других языках можно [найти в документации](//react-test-selector.github.io//docs/Examples/Examples).

Добавить файл в проект со [страницы релиза](//github.com/react-test-selector/react-test-selector/releases)

Напишем тест с примером использования. Приложение, которое тестируется:
[react-test-selector.github.io/example-application-for-docs/](//react-test-selector.github.io/example-application-for-docs/)
состоит из двух полей ввода и теста.

Чтобы добавить функцию в браузер ввыполним скприпт сразу после загрузки станицы:
```
driver.ExecuteScript(
    await File.ReadAllTextAsync(@"<path-to-script>\react-test-selector.js")
);
```

И воспользуемся результатами. Чтобы найти поле ввода:
```
var inputNode = driver.ExecuteScript(
    "return rts.querySelector('Input').at(0).getDomElement()"
) as WebElement;
```

и текст:

```
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


