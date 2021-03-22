import { Arguments } from "yargs"
import { getProjects } from "../projects"

export function execute(args: Arguments) {
    console.debug("Listing all projects")
    const projects = getProjects()
    if (projects.length === 0) {
        console.debug("Projects array length evaluated to 0")
        console.log("You haven't got any project yet.")
        console.log(`Type \`orgn create <projectName>\` to create one.`)
        console.log(`or type: \`orgn create --help\` to show the help on creating projects.`)
        return
    }
    console.log(`You got ${projects.length} project(s)`)
    console.log(``)
    for (const project of projects) {
        console.log(1, `${project.name} --- ${project.path}`)
    }
}
