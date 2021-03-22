import { repeat } from "underscore.string"
import { commands } from "../commands"
import chalk from "chalk"

import { h1 } from "../logs"


export function execute() {
    const { log, group, groupEnd } = console

    log(chalk.underline("First, thanks for using Origeen !"))
    log()
    log("Origeen is a CLI-tool that helps you manage all your projects !")
    log()
    h1("Usage :")
    log()
    log("  $ orgn <command> [--flags...]")
    log()
    h1("Commands :")
    log()
    group()
    commands.sort((a, b) => {
        if (a.name < b.name) return -1
        if (a.name > b.name) return 1
        return 0
    })
    for (const command of commands) {
        const dashNumber = 20 - command.name.length
        log(`${command.name} ${repeat(" ", dashNumber)} ${command.description}`)
    }
    groupEnd()
    log()
    log()
    log("To know more about a specific command, type :")
    log()
    log("  $ orgn <command> --help")
    log()
}
