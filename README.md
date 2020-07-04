# Decognition
a Pretty Exception Handler for TypeScript Deno. Inspirated from Laravel & Flare Ignition.  
*This library is still under development.* Please wait and send your help!.

![screenshot preview](https://raw.githubusercontent.com/viandwi24/decognition/master/screenshot/ss1.png)
![screenshot preview](https://raw.githubusercontent.com/viandwi24/decognition/master/screenshot/ss2.png)

## Features
* Pretty Exception on console
* Support Exception Render to HTML
* Make Custom Exception

## To Do list
- [x] Pretty Console Output
- [x] Pretty HTML Output
- [ ] Custom Handler
- [ ] Solution
- [ ] Runnable Solution
- [ ] Logging

## How Work
Import Decongnition :
```
import { Decognition } from "https://raw.githubusercontent.com/viandwi24/decognition/master/mod.ts";
```
Try-catch :
```
try {
    //
} catch (error) {
    throw new Decognition(error).render();
}
```
Render :
```
console.log(
    new Decognition("undefined variable a").render();
);
```
Render to HTML :
```
let exeption = new Decognition("undefined variable a");
console.log(await exeption.renderHtml());
```
Make Custom Exception :
```
export class NotFoundException extends Decognition {
    constructor(error: string) {
        super(error);
        this.message = "[NotFound] " + this.message;
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