#!/usr/bin/env node
import { getArgs } from "./args"
import { Command, commands } from "./commands"

import * as paths from "./paths"
import * as logs from "./logs"

// Skip a line for white space :)
console.log()

// Configure logs
const args = getArgs()
if (args.X || args.debug) logs.setup(logs.LogLevel.DEBUG)
else if (args.E || args["error-only"]) logs.setup(logs.LogLevel.ERROR)
else if (args.W || args["warning-only"]) logs.setup(logs.LogLevel.WARNING)
else logs.setup(logs.LogLevel.INFO)

paths.ensure()

const commandName = args._[0]?.toString()
if (commandName == undefined) {
    console.error("You did not give any command to execute.")
    process.exit()
}
const command: Command | undefined = commands.find(
    (cmd) => cmd.name === commandName || cmd.aliases?.includes(commandName)
)
if (command == undefined) {
    console.error(`Command ${commandName} not found.`)
    process.exit()
}

try {
    command.run(args)
} catch (err) {
    console.error("An error occured. Message :")
    console.error(err)
}
