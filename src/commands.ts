import { Arguments, string } from "yargs"

import { execute as setup } from "./commands/setup"
import { execute as create } from "./commands/create"
import { execute as open } from "./commands/open"
import { execute as _import } from "./commands/import"
import { execute as _delete } from "./commands/delete"
import { execute as installTemplate } from "./commands/installTemplate"
import { execute as config } from "./commands/config"
import { execute as projects } from "./commands/projects"
import { execute as help } from "./commands/help"

export interface Command {
    name: string
    usage: string
    usageArgs: {
        [x: string]: string
    }
    description: string
    run: (args: Arguments) => void

    aliases?: string[]
}

export const commands: Command[] = [
    {
        name: "setup",
        description: "Launch the ogy setup process",
        run: async (args) => await setup(args),
        usage: "setup",
        usageArgs: {},
    },
    {
        name: "projects",
        description: "List all your projects",
        run: async (args) => await projects(args),
        usage: "projects",
        usageArgs: {}
    },
    {
        name: "create",
        "description": "Create a new project",
        run: async (args) => await create(args),
        aliases: ["c"],
        usage: "create <projectName>",
        usageArgs: {
            "projectName": "the name of the new project"
        }
    },
    {
        name: "open",
        description: "Opens a project with your favourite editor",
        run: (args) => open(args),
        aliases: ["o"],

        usage: "open <projectName>",
        usageArgs: {
            projectName: "the name of the project to open",
        },
    },
    {
        name: "import",
        description: "Imports an exisiting project into Origeen",
        run: (args) => _import(args),

        usage: "import <pathToProject>",
        usageArgs: {
            "pathToProject": "the absolute path to the project"
        }
    },
    {
        name: "install-template",
        description: "Clones a GitHub repo or a folder to create a template",
        run: async(args) => installTemplate(args),
        aliases: ["it"],

        usage: "install-template [--local <pathToFolder> | --remote <urlToGitRepo>] [templateName]",
        usageArgs: {
            "pathToFolder": "when specified with the --local flag, an absolute path to a local folder",
            "urlToGitRepo": "when specified with the --remote flag, a url to a git repository",
            "templateName": "the name of the copied template"
        }
    },
    {
        name: "delete",
        description: "Deletes a project from the disk",
        run: (args) => _delete(args),
        usage: "delete <projectName>",
        usageArgs: {
            "projectName": "the name of the project to open"
        }
    },
    {
        name: "config",
        description: "Get/Set values in the config file",
        run: (args) => config(args),
        usage: "config [configName [--set <newConfigValue>] ]",
        usageArgs: {
            configName: "the name of a property",
            newConfigValue: "the new value for the config",
        },
    },
    {
        name: "help",
        usage: "help",
        usageArgs: {},
        description: "Shows the help for orgn",
        run: () => help(),
        aliases: ["h"],
    },
]
