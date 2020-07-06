import { NotFoundException } from "./custom-exception.ts";

try {
    const a = await require(`${Deno.cwd()}/tes.ts`);
} catch (error) {
    throw new NotFoundException(error).render();
}

async function require(path: string)
{
    return await import(path);
}