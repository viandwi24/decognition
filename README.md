# Decognition
a Pretty Exception Handler for TypeScript Deno. Inspirated from Laravel & Flare Ignition.  
*This library is still under development.* Please wait and send your help!.
| v0.2

![screenshot preview](https://raw.githubusercontent.com/viandwi24/decognition/master/screenshot/ss.png)
![screenshot preview](https://raw.githubusercontent.com/viandwi24/decognition/master/screenshot/ss2.png)

## Features
* Pretty Exception on console
* Support Exception Render to HTML
* Make Custom Exception
* Exception with dump a data

## To Do list
- [x] Pretty Console Output
- [x] Pretty HTML Output
- [x] Custom Handler
- [x] Solution
- [x] Custom Tab
- [ ] Runnable Solution
- [ ] Logging


## Use Decognition
### Decognition Library
```
import { Decognition } from "https://deno.land/x/decognition/mod.ts";
```
### with Console
```
console.log( new Decognition("a error message").render() );
```
### Throw
```
throw new Decognition("a error message").render();
```
### Try - Catch
```
try {
    // throw error
    throw "error";

    // or script another error
    ...
} catch (error) {
    throw new Decognition(error).render();
}
```
### Html Render
```
let e = new Decognition("a error message");
let html = await e.renderHtml();
return html;
```
### Dump Variable
```
let e = new Decognition("Your user data not valid.", { name: "Alfian", age: 17 });
```
### Custom Exception
```
class MyException extends Decognition  {
    constructor(error: string, vars: Record<string,unknown>) {
        super(error, vars);
        this.name = "My Exception";
    }
}
```
### Make Solution
```
import {
    Decognition, 
    Solution, ProvidesSolution, 
} "https://deno.land/x/decognition/mod.ts";

class MyException
    extends Decognition 
    implements ProvidesSolution {

    constructor(error: string, vars: Record<string,unknown>) {
        super(error, vars);
    }
    
    public getSolution(): Solution {
        return (new Solution)
            .setTitle("My Solution Title")
            .setDescription("this is my solution description.")
            .setDocumentation({
                "My Docs": "http://google.com",
                "My Docs 2": "http://google.com",
            });
    }
}
```
### Html Custom Tab
```
import {
    Decognition,
    Tab, withCustomTab, 
    IParamsRenderHtml,
} "https://deno.land/x/decognition/mod.ts";

class MyException
    extends Decognition 
    implements withCustomTab {

    constructor(error: string, vars: Record<string,unknown>) {
        super(error, vars);
    }

    public getTab(): Tab {
        return (new Tab)
            .create("mycustomtab", "My Custom Tab", async function (params: IParamsRenderHtml) {
                return `<h2 class="font-bold text-2xl">Content Custom Tab!</h2>`;
            });
    }
}
```


## Example
### with Oak Framework
```
import { Application, Router, isHttpError, Status } from "https://deno.land/x/oak/mod.ts";

// instance
const router = new Router();
const app = new Application();

// simple route
router.get("/", async (context) => {
    throw new Error("undefined variable a");
});
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        if (isHttpError(err)) {
            if (err.status == Status.NotFound) {
                ctx.throw(404, "Route Not Found.");
            }  else {
                ctx.throw(500, `${err.status}`);
            }
        } else {
            let decognition: Decognition = new Decognition(err);
            
            // output to console
            console.log( decognition.render() );

            // output to html
            ctx.response.body = await decognition.renderHtml({
                url: "http://localhost:8000"
            });
        }
    }
});
app.use(router.routes());
app.use(router.allowedMethods());


// listen
await app.listen({ port: 8000 });
```

## License
The MIT License (MIT). Please see
<a href="https://github.com/viandwi24/decognition/blob/master/LICENSE.md">License File</a>
for more information.