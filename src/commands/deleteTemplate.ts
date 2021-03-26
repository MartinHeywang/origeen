import { Arguments } from "yargs"

import fs from "fs-extra"
import path from "path"

import { h1 } from "../logs"

export function execute(args: Arguments) {
    const { error, log } = console

    const templateName = args._[1]?.toString()
    if (templateName == undefined) {
        error("You did not provide a template name to remove.")
    }
    if(templateName == "empty") {
        error("The template 'empty' is not deletable.")
    }

    const pathToTemplate = path.join(
        __dirname,
        "..",
        "..",
        "templates",
        templateName
    )
    fs.rmdirSync(pathToTemplate, {
        recursive: true,
    })
}
