import fs from "fs"
import { execSync } from "child_process"
import path from "path"
import { Arguments } from "yargs"
import { getConfig } from "../config"
import { h1 } from "../logs"
import { getProjects, addProject } from "../projects"

export function execute(args: Arguments) {
    const { log, debug, error } = console

    h1("Project creation")

    const config = getConfig()

    if (args._[1] == undefined) {
        error(`You did not provide a project name`)
        return
    }
    const pathToProject = path.join(config.projectsFolder, args._[1] as string)
    

    const pathToProjectSegments = pathToProject.split("\\")
    const projectName = pathToProjectSegments[pathToProjectSegments.length - 1]
    debug("New Project name :")
    debug(projectName)
    debug()
    debug("Absolute path to project :")
    debug(pathToProject)
    debug()

    const alreadyExist = getProjects().some(
        (project) => project.name === projectName
    )
    if (alreadyExist) {
        error(`You already used this name for a project. Pick another one !`)
        return
    }

    const templateName = (args.template as string) || "empty"
    debug(`Template name: '${templateName}'`)
    debug()
    const templatePath = path.join(
        __dirname,
        "..",
        "..",
        "templates",
        templateName
    )
    debug("Absolute path to template :")
    debug(templatePath)
    debug()

    log(`Creating project '${projectName}'`)
    log(`At '${pathToProject}'`)
    log(`Using template '${templateName}'`)
    log()

    const command = `cp ${templatePath} ${pathToProject} -r`
    debug(`Executing command synchronously: ${command}`)

    execSync(command)
    debug(`Template copied!`)
    debug()
    debug(`Adding new project to 'projects.json'`)
    addProject({ name: projectName, path: pathToProject })
    debug(`Added!`)
    debug()

    log("Done!")
}
