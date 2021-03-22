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

if (args.X || args.debug) logs.setup(logs.LogLevel.DEBUG)
else if (args.E || args["error-only"]) logs.setup(logs.LogLevel.ERROR)
else if (args.W || args["warning-only"]) logs.setup(logs.LogLevel.WARNING)
else logs.setup(logs.LogLevel.INFO)

const commandName = args._[0].toString()
const command: Command | undefined = commands.find(
    (cmd) => cmd.name === commandName || cmd.aliases?.includes(commandName)
)

command?.run(args)