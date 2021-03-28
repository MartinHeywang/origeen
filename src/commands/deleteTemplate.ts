import { Arguments } from "yargs"
import { h1 } from "../logs"

import { remove } from "../templates"

export function execute(args: Arguments) {
    const { log } = console

    h1("Template removal")

    const templateName = args._[1]?.toString()
    log(`Removing template : ${templateName}`)

    remove(templateName)

    log("Done successfully!")
}
