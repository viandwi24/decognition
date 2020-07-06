import { Application, Router, isHttpError, Status } from "https://deno.land/x/oak/mod.ts";
import {
    Decognition, 
    Solution, ProvidesSolution, 
    Tab, withCustomTab, 
    IParamsRenderHtml,
} from "../mod.ts";

// make custom exception with solution
class MyException
    extends Decognition 
    implements ProvidesSolution, withCustomTab {

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

    public getTab(): Tab {
        return (new Tab)
            .create("mycustomtab", "My Custom Tab", async function (params: IParamsRenderHtml) {
                return `<h1>h3h3h3</h1>`;
            });
    }
}

// isntance
const router = new Router();
const app = new Application();


// simple route
router.get("/", async (ctx) => {
    let user = {
        name: "Alfian Dwi Nugraha",
        address: "Indonesian, East Java, Mojokerto, Sooko, Kedung Maling",
        age: 18
    };


    // success
    ctx.response.body = `Hello ${user.name}!`;
    ctx.response.status = 200;

    // exception
    try {
        throw "Name must be at least 10 characters.";
    } catch (err) {
        let exception = new MyException(err, user);
        
        // output to console
        console.log(exception.render());

        // output to html
        ctx.response.body = await exception.renderHtml();
        ctx.response.status = 500;
    }
});


// listenner
app.addEventListener("listen", ({ hostname, port, secure }) => {
    console.log(
        `Listening on: ${secure ? "https://" : "http://"}${hostname ?? "localhost"}:${port}`
    );
});


// middlewre
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
            ctx.response.status = 500;
        }
    }
});
app.use(router.routes());
app.use(router.allowedMethods());

// listen
await app.listen({ port: 8000 });