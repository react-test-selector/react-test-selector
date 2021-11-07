---
sidebar_position: 1
---

# IQuerySelectorResult

```
interface IQuerySelectorResult {
    getDomElements(): Array<Element | undefined>;
    getDomElement(): Element | undefined;
    querySelector(selectorString: string): IQuerySelectorResult;
    hasNodes(): boolean;
    at(index: number): IQuerySelectorResult;
    getProps(): Record<string, unknown>;
}
```

Интерфейс представляет результат поиска React-компонентов функцией [`querySelector`](/docs/ApiReference/QuerySelector).
По сути внутри находится итератор по React-компонентам. Каждый раз при обращении к функциям результата поиск выполняется заново.

## getDomElements
```
getDomElements(): Array<Element | undefined>;
```
Возварщает массив dom-элементов, которые соответствуют каждому найденному React-компоненту. Если React-окомпонент соответствует нескольким dom-элементам, вернётся первый.

## getDomElement
```
getDomElement(): Element | undefined;
```
Возварщает dom-элемент, который соответствует найденному React-компоненту, если в результатах один элемент.
Если React-компонент соответствует нескольким dom-элементам, вернётся первый.
Если найдено несколько React-компонентов, то фукнция выбрасывает исключение.

## querySelector
```
querySelector(selectorString: string): IQuerySelectorResult;
```
Запускает поиск внутри каждого из найденных элементов.

## hasNodes
```
hasNodes(): boolean;
```
Возвращает true, если найден хотя бы один React-компонент.

## at
```
at(index: number): IQuerySelectorResult;
```
Возвращает новый QuerySelectorResult, в котором будет один элемент из списка найденных на позиции index.
Новый результат содержит ссылку на текущий и при каждом обращении запускает поиск.


## getProps
```
getProps(): Record<string, unknown>;
```
Возварщает объект с props-ами найденного компонента, если в результатах один элемент.
Если найдено несколько React-компонентов, то фукнция выбрасывает исключение.
