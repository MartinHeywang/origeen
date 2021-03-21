import chalk from "chalk";
import { Table } from "console-table-printer";
import { commands } from "./commands";

export enum LogLevel {
    ERROR = 3,
    WARNING = 2,
    INFO = 1,
    DEBUG = 0,
}
const quote = chalk.magentaBright;
const important = chalk.bold;
const underline = chalk.underline;

let logLevel = LogLevel.INFO;

export function setLogLevel(level: LogLevel) {
    logLevel = level;
}

export function command(message: string): string{
    const words = message.split(" ");
    words[0] = chalk.magenta(words[0]);
    const command = `\`${chalk.cyan("ogy")} ${words.join(" ")}\``
    return command;
}

export function log(level = LogLevel.INFO, message: string) {
    if(level < logLevel) return;
    switch (level) {
        case ERROR: {
            console.error(`[${chalk.red("ERROR")}]   ${message}`);
            break;
        }
        case WARNING: {
            console.warn(`[${chalk.yellow("WARNING")}] ${message}`)
            break;
        }
        case INFO: {
            console.log(`[${chalk.blue("INFO")}]    ${message}`)
            break;
        }
        case DEBUG: {
            console.debug(`[${chalk.cyan("DEBUG")}]   ${message}`)
            break;
        }
    }
}

const { ERROR, WARNING, INFO, DEBUG } = LogLevel;

export function commandNotFound(commandName: string): void {
    log(
        ERROR,
        `${important("Usage Error:")} The given command \`${quote(
            commandName
        )}\` was not found.`
    );
    log(ERROR, "");
    usageDefault();
    tryHelpDefault();
}

export function projectNotFound(projectName: string): void {
    log(ERROR, `The given project name \`${quote(projectName)}\` was not found.`);
    log(ERROR, `Try ${command("projects")} to see your projects.`);
}

export function noCommand(): void {
    log(
        ERROR,
        `${important(
            "Usage Error:"
        )} You did not provide any command to execute.`
    );
    usageDefault();
    tryHelpDefault();
}

export function help() {
    log(INFO, `${underline("-- Help !")}`);
    log(INFO, "");
    usageDefault();

    const table = new Table({
        title: "Commands",
        columns: [
            { name: "name", alignment: "left" },
            { name: "description", alignment: "right" },
            { name: "aliases", alignment: "right" },
        ],
        disabledColumns: ["run", "usageArgs"],
    });

    table.addRows(commands);

    table.printTable();
}

function usageDefault(): void {
    log(INFO, `?? How To Use :`);
    log(INFO, "");
    log(INFO, `   $ ${command} <command> [flags]`);
    log(INFO, "");
}

export function usage(usage: string) {
    log(INFO, "?? How To Use:");
    log(INFO, "");
}

function tryHelpDefault(): void {
    log(INFO, `Try \`${command} --help\` to learn more.`);
}

export function tryHelpCommand(commandName: string) {
    log(
        INFO,
        `> Try \`${command} ${commandName} --help\` to learn more about this command.`
    );
}
