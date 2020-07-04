import { NotFoundException } from "./custom-exception.ts";
import { BError } from "https://deno.land/x/berror/berror.ts";
import { Decognition } from "../mod.ts";

let params = { name: "Alfian Dwi Nugraha", active: true };
throw (new Decognition(
    "Name must be at least 10 characters.", params)
).render();