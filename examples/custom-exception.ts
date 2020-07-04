import { Decognition } from "../mod.ts";
export class NotFoundException extends Decognition {
    constructor(error: string) {
        super(error);
        this.message = "[NotFound] " + this.message;
    }
}