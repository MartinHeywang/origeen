#!/usr/bin/env node
import { Config, getConfig } from "./config"
import { getArgs } from "./args"
import { Arguments } from "yargs"
import { Package, getPackageInfo } from "./package"
import * as logs from "./logs"

import { Command, commands } from "./commands"

const config: Config = getConfig()
const args: Arguments = getArgs()
const packageInfo: Package = getPackageInfo()

console.log()

if (args.X || args.debug) logs.setLogLevel(0)
else if (args.E || args["error-only"]) logs.setLogLevel(3)
else if (args.W || args["warning-only"]) logs.setLogLevel(2)

if (args._.length < 1) {
    logs.noCommand()
    process.exit()
}

const commandName = args._[0].toString()
const command: Command | undefined = commands.find(
    (cmd) => cmd.name === commandName || cmd.aliases?.includes(commandName)
)
if (command == undefined) {
    logs.commandNotFound(commandName)
    process.exit()
}

command.run(args)
