// Command: opens a project with your editor
import path from "path"

import { Arguments } from "yargs"

import { Project, getProjects } from "../projects"
import { getConfig } from "../config"
import * as logs from "../logs"

export function execute(args: Arguments): void {
    const config = getConfig()
    const projects = getProjects()

    const projectName: string = args._[1].toString()
    logs.log(0, `Project name : '${projectName}'`)
    const project: Project | undefined = projects.find(
        (project) => project.name === projectName
    )
    if (project == undefined) {
        logs.projectNotFound(projectName)
        process.exit()
    }

    const projectPath = path.join(config.projectsFolder, project.path)
    console.log(projectPath);
}
