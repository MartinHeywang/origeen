import { execSync } from "child_process"
import fs from "fs-extra"
import path from "path"
import { OrigeenError } from "./errors"
import { bash } from "./logUtils"

import { TEMPLATES as pathToTemplates, TEMPLATES } from "./paths"

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
    const { debug } = console

    const destination = path.join(pathToTemplates, templateName)

    const command = `git clone "${source}" "${destination}"`
    try {
        debug(`Running "${command}"`)
        execSync(command)
    } catch (err) {
        throw new OrigeenError("Unkown error while executing commmand", [
            "Check that 'git' is installed on your machine",
            `Make sure that '${templateName}' is not already used for another template`,
        ])
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
    if (!fs.existsSync(pathToTemplate)) {
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

export function getTemplateLocation(templateName: string) {
    return path.join(TEMPLATES, templateName)
}

export function checkBashRequirements(templateName: string) {
    const file = fs.readFileSync(
        path.join(TEMPLATES, templateName, "bashRequirements.txt"),
        { encoding: "utf-8" }
    )
    const lines = file.split(/\r?\n/) || ""

    lines.forEach((line) => {
        if (!line || line.startsWith("#") || line === "") return

        const word = line.split(" ")[0]

        try {
            execSync(line)
        } catch (err) {
            throw new OrigeenError(
                "The template you are using requires that some cli utilities are installed.\n" +
                    `Origeen tried to run ${bash(
                        line,
                        false
                    )} but it didn't work.\n\nIt looks like you are missing a requirement.`,
                [
                    `Run ${bash(line, false)} manually`,
                    `Install ${bash(
                        word,
                        false
                    )} and make sure to restart the terminal`,
                ]
            )
        }
    })
}
