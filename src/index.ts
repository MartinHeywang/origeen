#!/usr/bin/env node
import { commandName, flags } from "./cli"
import { executeCommand, executeHelpCommand } from "./commands"

import * as paths from "./paths"
import * as logs from "./logs"

// Skip a line for white space :)
console.log()

async function main() {
    const startTime = Date.now()

    // Configure logs
    const inputFlags = flags()
    if (inputFlags.debug) logs.setup(logs.LogLevel.DEBUG)
    else if (inputFlags.warningOnly) logs.setup(logs.LogLevel.WARNING)
    else if (inputFlags.errorOnly) logs.setup(logs.LogLevel.ERROR)
    else logs.setup(logs.LogLevel.INFO)

    paths.ensure()

    try {
        if(inputFlags.help) executeHelpCommand(commandName())
        else await executeCommand(commandName())

        const takenTime = Date.now() - startTime
        
        console.log()
        console.log(`Origeen executed successfully in ${takenTime}ms`)
    } catch (err) {
        const { error, group, groupEnd } = console

        const takenTime = Date.now() - startTime

        error("Ouch!")
        error()

        if (err.message) {
            err.message.split("\n").forEach((line: string) => {
                error(line)
            })
            error()
        }
        if (err.advices) {
            error("Here is what you can do:")
            group()
            err.advices.forEach((advice: string) => {
                error(`- ${advice}`)
            })
            groupEnd()
        }

        error()
        error("If you can't figure out why this is happening, re-run this command with the `-X` switch.")
        error("If the same error keeps happening, open an issue on GitHub")

        error()
        error(`Origeen exited with errors after ${takenTime}ms`)
    }
}

main()
