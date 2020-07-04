import { Application, Router, isHttpError, Status } from "https://deno.land/x/oak/mod.ts";
import { Decognition } from "../mod.ts";

// isntance
const router = new Router();
const app = new Application();


// simple route
router.get("/", async (context) => {
    const a = await require(`${Deno.cwd()}/tes.ts`);
    context.response.body = "Hello world!";
});
async function require(path: string)
{
    return await import(path);
}


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
        }
    }
});
app.use(router.routes());
app.use(router.allowedMethods());

// listen
await app.listen({ port: 8000 });