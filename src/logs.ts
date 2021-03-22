import chalk from "chalk"

export enum LogLevel {
    ERROR = 3,
    WARNING = 2,
    INFO = 1,
    DEBUG = 0,
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
        if (logLevel === (WARNING || ERROR)) return
        process.stdout.write(
            `[${chalk.blue("INFO")}]    ${groupIndent}${message}\n`
        )
    }
    console.debug = (message = "") => {
        if (logLevel === (WARNING || ERROR || INFO)) return
        process.stdout.write(
            `[${chalk.cyan("DEBUG")}]   ${groupIndent}${message}\n`
        )
    }
    console.group = () => {
        groupIndent += "    "
    }
    console.groupEnd = () => {
        groupIndent = groupIndent.substring(3)
    }
}

export function h1(message: string) {
    console.log(chalk.bold.yellow(message.toUpperCase()));
    console.log()
}