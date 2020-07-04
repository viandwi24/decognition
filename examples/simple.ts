import { Decognition } from "../mod.ts";

function testFunction() {
    console.log(
        new Decognition("undefined variable a").render()
    );
}

testFunction();