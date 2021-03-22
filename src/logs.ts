import chalk from "chalk"

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
        groupIndent = groupIndent.substring(3)
    }
}

export function h1(message: string) {
    console.log(chalk.bold.yellow(message.toUpperCase()))
    console.log()
}
