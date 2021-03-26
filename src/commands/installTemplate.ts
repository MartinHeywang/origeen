import { Arguments } from "yargs"
import path from "path"
import fs from "fs-extra"
import { bashBlock, h1, link } from "../logs"
import { execSync } from "child_process"

const pathToTemplateFolder = path.join(__dirname, "..", "..", "templates")

export function execute(args: Arguments) {
    const { error, log, debug } = console

    h1("Template install")

    const templateName = args._[1]?.toString()
    if (templateName == undefined) {
        error("You did not provide a name for the template you're installing.")
        error(
            "Make sure you put it right after the command name. (before any flag)"
        )
        error()
        return
    }
    debug(`Provided template name: ${templateName}`)

    const localPath = (args.local as string) ?? (args.L as string) ?? undefined
    const remoteURL = (args.remote as string) ?? (args.R as string) ?? undefined

    if (localPath) {
        debug("Using --local or -L flag")
        copyLocal(path.resolve(localPath), templateName)
    } else if (remoteURL) {
        debug("Using --remote or -R flag")
        cloneRemote(remoteURL, templateName)
    } else {
        error("Looks like you did not provide a path or a url")
        error("Make sure you use :")
        error("    --local <pathToFolder> to copy a local folder")
        error("    --remote <url> to clone a git repo")
        return
    }

    log()
    log("You can now use the template you installed by running the following :")
    bashBlock(`create <projectName> --template ${templateName}`)
    h1("Enjoy !")
}

function copyLocal(pathToFolder: string, templateName: string) {
    fs.copySync(pathToFolder, path.join(pathToTemplateFolder, templateName))
    console.log("Copied properly")
}

function cloneRemote(url: string, templateName: string) {
    const { error, debug, log } = console
    try {
        const command = "git --version"
        debug(`Running "${command}"`)

        execSync(command)
    } catch (err) {
        error("Looks like 'git' isn't installed on your machine.")
        error("Install it from there : " + link("https://git-scm.com/download"))
        return
    }

    const destination = path.resolve(pathToTemplateFolder, templateName)
    try {
        log(`Cloning ${url} into ${destination}`)

        const command = `git clone ${url} ${destination}`
        debug(`Running "${command}"`)
        execSync(command)
    } catch (err) {
        error(
            "Git was found on your machine, but the command did not ended properly"
        )
        error("- Check if you mispelled the url first")
        error("- Then check the logs above for more answers")
        return
    }

    fs.rmdirSync(path.join(destination, ".git"), { recursive: true })

    log("Cloned properly")
}
