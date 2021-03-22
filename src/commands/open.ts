import { execSync } from "child_process"

import { Arguments } from "yargs"

import { Project, getProjects } from "../projects"
import { getConfig } from "../config"
import { h1 } from "../logs"

export function execute(args: Arguments): void {
    const { debug, log, error } = console

    h1("Project Opening")

    const config = getConfig()
    const projects = getProjects()

    const projectName: string = args._[1]?.toString()
    if (projectName == undefined) {
        error(`You did not provide a project to open.`)
        return
    }

    log(`Project name : '${projectName}'`)
    log()
    const project: Project | undefined = projects.find(
        (project) => project.name === projectName
    )
    if (project == undefined) {
        error(`A project named \`${projectName}\` wasn't found.`)
        error()
        return
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
        return
    }
    debug(`Path to editor :`)
    debug(editorPath)
    debug()

    const command = `"${editorPath}" "${projectPath}"`
    log(`Running : '${command}'`)
    try {
        execSync(command)
    } catch (err) {
        error(`There was an error executing the command.`)
        error(`Hopefully, here is a few thing you can do :`)
        error(`  - Make sure your correctly set your editor.`)
        error(`  - Try to run the command manually to see if the error occurs again.`)
        error(`  - See the logs above for more details.`)
        error(`  - Re-run this command with the -X switch (debug mode)`)
        error(`  - Open an issue if you really don't know why it happens.`)
    }
}
