import { expect, use } from "chai";
import {
    RTSComponentHocsMatch,
    RTSElementKind,
    RTSQueryAttributeOperator,
    RTSQueryParser,
    RTSQueryPseudoSelectorType,
} from "../src/Selectors/RTSQuery/RTSQueryParser";

import chaiShallowDeepEqual from "chai-shallow-deep-equal"

use(chaiShallowDeepEqual);

describe("RTSQueryParserTest", () => {
    it("parseSimpleBaseCasesForTag", () => {
        const parser = new RTSQueryParser();
        expect(parser.parse("div")).to.shallowDeepEqual({ element: { type: RTSElementKind.Tag, name: "div" } });
        expect(parser.parse("Input")).to.shallowDeepEqual({
            element: { type: RTSElementKind.Component, name: "Input" },
        });
        expect(parser.parse("div[a=1]")).to.shallowDeepEqual({
            element: { name: "div" },
            attributes: [{ attributeName: "a", operator: RTSQueryAttributeOperator.Equals, value: "1" }],
        });
        expect(parser.parse("*[a=1]")).to.shallowDeepEqual({
            element: { type: RTSElementKind.AnyElement },
            attributes: [{ attributeName: "a", operator: RTSQueryAttributeOperator.Equals, value: "1" }],
        });
        expect(parser.parse("[a=1]")).to.shallowDeepEqual({
            element: { type: RTSElementKind.AnyElement },
            attributes: [{ attributeName: "a", operator: RTSQueryAttributeOperator.Equals, value: "1" }],
        });
        expect(parser.parse("[a=1]")).to.shallowDeepEqual({
            attributes: [{ attributeName: "a", operator: RTSQueryAttributeOperator.Equals, value: "1" }],
        });
        expect(parser.parse("[a]")).to.shallowDeepEqual({
            attributes: [{ attributeName: "a", operator: RTSQueryAttributeOperator.Exists }],
        });
    });


    it("unescapeStringValues", () => {
        const parser = new RTSQueryParser();
        expect(parser.parse("div[x=a]")).to.shallowDeepEqual({ attributes: [{ value: "a" }] });
        expect(parser.parse("div[x='a']")).to.shallowDeepEqual({ attributes: [{ value: "a" }] });
        expect(parser.parse("div[x='aaa\\'bbb']")).to.shallowDeepEqual({ attributes: [{ value: "aaa'bbb" }] });
        expect(parser.parse("div[x='aaa\\\\bbb']")).to.shallowDeepEqual({ attributes: [{ value: "aaa\\bbb" }] });
        expect(parser.parse('div[x="a"]')).to.shallowDeepEqual({ attributes: [{ value: "a" }] });
        expect(parser.parse('div[x="aaa\\"bbb"]')).to.shallowDeepEqual({ attributes: [{ value: 'aaa"bbb' }] });
        expect(parser.parse('div[x="aaa\\\\bbb"]')).to.shallowDeepEqual({ attributes: [{ value: "aaa\\bbb" }] });
        expect(parser.parse('div[x="aaa\\"\\"bbb"]')).to.shallowDeepEqual({ attributes: [{ value: 'aaa""bbb' }] });
    });


    it("parseAttributeOperators", () => {
        const parser = new RTSQueryParser();
        expect(parser.parse("[a=1]")).to.shallowDeepEqual({
            attributes: [{ attributeName: "a", operator: RTSQueryAttributeOperator.Equals, value: "1" }],
        });
        expect(parser.parse("[a~=1]")).to.shallowDeepEqual({
            attributes: [
                { attributeName: "a", operator: RTSQueryAttributeOperator.EqualsInWhitespaceSeparated, value: "1" },
            ],
        });
        expect(parser.parse("[a^=1]")).to.shallowDeepEqual({
            attributes: [{ attributeName: "a", operator: RTSQueryAttributeOperator.StartsWith, value: "1" }],
        });
        expect(parser.parse("[a$=1]")).to.shallowDeepEqual({
            attributes: [{ attributeName: "a", operator: RTSQueryAttributeOperator.EndsBy, value: "1" }],
        });
        expect(parser.parse("[a*=1]")).to.shallowDeepEqual({
            attributes: [{ attributeName: "a", operator: RTSQueryAttributeOperator.Contains, value: "1" }],
        });
        expect(parser.parse("[a]")).to.shallowDeepEqual({
            attributes: [{ attributeName: "a", operator: RTSQueryAttributeOperator.Exists }],
        });
    });


    it("parseMultipleAttributeSelectors", () => {
        const parser = new RTSQueryParser();
        expect(parser.parse("[a=1][b=2]")).to.shallowDeepEqual({
            attributes: [
                { attributeName: "a", operator: RTSQueryAttributeOperator.Equals, value: "1" },
                { attributeName: "b", operator: RTSQueryAttributeOperator.Equals, value: "2" },
            ],
        });
        expect(parser.parse("[a='aaa][bbb'][b=2]")).to.shallowDeepEqual({
            attributes: [
                { attributeName: "a", operator: RTSQueryAttributeOperator.Equals, value: "aaa][bbb" },
                { attributeName: "b", operator: RTSQueryAttributeOperator.Equals, value: "2" },
            ],
        });
        expect(parser.parse('[a="aaa][bbb"][b=2]')).to.shallowDeepEqual({
            attributes: [
                { attributeName: "a", operator: RTSQueryAttributeOperator.Equals, value: "aaa][bbb" },
                { attributeName: "b", operator: RTSQueryAttributeOperator.Equals, value: "2" },
            ],
        });
        expect(parser.parse('[a="a"][b="b"]')).to.shallowDeepEqual({
            attributes: [
                { attributeName: "a", value: "a" },
                { attributeName: "b", value: "b" },
            ],
        });
        expect(parser.parse('li[data-tid="Instance"][data-page-id="requiredMultiple"]')).to.shallowDeepEqual({
            element: { name: "li" },
            attributes: [
                { attributeName: "data-tid", operator: RTSQueryAttributeOperator.Equals, value: "Instance" },
                {
                    attributeName: "data-page-id",
                    operator: RTSQueryAttributeOperator.Equals,
                    value: "requiredMultiple",
                },
            ],
        });
    });


    it("parseComponentNameWithHocSpec", () => {
        const parser = new RTSQueryParser();
        expect(parser.parse("**(Input)")).to.shallowDeepEqual({
            element: {
                type: RTSElementKind.Component,
                name: "Input",
                hocs: { type: RTSComponentHocsMatch.AnyHocs },
            },
        });
        expect(parser.parse("**(Button)")).to.shallowDeepEqual({ element: { name: "Button" } });
        expect(parser.parse("withA(**(Button))")).to.shallowDeepEqual({
            element: { name: "Button", hocs: { type: RTSComponentHocsMatch.StartsWithHoc, name: "withA" } },
        });
        expect(parser.parse("**(withA(Button))")).to.shallowDeepEqual({
            element: { name: "Button", hocs: { type: RTSComponentHocsMatch.EndsByHoc, name: "withA" } },
        });
        expect(parser.parse("**(withA(**(Button)))")).to.shallowDeepEqual({
            element: { name: "Button", hocs: { type: RTSComponentHocsMatch.ContainsHoc, name: "withA" } },
        });
    });


    it("parseRootPseudo", () => {
        const parser = new RTSQueryParser();
        expect(parser.parse(":root")).to.shallowDeepEqual({ pseudo: { type: RTSQueryPseudoSelectorType.Root } });
    });


    it("parseRuleSet", () => {
        const parser = new RTSQueryParser();
        expect(parser.parse("Input div")).to.shallowDeepEqual({
            element: { name: "Input" },
            childRule: { element: { name: "div" } },
        });
    });
})
