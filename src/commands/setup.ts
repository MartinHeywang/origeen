import { ask as _ask } from "stdio"
import { Arguments } from "yargs"
import fs from "fs-extra"
import path from "path"

import { h1 } from "../logs"

import {setProperty} from "../config"

export async function execute(args: Arguments) {
    const { clear, log } = console
    clear()

    h1("Setup Origeen")
    log()
    log("Welcome to Origeen !")
    log()
    log("The next steps will help you configure Origeen as you wish.")
    log("You only have to do it once !")
    log()
    log("## Workspace")
    log()
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
    log()
    log("## Editor")
    log()
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
    log()
    log("  $ orgn config <configName> --set <newValue>")
    log()
    h1("Enjoy with Origeen !")
    log()
    log("And by the way, report issues at :")
    log("https://github.com/MartinHeywang/origeen/issues/new");
}

type ValidatorFunction = (answer: string) => string | undefined

async function ask(
    question: string,
    validate: ValidatorFunction
): Promise<string> {
    return new Promise(async (resolve) => {
        let answer = ""
        while (true) {
            answer = await _ask(`[WAIT]    ${question}`)

            let message: string | undefined = validate(answer)
            if (message == undefined) {
                resolve(answer)
                break
            }

            console.warn(message)
        }
    })
}
