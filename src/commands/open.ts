// Command: opens a project with your editor
import path from "path"
import { execSync } from "child_process"

import { Arguments } from "yargs"

import { Project, getProjects } from "../projects"
import { getConfig } from "../config"
import * as logs from "../logs"

export function execute(args: Arguments): void {
    const config = getConfig()
    const projects = getProjects()

    const projectName: string = args._[1]?.toString()
    if (projectName == undefined) {
        logs.log(3, `You did not provide a project to open.`)
        process.exit()
    }
    logs.log(0, `Project name : '${projectName}'`)
    const project: Project | undefined = projects.find(
        (project) => project.name === projectName
    )
    if (project == undefined) {
        logs.projectNotFound(projectName)
        process.exit()
    }

    const projectPath = path.join(config.projectsFolder, project.path)
    const editorPath = config.editorPath
    if (editorPath == undefined) {
        logs.log(3, `You did not provide the path to your favorite editor.`)
        logs.log(
            3,
            `You can set it with : ${logs.command(
                "config editorPath --set <pathToEditor>"
            )}`
        )
        return
    }

    const command = `"${editorPath}" "${projectPath}"`
    logs.log(1, `Running : '${command}'`)
    try {
        execSync(command);
    } catch (err) {
        logs.log(3, `There was an error executing the command.`)
        logs.log(3, `Hopefully, here is what you can do :`)
        logs.log(3, `  - Make sure your correctly set your editor.`)
        logs.log(3, `  - Try to run the command manually to see if the errors happens again.`)
        logs.log(3, `  - See the logs above for more details.`)
        logs.log(3, `  - Open an issue if you really don't know why it happens.`)
    }
}
