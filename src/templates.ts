import { execSync } from "child_process"
import fs from "fs-extra"
import path from "path"
import { link } from "./logs"

import { TEMPLATES as pathToTemplates } from "./paths"

export function add(
    templateName: string,
    pathOrUrl: string,
    remote: boolean
): void {
    const { error } = console

    if (isReservedName(templateName)) {
        error(`The template name '${templateName}' looks like a reserved name`)
        error("You cannot create a template with this name.")
        error("Please retry with another name")
        throw new Error()
    }

    if (remote) return createTemplateFromRemote(pathOrUrl, templateName)
    createTemplateFromLocal(pathOrUrl, templateName)
}

function createTemplateFromLocal(source: string, templateName: string): void {
    const { debug, error } = console

    const pathExists = fs.existsSync(source)
    if (!pathExists) {
        throw new Error("The provided source doesn't exist.")
    }

    const destination = path.resolve(pathToTemplates, templateName)
    debug("Destination folder :")
    debug(destination)
    debug()

    const templateExists = fs.existsSync(destination)
    if (templateExists) {
        debug(`Path ${destination} already exists!`)
        debug()
        error("This template name is already used. You can:")
        error("  - Delete the existing template")
        error("  - Choose another name")
        error()
        throw new Error("The template already exists !")
    }

    debug(`Copying '${source}'`)
    debug(`To: '${destination}'`)
    debug()
    fs.copySync(source, destination)
}

function createTemplateFromRemote(source: string, templateName: string): void {
    const { error, debug } = console

    const destination = path.resolve(pathToTemplates, templateName)

    const command = `git clone "${source}" "${destination}"`
    try {
        debug(`Running "${command}"`)
        execSync(command)
    } catch (err) {
        error("Ouch!")
        error(`Origeen tried to run '${command}', but it didn't end properly`)
        error(`What you may want to do :`)
        error("  - Check that 'git' is installed on your machine")
        error(`     - Get it there : ${link("https://git-scm.com/download")}`)
        error("  - Run the command manually")
        error("  - Rerun this command with the -X switch")
        error("  - Open an issue on GitHub")
        throw new Error("Unkown error while executing commmand")
    }

    fs.rmdirSync(path.join(destination, ".git"), { recursive: true })
}

export function remove(templateName: string): void {
    const { error, debug } = console

    if (isReservedName(templateName)) {
        error("You gave a template name beginning with '@'")
        error("Those are reserved template names and thus cannot be deleted")
        error()
        throw new Error("Naming error")
    }

    const pathToTemplate = path.join(pathToTemplates, templateName)
    if(!fs.existsSync(pathToTemplate)) {
        error("The given template name was not found.")
        error("Make sure you spelled it properly")
        error()
        throw new Error("Template not found")
    }

    debug(`Removing '${pathToTemplate}' recursively`)
    debug()
    fs.rmdirSync(pathToTemplate, { recursive: true })
}

function isReservedName(name: string): boolean {
    if (name.startsWith("@")) return true
    return false
}

/**
 * Validates a name to apply to a template
 *
 * @param name the name to validate
 * @returns an error message (string) if the name is not valid, otherwiser false
 */
function isValidName(name: string): boolean {
    const regex = new RegExp(`^[a-zA-Z0-9]+$`)
    if (name.match(regex)) return false
    return true
}
