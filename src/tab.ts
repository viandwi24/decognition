import { IParamsRenderHtml } from "./decognition.ts";

export interface withCustomTab {
    getTab(): Tab;
}

export interface ITab {
    key: string;
    text: string;
    render: Function;
}

export class Tab {
    private tabs: Array<ITab> = [];

    /**
     * createnew tab
     * @param  {string} key
     * @param  {string} text
     * @param  {Function} render
     */
    public create(key: string, text: string, render: Function) {
        this.tabs.push({ key, text, render } as ITab);
        return this;
    }

    
    /**
     * Get all tab
     * @returns Array
     */
    public get(): Array<ITab> {
        return this.tabs;
    }

    public renderHeader(): string {
        let result: string = "";
        for (let i in this.tabs) {
            let item: ITab = this.tabs[i];
            result += `
            <a href="#" data-tab="tab-${item.key}" class="flex py-2 px-4 mx-1 text-gray-300 hover:bg-indigo-600">
                ${item.text}
            </a>`;
        }
        return result;
    }

    public async renderContent(params: IParamsRenderHtml): Promise<string> {
        let result: string = "";
        for (let i in this.tabs) {
            let item: ITab = this.tabs[i];
            let content = await (item.render(params));
            result += `
            <div class="tab-item h-full" id="tab-${item.key}">
                ${content}
            </div>`;
        }
        return result;
    }
}