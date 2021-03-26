#!/usr/bin/env node
import { getArgs } from "./args"
import { pathToConfig } from "./config"
import { pathToProjects } from "./projects"
import { Arguments } from "yargs"
import * as logs from "./logs"

import { Command, commands } from "./commands"

import fs from "fs-extra"
import path from "path"

// Skip a line for white space :)
console.log()

// Configure logs
const args: Arguments = getArgs()
if (args.X || args.debug) logs.setup(logs.LogLevel.DEBUG)
else if (args.E || args["error-only"]) logs.setup(logs.LogLevel.ERROR)
else if (args.W || args["warning-only"]) logs.setup(logs.LogLevel.WARNING)
else logs.setup(logs.LogLevel.INFO)

// Ensure that config files exists
if (!fs.existsSync(pathToConfig)) {
    fs.ensureDirSync(path.join(process.env.HOME as string, "origeen"))
    fs.writeFileSync(pathToConfig, "{}")
}
if (!fs.existsSync(pathToProjects)) {
    fs.ensureDirSync(path.join(process.env.HOME as string, "origeen"))
    fs.writeFileSync(pathToProjects, "[]")
}

const commandName = args._[0]?.toString()
const command: Command | undefined = commands.find(
    (cmd) => cmd.name === commandName || cmd.aliases?.includes(commandName)
)

command?.run(args)