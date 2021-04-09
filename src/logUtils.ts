import chalk from "chalk"

import { ask as _ask } from "stdio"

export enum LogLevel {
    ERROR = "ERROR",
    WARNING = "WARNING",
    INFO = "INFO",
    DEBUG = "DEBUG",
}

let groupIndent = ""

export function setup(logLevel: LogLevel) {
    const { ERROR, WARNING, INFO } = LogLevel

    console.error = (message = "") => {
        process.stdout.write(
            `[${chalk.red("ERROR")}]   ${groupIndent}${message}\n`
        )
    }
    console.warn = (message = "") => {
        if (logLevel === ERROR) return

        process.stdout.write(
            `[${chalk.yellow("WARNING")}] ${groupIndent}${message}\n`
        )
    }
    console.log = (message = "") => {
        if (logLevel === ERROR) return
        if (logLevel === WARNING) return

        process.stdout.write(
            `[${chalk.blue("INFO")}]    ${groupIndent}${message}\n`
        )
    }
    console.debug = (message = "") => {
        if (logLevel === ERROR) return
        if (logLevel === WARNING) return
        if (logLevel === INFO) return

        process.stdout.write(
            `[${chalk.cyan("DEBUG")}]   ${groupIndent}${message}\n`
        )
    }
    console.group = () => {
        groupIndent += "    "
    }
    console.groupEnd = () => {
        groupIndent = groupIndent.substring(4)
    }
}

export function h1(message: string) {
    console.log(chalk.bold.yellow(message.toUpperCase()))
    console.log()
}

export function h3(message: string) {
    console.log()
    console.log(chalk.bold("## " + message.toUpperCase()))
    console.log()
}

export function bash(bash: string, internal = true): string {
    if(internal) return `\`orgn ${bash}\``
    return `\`${bash}\``
}

export function bashBlock(bash: string, internal = true) {
    console.log()
    console.log(`  $${internal && " orgn"} ${bash}`)
    console.log()
}

export function link(url: string) {
    return chalk.blue.underline(url)
}

type ValidatorFunction = (answer: string) => string | undefined

export async function ask(
    question: string,
    validate: ValidatorFunction
): Promise<string> {
    return new Promise(async (resolve) => {
        let answer = ""
        while (true) {
            answer = await _ask(`[${chalk.magenta("WAIT")}]    ${question}`)

            let message: string | undefined = validate(answer)
            if (message == undefined) {
                resolve(answer)
                break
            }

            console.warn(message)
        }
    })
}

export const booleanValidator: ValidatorFunction = (answer: string) => {
    const answers = ["y", "n", "yes", "no"]

    if (!answers.includes(answer.toLowerCase())) {
        return `This is not a valid answer. Please type one of: '${answers.join(
            ", "
        )}'`
    }
    return undefined
}
