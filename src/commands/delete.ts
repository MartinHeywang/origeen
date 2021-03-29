import fs from "fs"
import { Arguments } from "yargs"
import { OrigeenError } from "../commands"

import { h1 } from "../logs"
import { deleteProject, getProjects } from "../projects"

export function execute(args: Arguments) {
    const { log, debug, error } = console
    const projectName = args._[1]?.toString()

    h1("Project deletion")

    if (projectName == undefined) {
        error(`You did not provide any project to delete`)
        throw new OrigeenError("You did not provide any project name", [
            "Provide a <projectName> after the command name"
        ])
    }

    debug(`Searching for project named '${projectName}'`)
    const project = getProjects().find((project) => project.name == projectName)
    if (project == undefined) {
        error(`A project named \`${projectName}\` wasn't found.`)
        error(`Did you misspell it?`)
        error()
        throw new OrigeenError(`Origeen did not found any project named '${projectName}'`, [
            "Check the spelling",
            "List all your projects with 'orgn projects'"
        ])
    }
    debug("Found one !")
    debug()

    log(`Deleting project named : '${projectName}'`)
    log(`At: '${project.path}'`)
    log()

    debug(`Removing folder at: ${project.path}`)
    fs.rmdirSync(project.path)
    debug("Removed!")
    debug()
    debug(
        `The project named ${projectName} has been successfully deleted from your disk !`
    )
    debug()
    debug(`Deleting project '${projectName}' from 'projects.json'`)
    deleteProject(project)
    debug("Deleted!")
    debug()
    log("Done !")
}
