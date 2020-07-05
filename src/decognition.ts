// Copyright 2020 the Decognition authors. All rights reserved. MIT license.
import { Dejs, clc } from "../deps.ts";
import { index as Template } from "./view/index.ts";

export interface IFilePreview {
    file: string;
    startLine: number;
    endLine: number;
    file_arr: Array<string>;
}

export interface IStack {
    functionName: string;
    fileName: string;
    lineNumber: number;
    columnNumber: number;
    file: string;
    preview: IFilePreview;
}

export interface IParseError {
    name: string;
    message: string;
    stack: Array<IStack>;
    line: number;
    column: number;
    file: string;
    fileName: string;
}

export interface IOptionsRenderHtml {
    url?: string;
    base_path?: string;
}

export interface IParamsRenderHtml {
    name: string;
    message: string;
    stack: Array<IStack>;
    line: number;
    column: number;
    url?: string;
    base_path?: string;
    vars?: object;
}

export class Decognition extends Error {
    private getStackCache: Array<IStack> = [];

    
    /**
     * Constructor
     * @param  {string} error error message or Error instance
     * @param  {Object={}} vars variable to dump
     */
    constructor(protected error: string, protected vars: object = {}) {
        super(error);
        this.parseError();
    }

    
    /**
     * Get message of error
     * @returns string
     */
    public getName(): string {
        return "\\" + this.name; 
    }

    
    /**
     * Get message of error
     * @returns string
     */
    public getMessage(): string {
        return this.message
            .replace(/at.*/g, "")
            .replaceAll("  ", "")
            .replaceAll("\n", "");
    }

    /**
     * Get stack trace
     * @returns Promise<Array<IStack>>
     */
    public getStack(): Array<IStack> {
        if (this.getStackCache.length > 0) return this.getStackCache;
        if (this.stack) {
            let result = this.stack.split("\n");
            result.splice(0, 1);

            let stack = [];
            for(let i in result) {
                let item = result[i];
                item = item.replace("    ", "").replace("at ", "");
                if (item == "") continue;
                let item_arr = item.split(" ");
                let files = item_arr[item_arr.length-1];
                let files_arr = files.replace("(", "")
                    .replace(")", "")
                    .split(":");

                // 
                let functionName: string,
                    fileName: string,
                    lineNumber: number, 
                    columnNumber: number,
                    file: string,
                    preview: IFilePreview = {
                        file: "", file_arr: [],
                        startLine: 0,
                        endLine: 0
                    };

                // 
                functionName = item.replace(" " + files, "");
                columnNumber = parseInt(files_arr[files_arr.length-(1)]);
                lineNumber = parseInt(files_arr[files_arr.length-(1+1)]);
                files_arr.pop(); files_arr.pop();
                fileName = files_arr.join(":");
                try {
                    // read file
                    file = this.readFile(fileName);

                    // make preview file
                    let file_arr: Array<string> = file.split("\n");
                    let line = lineNumber;
                    let digit: any = file_arr.length.toString().split("").pop();
                    let digit_number = ""; for(let i in digit) digit_number += "0";
                    let gap = 10;
                    preview.startLine = line-gap;
                    preview.endLine = line+gap;
                    for(let i in file_arr) {
                        let index = parseInt(i)+1;
                        if (line > gap-1) if (index < (line-gap-1)) continue;
                        if (index > (line+gap-1)) continue;
                        let value = file_arr[index];
                        if (typeof value == "undefined") continue;
                        let lineres = `${value}\n`;
                        preview.file += lineres;
                        preview.file_arr.push(lineres);
                    }
                } catch (error) {
                    file = "";
                    preview.file = "";
                    preview.file_arr = [""];
                    preview.startLine = 0;
                    preview.endLine = 0;
                }
                
                // 
                stack.push({
                    functionName,
                    fileName,
                    lineNumber,
                    columnNumber,
                    file,
                    preview,
                });
            }
            
            return this.getStackCache = stack;
        }
        return [];
    }

    
    /**
     * Get line
     * @returns number
     */
    public getLine(): number {
        let stack = this.getStack();
        if (stack.length > 0) return stack[0].lineNumber;
        return 0;
    }
    
    /**
     * Get column
     * @returns number
     */
    public getColumn(): number {
        let stack = this.getStack();
        if (stack.length > 0) return stack[0].columnNumber;
        return 0;
    }
    
    /**
     * Get file name
     * @returns string
     */
    public getFileName(): string {
        let stack = this.getStack();
        if (stack.length > 0) return stack[0].fileName;
        return "";
    }
    
    /**
     * Get file
     * @returns string
     */
    public getFile(): string {
        let stack = this.getStack();
        if (stack.length > 0) return stack[0].file;
        return "";
    }

    
    /**
     * Get all
     * @returns object
     */
    public getAll(): IParseError {
        return {
            name: this.getName(),
            message: this.getMessage(),
            stack: this.getStack(),
            line: this.getLine(),
            file: this.getFile(),
            fileName: this.getFileName(),
            column: this.getColumn()
        };
    }

    /**
     * Render html output
     * @param  {IOptionsRenderHtml} options?
     * @returns Promise
     */
    public async renderHtml(options?: IOptionsRenderHtml): Promise<string> {
        let params: IParamsRenderHtml = {
            ...this.getAll(),
            base_path: (options?.base_path)  ? options?.base_path : `${Deno.cwd()}`,
            url: (options?.url) ? options.url : "http://localhost",
            vars: this.vars,
        };

        // modify
        params.message = this.clearAnsiColor(params.message);
        
        return await Dejs.renderToString(Template, params);
    }

    private clearAnsiColor(val: string) {
        return val.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
    }

    /**
     * Render console output
     * @returns string
     */
    public render(): string {
        let name = this.getName().replaceAll("\\", " \\ ");
        let stack: Array<IStack> = this.getStack();
        let file: string = this.getFile();
        let result = `\n\n\t${clc.bgRed.text(name)}${clc.reset.text("")}`;

        // title
        result += `\n\n\t${this.getMessage()}`;

        // dump variable
        if (Object.keys(this.vars).length !== 0) {
            result += `\n\n\t${clc.bgGreen.text(" Dump ")}${clc.reset.text("")}`;
            result += `\n\t${this.syntaxHighlight(this.vars)}`;
        }

        // file
        result += `\n\n\tat ${clc.green.text(this.getFileName())}:${this.getLine()}${clc.reset.text("")}\n`;
        if (file != "") {
            let file_arr: Array<string> = file.split("\n");
            let line = this.getLine();
            let digit: any = file_arr.length.toString().split("").pop();
            let digit_number = ""; for(let i in digit) digit_number += "0";
            let gap = 3;
            for(let i in file_arr) {
                let index = parseInt(i)+1;
                if (line > gap-1) if (index < (line-gap-1)) continue;
                if (index > (line+gap-1)) continue;
                let value = file_arr[index];
                if (typeof value == "undefined") continue;
                let lineres = `\t `
                    + `${(index < 9 && index > 0 ? "0" : "")}`
                    + `${(index < 1000 && index > 100 ? "0" : "")}`
                    + `${(index < 10000 && index > 1000 ? "0" : "")}`
                    + `${index+1}`
                    + `|    ${value}`;

                result += (parseInt(i)+2 == this.getLine())
                    ? `${clc.bgRed.text(lineres)}${clc.reset.text("")}\n`
                    : `${lineres}\n`;
            }
        } else {
            result += `\t(cannt preview file "${this.getFileName()}".)\n`;
        }
        
        // stack trace
        result += `\n\n\t${clc.yellow.text("Stack Trace :")}${clc.reset.text("")}`;
        for(let index in stack) {
            result += `\n\n\t${parseInt(index)+1}\t${clc.yellow.text(stack[index].functionName)}${clc.reset.text("")}`;
            result += `\n\t\t` 
                + clc.green.text(`${stack[index].fileName} : ${stack[index].lineNumber}`)
                + `${clc.reset.text("")}`;
        }

        // 
        result += "\n\n";
        return result;
    }

    /**
     * parse error
     */
    protected parseError() {
        // name
        this.name = (this.constructor.name != "Decognition") ? this.constructor.name : this.name;

        // 
        let regTypeError  = new RegExp(/TypeError:/g);
        if (regTypeError.test(this.message)) {
            let regError  = new RegExp(/\[ERROR\]:/g);
            if (regError.test(this.message)) {
                let msg = this.message.split("[ERROR]"); msg.splice(1, Infinity);
                let message = this.message.replace(msg.join(), "");
                let  name = this.clearAnsiColor(msg.join().replace(": ", "\\"));
                if (this.name == "Error") {
                    this.name = name;
                    this.message = message;
                } else {
                    this.name = `${this.name}\\${name}`;
                    this.message = message;
                }
            }
        }

        // 
        let regError  = new RegExp(/\[ERROR\]:/g);
        if (regError.test(this.message)) {
            this.message = this.message.replace("[ERROR]: ", "");
        }
    }

    /**
     * readFile
     * 
     * @param {string} file 
     * @param {type} type?
     */
    protected readFile (file: string, type?: string) {
        const types = type || 'utf-8';
        return new TextDecoder(types).decode(Deno.readFileSync(file));
    }
    
    protected syntaxHighlight(json: any) {
        if (typeof json != 'string') {
             json = JSON.stringify(json, undefined, 2);
        }
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        let result = json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match: any) {
            let cls;
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                    match = `${clc.green.text(match)}${clc.reset.text("")}`;
                } else {
                    cls = 'string';
                    match = `${clc.blue.text(match)}${clc.reset.text("")}`;
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
                match = `${clc.red.text(match)}${clc.reset.text("")}`;
            } else if (/null/.test(match)) {
                cls = 'null';
                match = `${clc.white.text(match)}${clc.reset.text("")}`;
            } else {
                cls = 'number';
                match = `${clc.yellow.text(match)}${clc.reset.text("")}`;
            }
            return match;
        });

        return result.replaceAll("\n", "\n\t");
    }
}