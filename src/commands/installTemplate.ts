import { add } from "../templateUtils"

import { h1 } from "../logUtils"
import { Command } from "../commandUtils"
import { OrigeenError } from "../errors"

import { flags, positionals } from "../cli"

const descriptor: Command = {
    name: "install-template",
    description: "Clones a GitHub repo or a folder to create a template",
    run: async () => execute(),
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
}

function execute() {
    const { error, log } = console

    const inputFlags = flags()

    h1("Template install")

    const templateName = positionals()[0]
    if (templateName == undefined) {
        throw new OrigeenError(
            "You need to provide a template name that designate the template you're installing.",
            ["Specify the template name right after the command name"]
        )
    }

    const localPath = inputFlags.local
    const remoteURL = inputFlags.remote

    if (localPath) {
        log("Creating template from local path:")
        log(localPath)
        log()

        add(templateName, localPath, false)

        log("Done successfully !")
        return
    }

    if (remoteURL) {
        log("Creating template from remote git repository:")
        log(remoteURL)
        log()

        add(templateName, remoteURL, true)
        return
    }

    throw new OrigeenError(
        "Origeen needs a source to create a template : either a local path or a remote URL.",
        [
            "Specify the '--local <localPath>' flag to copy a local folder",
            "Specify the '--remote <url>' flag to clone a remote git repository",
        ]
    )
}

export default { descriptor }
