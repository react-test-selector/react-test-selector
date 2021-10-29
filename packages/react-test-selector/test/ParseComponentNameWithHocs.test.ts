import { expect } from "chai";
import { parseComponentNameWithHocs } from "../src/Selectors/RTSQuery/ParseComponentNameWithHocs";

describe("ParseComponentNameWithHocsTest", () => {
    it("works", () => {
        expect(parseComponentNameWithHocs("Input")).to.eql({
            hocs: [],
            name: "Input",
        });
        expect(parseComponentNameWithHocs("a(Input)")).to.eql({
            hocs: ["a"],
            name: "Input",
        });
        expect(parseComponentNameWithHocs("withA(withB(Input))")).to.eql({
            hocs: ["withA", "withB"],
            name: "Input",
        });
    })
});
