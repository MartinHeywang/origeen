import fs from "fs-extra"
import path from "path"
import { Arguments } from "yargs"
import { OrigeenError } from "../commands"
import { getConfig } from "../config"
import { h1 } from "../logs"
import { getProjects, addProject } from "../projects"

export function execute(args: Arguments) {
    const { log, debug, error } = console

    h1("Project creation")

    const config = getConfig()

    if (args._[1] == undefined) {
        throw new OrigeenError("You need to provide a project name", [
            "Add a <projectName> after the command name"
        ])
    }
    if(config.workspace == undefined) {
        throw new OrigeenError("You did not configure your workspace location yet", [
            "Run 'orgn setup' if you haven't done it yet",
            "Run 'orgn config workspace --set <pathToWorkspace>"
        ])
    }
    const pathToProject = path.join(config.workspace, args._[1] as string)
    

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
        throw new OrigeenError(`You can't create two projects with the name. '${projectName}' is already used.`, [
            "Choose another name",
            "Check the spelling",
            "Delete the existing project"
        ])
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

    debug(`Copying template to the project destination`);
    fs.copySync(templatePath, pathToProject);
    debug(`Copied!`)
    debug()

    debug(`Adding new project to 'projects.json'`)
    addProject({ name: projectName, path: pathToProject })
    debug(`Added!`)
    debug()

    log("Done!")
}
