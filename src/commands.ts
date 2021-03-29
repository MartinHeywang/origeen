import { Arguments } from "yargs"

import { execute as setup } from "./commands/setup"
import { execute as create } from "./commands/create"
import { execute as open } from "./commands/open"
import { execute as _import } from "./commands/import"
import { execute as _delete } from "./commands/delete"
import { execute as installTemplate } from "./commands/installTemplate"
import { execute as deleteTemplate } from "./commands/deleteTemplate"
import { execute as config } from "./commands/config"
import { execute as projects } from "./commands/projects"
import { execute as help } from "./commands/help"

export class OrigeenError extends Error {
    advices

    constructor(message: string, advices: string[]) {
        super(message)
        this.advices = advices
    }
}

export async function executeCommand(commandName: string, args: Arguments): Promise<void> {
    const command = commands.find(
        (cmd) => cmd.name === commandName || cmd.aliases?.includes(commandName)
    )

    if(command == undefined) {
        throw new OrigeenError(`Unkwown command '${commandName}'`, [
            "Check the spelling",
            "Run 'orgn' to list the available commands"
        ]);
    }

    await command?.run(args)
}

export interface Command {
    name: string
    description: string
    usage: string

    run: (args: Arguments) => Promise<void>

    aliases?: string[]
}

export const commands: Command[] = [
    {
        name: "setup",
        description: "Launches the origeen setup process",
        run: async (args) => await setup(args),

        usage: "setup",
    },
    {
        name: "projects",
        description: "Lists all your projects",
        run: async (args) => projects(args),
        usage: "projects",
    },
    {
        name: "create",
        description: "Creates a new project",
        run: async (args) => create(args),
        aliases: ["c"],
        usage: "create <projectName>",
    },
    {
        name: "open",
        description: "Opens a project with your favourite editor",
        run: async (args) => open(args),
        aliases: ["o"],

        usage: "open <projectName>",
    },
    {
        name: "import",
        description: "Imports an exisiting project into Origeen",
        run: async (args) => _import(args),

        usage: "import <pathToProject>",
    },
    {
        name: "install-template",
        description: "Clones a GitHub repo or a folder to create a template",
        run: async (args) => installTemplate(args),
        aliases: ["it"],

        usage:
            "install-template [--local <pathToFolder> | --remote <urlToGitRepo>] [templateName]",
    },
    {
        name: "delete-template",
        description: "Deletes a previously installed template",
        run: async (args) => deleteTemplate(args),
        aliases: ["dt"],

        usage: "delete-template <templateName>",
    },
    {
        name: "delete",
        description: "Deletes a project from the disk",
        run: async (args) => _delete(args),
        usage: "delete <projectName>",
    },
    {
        name: "config",
        description: "Get/Set values in the config file",
        run: async (args) => config(args),
        usage: "config [configName [--set <newConfigValue>] ]",
    },
    {
        name: "help",
        usage: "help",
        description: "Shows the help for orgn",
        run: async () => help(),
        aliases: ["h"],
    },
]
