import { positionals } from "../cli"
import { Command } from "../commandUtils"

import { h1 } from "../logUtils"
import { remove } from "../templateUtils"

const descriptor: Command = {
    name: "delete-template",
    description: "Deletes a previously installed template",
    run: async () => execute(),
    alias: ["dt"],

    positionals: [
        {
            name: "templateName",
            desc: "The name of the template you're deleting",
            required: true,
        },
    ],
    options: {},
}

function execute() {
    const { log } = console

    h1("Template removal")

    const templateName = positionals()[0]
    log(`Removing template : ${templateName}`)

    remove(templateName)

    log("Done successfully!")
}

export default { descriptor }
