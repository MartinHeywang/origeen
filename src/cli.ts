import meow from "meow"
import { OrigeenError } from "./errors"
import { bash } from "./logUtils"

export function commandName() {
    if (cli.input[0] == undefined) {
        throw new OrigeenError("You did not provide any command to execute.", [
            "Provide the command name as the first positional argument",
            `Type ${bash(`help`)} to see the generic help for Origeen`
        ])
    }

    return cli.input[0]
}

export function positionals() {
    return cli.input.slice(1)
}

export function flags() {
    return cli.flags
}

const cli = meow({
    autoHelp: false,
    autoVersion: true,
    flags: {
        // GENERIC FLAGS
        debug: {
            type: "boolean",
            alias: "X",
            default: false,
        },
        warningOnly: {
            type: "boolean",
            alias: "W",
            default: false,
        },
        errorOnly: {
            type: "boolean",
            alias: "E",
            default: false,
        },
        help: {
            type: "boolean",
            alias: "h",
            default: false
        },
        force: {
            type: "boolean",
            default: false,
            required: false
        },

        // FLAGS THAT ONLY APPLIES WITH CERTAIN COMMANDS
        // create project
        template: {
            type: "string",
            alias: "t",
            default: "@empty",
            required: false
        },
        open: {
            type: "boolean",
            alias: "o",
            default: false,
            required: false
        },
        license: {
            type: "string",
            required: false
        },
        git: {
            type: "boolean",
            default: true,
            required: false
        },

        // config
        set: {
            type: "string",
            alias: "s",
            required: false
        },

        // install template
        local: {
            type: "string",
            alias: "l",
        },
        remote: {
            type: "string",
            alias: "r"
        }
    },
})
