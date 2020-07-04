import { Decognition } from "../mod.ts";

try {
    const a = await require(`${Deno.cwd()}/tes.ts`);
} catch (error) {
    throw new Decognition(error).render();
}

async function require(path: string)
{
    return await import(path);
}