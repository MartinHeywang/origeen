#!/usr/bin/env node
import { getArgs } from "./args"
import { executeCommand, OrigeenError } from "./commands"

import * as paths from "./paths"
import * as logs from "./logs"

// Skip a line for white space :)
console.log()

async function main() {
    const startTime = Date.now()

    // Configure logs
    const args = getArgs()
    if (args.X || args["debug"]) logs.setup(logs.LogLevel.DEBUG)
    else if (args.E || args["error-only"]) logs.setup(logs.LogLevel.ERROR)
    else if (args.W || args["warning-only"]) logs.setup(logs.LogLevel.WARNING)
    else logs.setup(logs.LogLevel.INFO)

    paths.ensure()

    const commandName = args._[0]?.toString() ?? "help"

    try {
        await executeCommand(commandName, args)

        const takenTime = Date.now() - startTime
        console.log()
        console.log(`Command executed successfully in ${takenTime}ms`)
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
        error("If the same error keeps happening, open an issue on Github")

        error()
        error(`Command exited with errors after ${takenTime}ms`)
    }
}

main()
