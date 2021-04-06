import { execute as setup } from "./commands/setup"
import { execute as create } from "./commands/create"
import { execute as open } from "./commands/open"
import { execute as _import } from "./commands/import"
import { execute as _delete } from "./commands/delete"
import { execute as installTemplate } from "./commands/installTemplate"
import { execute as deleteTemplate } from "./commands/deleteTemplate"
import { execute as config } from "./commands/config"
import { execute as projects } from "./commands/projects"
import { execute as help} from "./commands/help"
import { positionals } from "./cli"
import { bash, bashBlock, h3 } from "./logs"

export class OrigeenError extends Error {
    advices

    constructor(message: string, advices: string[]) {
        super(message)
        this.advices = advices
    }
}

export async function executeCommand(commandName: string): Promise<void> {
    const { debug } = console

    const command = findCommand(commandName)

    debug(`Executing command '${commandName}'`)

    const givenPositionals = positionals()
    const requiredPositionals = command.positionals.filter(
        (pos) => pos.required
    )

    debug(
        `Required positionals : '${requiredPositionals
            .map((pos) => pos.name)
            .join("', '")}'`
    )
    debug(`Given positionals: '${givenPositionals.join("', '")}'`)

    if (givenPositionals.length < requiredPositionals.length) {
        throw new OrigeenError(
            "It looks like you did not enough provide enough positionals to the command in order for it to execute.",
            [`Type: ${bash(`${commandName} --help`)}`]
        )
    }

    // TODO: Check for required options.

    await command.run()
}

export function executeHelpCommand(commandName: string): void {
    const { log, group, groupEnd } = console

    const command = findCommand(commandName)

    const { positionals, options } = command

    const positionalsStr = positionals.reduce((previous, current) => {
        return previous + (current.required ? `<${current.name}>` : `[${current.name}]`)
    }, "")

    h3("Usage")
    bashBlock(`${commandName} ${positionalsStr}`)
    h3("Description:")
    log(command.description)
    h3("Positionals")
    group()
    if(positionals.length === 0) console.log("No positionals")
    positionals.forEach((pos) => {
        log(`- ${pos.name} : ${pos.desc}`)
    })
    groupEnd()
    h3("Options")
    group()
    const optionsKeys = Object.keys(options)
    if(optionsKeys.length === 0) console.log("No options")
    optionsKeys.forEach(key => {
        const prefix = key.length === 1 ? "-" : "--"
        log(`- '${prefix}${key}' : ${options[key].desc}`)
    })
    groupEnd()
}

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
    {
        name: "setup",
        description: "Launches the origeen setup process",
        run: async () => await setup(),
        alias: [],

        positionals: [],
        options: {},
    },
    {
        name: "projects",
        description: "Lists all your projects",
        run: async () => projects(),
        alias: ["p"],

        positionals: [],
        options: {},
    },
    {
        name: "create",
        description: "Creates a new project",
        run: async () => create(),
        alias: ["new", "c"],

        positionals: [
            {
                name: "projectName",
                desc: "The name of the project that you are creating",
                required: true,
            },
        ],
        options: {
            open: {
                desc: "Whether you want to open the project right after its creation",
                required: false,
                alias: ["o"],
            },
            license: {
                desc: "The name of the LICENSE you want to add",
                required: false,
            },
        },
    },
    {
        name: "open",
        description: "Opens a project with your favourite editor",
        run: async () => open(),
        alias: ["o"],

        positionals: [
            {
                name: "projectName",
                desc: "The name of the project that you want to open",
                required: true,
            },
        ],
        options: {},
    },
    {
        name: "import",
        description: "Imports an exisiting project into Origeen",
        run: async () => _import(),
        alias: [],

        positionals: [
            {
                name: "path",
                desc: "The absolute path to the project you want to import",
                required: true,
            },
        ],
        options: {},
    },
    {
        name: "install-template",
        description: "Clones a GitHub repo or a folder to create a template",
        run: async () => installTemplate(),
        alias: ["it"],

        positionals: [
            {
                name: "templateName",
                desc: "The name of the template you're installing",
                required: true,
            },
        ],
        options: {
            local: {
                desc: "The absolute path to the folder you are using as a template",
                required: (flags) => {
                    return flags.remote == undefined
                },
            },
            remote: {
                desc: "The url to the remote Git repo you are using as a template",
                required: (flags) => {
                    return flags.local == undefined
                },
            },
        },
    },
    {
        name: "delete-template",
        description: "Deletes a previously installed template",
        run: async () => deleteTemplate(),
        alias: ["dt"],

        positionals: [
            {
                name: "templateName",
                desc: "The name of the template you're deleting",
                required: true,
            },
        ],
        options: {},
    },
    {
        name: "delete",
        description: "Deletes a project from the disk",
        run: async () => await _delete(),
        alias: [],

        positionals: [
            {
                name: "projectName",
                desc: "The name of the project you are deleting",
                required: true,
            },
        ],
        options: {},
    },
    {
        name: "config",
        description: "Get/Set values in the config file",
        run: async () => config(),
        alias: [],

        positionals: [
            {
                name: "configName",
                desc: "The name of the config you want to get the value",
                required: false
            }
        ],
        options: {
            set: {
                desc: "The new value for the property. Has an effect only if you provide a config name.",
                required: (flags) => {
                    return flags.get == undefined
                },
                alias: ["s"],
            },
        },
    },
    {
        name: "help",
        description: "See the generic help for Origeen",
        run: async () => help(),
        alias: ["h"],

        positionals: [],
        options: {}
    }
]
