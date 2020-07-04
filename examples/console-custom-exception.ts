import { NotFoundException } from "./custom-exception.ts";
import { BError } from "https://deno.land/x/berror/berror.ts";
import { Decognition } from "../mod.ts";

throw new Decognition("Your name must 3 word.", { name: "Alfian Dwi" }).render();