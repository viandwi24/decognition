import { Decognition, Solution, ProvidesSolution } from "../mod.ts";

export class NotFoundException extends Decognition implements ProvidesSolution {

    constructor(error: string) {
        super(error);
        this.message = "[NotFound] " + this.message;
    }
    
    public getSolution(): Solution {
        return (new Solution)
            .setTitle("I Have Idea!!!")
            .setDescription("this is example description for this idea.");
    }
}