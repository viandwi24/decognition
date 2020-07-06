export interface ProvidesSolution {
    getSolution(): Solution;    
}

export interface IDocumentation {
    text: string;
    link: string;
}

export class Solution {
    private title: string= "";
    private description: string = "";
    private documentation: Record<string,string> = {};

    /**
     * Set title
     * @param  {string} title
     * @returns this
     */
    public setTitle(title: string): this {
        this.title = title;
        return this;
    }

    /**
     * Set description
     * @param  {string} description
     * @returns this
     */
    public setDescription(description: string): this {
        this.description = description;
        return this;
    }

    /**
     * Set documentation
     * @param  {Record<string,string>} documentation
     * @returns this
     */
    public setDocumentation(documentation: Record<string,string>): this {
        this.documentation = documentation;
        return this;
    }

    /**
     * Get title
     * @returns string
     */
    public getTitle(): string {
        return this.title;
    }
    
    /**
     * Get description
     * @returns string
     */
    public getDescription(): string {
        return this.description;
    }
    
    /**
     * Get documentation
     * @returns string
     */
    public getDocumentation(): Array<IDocumentation> {
        let docs = this.documentation;
        let res = [];
        for(let i in docs as Object) {
            if (docs.hasOwnProperty(i)) {
                res.push({ text: i, link: docs[i]});
            }
        }
        return res;
    }
}