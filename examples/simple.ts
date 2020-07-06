import { Decognition } from "../mod.ts";
import { BError } from "https://deno.land/x/berror/berror.ts";

const a = () => { throw Error("original error") };
const b = () => a()
const c = () => {
    try { c(); } catch (e) { throw (new Decognition("Cannt Run b", e)); }
}

try {
    c();
} catch (e) {
    let ex = new Decognition(e);
    throw ex.render();
}