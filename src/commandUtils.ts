import setupCommand from "./commands/setup"

import projectsCommand from "./commands/projects"
import createCommand from "./commands/create"
import openCommand from "./commands/open"
import importCommand from "./commands/import"
import deleteCommand from "./commands/delete"

import installTemplateCommand from "./commands/installTemplate"
import deleteTemplateCommand from "./commands/deleteTemplate"

import configCommand from "./commands/config"
import helpCommand from "./commands/help"

import { bashBlock, h3 } from "./logUtils"

import { OrigeenError } from "./errors"

export interface Command {
    name: string
    description: string
    alias: string[]

    positionals: Positional[]
    options: { [x: string]: Option }

    run: () => Promise<void>
}

export interface Positional {
    name: string
    desc: string
    required: boolean
}

export interface Option {
    desc: string
    alias?: string[]
    required:
        | boolean
        | ((flags: { [x: string]: string | number | boolean }) => boolean)
}

export const commands: Command[] = [
    setupCommand.descriptor,
    projectsCommand.descriptor,
    createCommand.descriptor,
    openCommand.descriptor,
    importCommand.descriptor,
    deleteCommand.descriptor,
    installTemplateCommand.descriptor,
    deleteTemplateCommand.descriptor,
    configCommand.descriptor,
    helpCommand.descriptor,
]

/**
 * Executes a command based on its name
 * 
 * @param commandName the name of the command
 */
export async function executeCommand(commandName: string): Promise<void> {
    const { debug } = console

    const command = findCommand(commandName)

    debug(`Executing command '${commandName}'`)

    await command.run()
}


/**
 * Outputs the help version of the given command
 * 
 * @param commandName the name of the command
 */
export function executeHelpCommand(commandName: string): void {
    const { log, group, groupEnd } = console

    const command = findCommand(commandName)

    const { positionals, options } = command

    const positionalsStr = positionals.reduce((previous, current) => {
        return (
            previous +
            (current.required ? `<${current.name}>` : `[${current.name}]`)
        )
    }, "")

    h3("Usage")
    bashBlock(`${commandName} ${positionalsStr}`)
    h3("Description:")
    log(command.description)
    h3("Positionals")
    group()
    if (positionals.length === 0) console.log("No positionals")
    positionals.forEach((pos) => {
        log(`- ${pos.name} : ${pos.desc}`)
    })
    groupEnd()
    h3("Options")
    group()
    const optionsKeys = Object.keys(options)
    if (optionsKeys.length === 0) console.log("No options")
    optionsKeys.forEach((key) => {
        const prefix = key.length === 1 ? "-" : "--"
        log(`- '${prefix}${key}' : ${options[key].desc}`)
    })
    groupEnd()
}

/**
 * Searches for a command and returns it if it finds one. Otherwise, throws an error.
 * 
 * @param commandName the name of the command
 * @returns the command descriptor
 * @throws {OrigeenError} if the command was not found
 */
function findCommand(commandName: string): Command {
    const command = commands.find(
        (cmd) => cmd.name === commandName || cmd.alias.includes(commandName)
    )

    if (command == undefined) {
        throw new OrigeenError(`Unknown command '${commandName}'`, [
            "Check the spelling",
            "Show the help for Origeen with the '--help' flag",
        ])
    }

    return command
}