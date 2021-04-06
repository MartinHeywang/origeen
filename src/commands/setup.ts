 
import fs from "fs-extra"
import path from "path"

import { h1, h3, ask, bashBlock, link } from "../logs"

import { setProperty } from "../config"

export async function execute() {
    const { clear, log } = console
    clear()

    h1("Setup Origeen")
    log()
    log()
    log("Welcome to Origeen !")
    log()
    log("The next steps will help you configure Origeen as you wish.")
    log("You only have to do it once !")
    h3("Workspace")
    log("Your workspace is the place where live all your projects.")
    log("This is the default location used by Origeen when creating a project.")
    log()
    log("Example : 'Z:/Users/JohnDoe/Code'")
    log()

    const workspace = await ask("Workspace location? ", (answer) => {
        if (answer == undefined) return "A path cannot be an empty string"
        if (answer == "") return "A path cannot be an empty string"

        const pathToWorkspace = path.resolve(process.cwd(), answer)
        if (!fs.existsSync(pathToWorkspace)) {
            log("The path doesn't exist.")
            log("Origeen will create it for you !")
            fs.mkdirSync(pathToWorkspace)
        }

        return undefined
    })

    setProperty("workspace", workspace)

    log("Your workspace is now initialized to :")
    log(workspace)
    log()
    h3("Editor")
    log("Hopefully you have a text editor installed on your computer.")
    log(
        "Enter the path to its executable so that Origeen can open it for you !"
    )
    log()

    const editor = await ask("Path to editor? ", (answer) => {
        if (answer == undefined) return "A path cannot be an empty string"
        if (answer == "") return "A path cannot be an empty string"

        const pathToEditor = answer
        if (!fs.existsSync(pathToEditor)) {
            return "This isn't a valid path, you probably misspelled it."
        }
        return undefined
    })

    setProperty("editorPath", editor)

    log("Editor path set to :")
    log(editor)
    log()
    log()
    log("You can (re-)configure all of these settings by typing :")
    bashBlock("config <projectName> --set <newValue>")
    h1("Enjoy with Origeen !")
    log()
    log("And by the way, report issues at :")
    log(link("https://github.com/MartinHeywang/origeen/issues/new/choose"))
}
