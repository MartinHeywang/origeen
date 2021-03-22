import { repeat } from "underscore.string"
import { commands } from "../commands"

export function execute() {
    console.log("Thanks for using Origeen !")
    console.log()
    console.log(
        "Origeen is a CLI-tool that helps you manage all your projects !"
    )
    console.log()
    console.log("Usage :")
    console.log()
    console.log("  $ orgn <command> [--flags...]")
    console.log()
    console.log("Commands :")
    console.log()
    console.group()
    commands.sort((a, b) => {
        if (a.name < b.name) return -1
        if (a.name > b.name) return 1
        return 0
    })
    for (const command of commands) {
        const dashNumber = 20 - command.name.length;
        console.log(`${command.name} ${repeat(" ", dashNumber)} ${command.description}`)
    }
    console.log()
    console.log()
    console.log("To know more about a specific command, type :")
    console.log()
    console.log("  $ orgn <command> --help")
}
