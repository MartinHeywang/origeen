 
import { add } from "../templates"

import { h1 } from "../logs"
import { OrigeenError } from "../commands"
import { flags, positionals } from "../cli"

export function execute() {
    const { error, log } = console

    const inputFlags = flags()

    h1("Template install")

    const templateName = positionals()[0]
    if(templateName == undefined) {
        throw new OrigeenError("You need to provide a template name that designate the template you're installing.", [
            "Specify the template name right after the command name"
        ]);
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
            "Specify the '--remote <url>' flag to clone a remote git repository"
        ]
    )
}