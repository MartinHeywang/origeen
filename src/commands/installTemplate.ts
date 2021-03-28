import { Arguments } from "yargs"
import { add } from "../templates"

import { h1 } from "../logs"

export function execute(args: Arguments) {
    const { error, log } = console

    h1("Template install")

    const templateName = args._[1]?.toString() ?? ""

    const localPath = (args.local as string) ?? (args.L as string)
    const remoteURL = (args.remote as string) ?? (args.R as string)

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

    error("Oups!")
    error("Origeen needs a source to create a template : either a local path or a remote URL.")
    error("You can specify the source with one of these two flags:")
    error("  --local  <localPath>")
    error("  --remote <remoteURL>")
}