 
import { positionals } from "../cli"
import { h1 } from "../logs"

import { remove } from "../templates"

export function execute() {
    const { log } = console

    h1("Template removal")

    const templateName = positionals()[0]
    log(`Removing template : ${templateName}`)

    remove(templateName)

    log("Done successfully!")
}
