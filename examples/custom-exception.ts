import { Decognition } from "../mod.ts";
export class NotFoundException extends Decognition {
    constructor(error: string, vars: object) {
        super(error, vars);
        this.message = "[NotFound] " + this.message;
    }
}