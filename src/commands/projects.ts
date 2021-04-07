import { getProjects } from "../projectUtils"
import { green } from "chalk"
import { Command } from "../commandUtils"

const descriptor: Command = {
    name: "projects",
    description: "Lists all your projects",
    run: async () => execute(),
    alias: ["p"],

    positionals: [],
    options: {},
}

function execute() {
    const { log } = console

    const projects = getProjects()
    if (projects.length === 0) {
        log("You haven't got any project yet.")
        log(`Type \`orgn create <projectName>\` to create one.`)
        log(
            `or type: \`orgn create --help\` to show the help on creating projects.`
        )
        log()
        return
    }

    log(`You got ${green(projects.length)} project(s)`)
    log(``)
    for (const project of projects) {
        log(`${project.name} --- ${project.path}`)
    }
}

export default { descriptor }
