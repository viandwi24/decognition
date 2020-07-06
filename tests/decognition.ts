import { Decognition } from "../mod.ts";
import { assertEquals, assertStringContains } from "https://deno.land/std/testing/asserts.ts";

Deno.test("message", function () {
    const exception = new Decognition("A");
    assertEquals(exception.getMessage(), "A")
});


Deno.test("dump", function () {
    const exception = new Decognition("B", { name: "Alfian Dwi" });
    assertEquals(exception.getVars(), { name: "Alfian Dwi" });
});

Deno.test("dump", function () {
    const exception = new Decognition("B", { name: "Alfian Dwi" });
    assertEquals(exception.getVars(), { name: "Alfian Dwi" });
});

Deno.test("stack", function () {
    const actual = {
        functionName: "decognition.ts:29:23",
        fileName: "decognition.ts",
        lineNumber: 29,
        columnNumber: 23,
        file: "",
        preview: { file: "", file_arr: [ "" ], startLine: 0, endLine: 0 }
    };
    const exception = new Decognition("C");
    assertEquals(actual, exception.getStack()[0]);
});

Deno.test("render", function () {
    const a = () => { throw Error("original error") };
    const b = () => a()
    const c = () => {
        try { c(); } catch (e) { throw (new Decognition("Cannt Run b")); }
    }

    try {
        c();
    } catch (e) {
        let message = new Decognition(e).getMessage();
        assertStringContains(message, "Cannt Run b");
    }
});