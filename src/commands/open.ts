import { execSync } from "child_process"

import { Arguments } from "yargs"

import { Project, getProjects } from "../projects"
import { getConfig } from "../config"
import { h1 } from "../logs"
import { OrigeenError } from "../commands"

export function execute(args: Arguments): void {
    const { debug, log, error } = console

    h1("Project Opening")

    const config = getConfig()
    const projects = getProjects()

    const projectName: string = args._[1]?.toString()
    if (projectName == undefined) {
        throw new OrigeenError("In order to open a project, you need to provide its name.", [
            "Provide '<projectName>' after the command name",
        ])
    }

    log(`Project name : '${projectName}'`)
    log()
    const project: Project | undefined = projects.find(
        (project) => project.name === projectName
    )
    if (project == undefined) {
        throw new OrigeenError(
            `A project named \`${projectName}\` wasn't found.`,[
                "Check the spelling",
                "Run the 'projects' command to list all your projects",
            ]
        )
    }

    const projectPath = project.path
    debug(`Path to Project :`)
    debug(projectPath)
    debug()
    const editorPath = config.editorPath
    if (editorPath == undefined) {
        error(`You did not provide the path to your favorite editor.`)
        error(
            `You can set it with : "orgn config editorPath --set <pathToEditor>"`
        )
        throw new OrigeenError("You did not set the path to your favourite code editor", [
            "Set it with: 'origeen config editorPath --set <pathToEditor>"
        ])
    }
    debug(`Path to editor :`)
    debug(editorPath)
    debug()

    const command = `"${editorPath}" "${projectPath}"`
    debug(`Running : '${command}'`)
    try {
        execSync(command)
    } catch (err) {
        throw new OrigeenError(`There was an error executing the command :\n'${command}'`, [
            "See the logs to know what happened",
            "Check that the path to your editor is correct",
            "Run the command manually"
        ])
    }
}
