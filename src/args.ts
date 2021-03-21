import yargs, { Arguments } from "yargs";

export function getArgs(): Arguments {
    const args: Arguments = yargs(process.argv.splice(2)).help(false).argv;
    return args;
}
