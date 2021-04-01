import fs from "fs"
import { Arguments } from "yargs"
import { OrigeenError } from "../commands"

import { ask, h1 } from "../logs"
import { deleteProject, getProjects } from "../projects"

export async function execute(args: Arguments) {
    const { log, debug, error, warn } = console
    const projectName = args._[1]?.toString()

    h1("Project deletion")

    if (projectName == undefined) {
        error(`You did not provide any project to delete`)
        throw new OrigeenError("You did not provide any project name", [
            "Provide a <projectName> after the command name",
        ])
    }

    debug(`Searching for project named '${projectName}'`)
    const project = getProjects().find((project) => project.name == projectName)
    if (project == undefined) {
        throw new OrigeenError(
            `Origeen did not found any project named '${projectName}'`,
            [
                "Check the spelling",
                "List all your projects with 'orgn projects'",
            ]
        )
    }
    debug("Found one !")
    debug()

    log(`Deleting project named : '${projectName}'`)
    log(`At: '${project.path}'`)
    log()

    warn("This will delete ALL files and ALL subfolders in that directory, plus the root of the project")
    warn()

    const verification = await ask("Are you sure? ", (answer: string) => {
        const answers = ["y", "n", "yes", "no"]

        if (!answers.includes(answer.toLowerCase())) {
            return `This is not a valid answer. Please type one of: '${answers.join(
                ", "
            )}'`
        }
        return undefined
    })

    log()

    if (
        verification.toLowerCase() === "n" ||
        verification.toLowerCase() === "no"
    ) {
        throw new OrigeenError("Project deletion cancelled.", [
            "Rerun the command, but be sure you wan't to delete this project."
        ])
    }

    debug()
    debug(`Removing folder at: ${project.path}`)
    fs.rmdirSync(project.path, { recursive: true })
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
