import fs from "fs"
import { execSync } from "child_process"
import path from "path"
import { Arguments } from "yargs"
import { getConfig } from "../config"
import * as logs from "../logs"
import { getProjects, addProject } from "../projects"

export function execute(args: Arguments) {
    const config = getConfig()

    if (args._[1] == undefined) {
        logs.log(3, `You did not provide a project name`)
        return
    }
    const pathToProject = path.join(config.projectsFolder, args._[1] as string)

    const pathToProjectSegments = pathToProject.split("\\")
    const projectName = pathToProjectSegments[pathToProjectSegments.length - 1]

    const alreadyExist = getProjects().find(
        (project) => project.name === projectName
    )
        ? true
        : false
    if (alreadyExist) {
        logs.log(
            3,
            `You already used this name for a project. Pickup another one !`
        )
        return
    }

    logs.log(1, `Creating project '${projectName}' at '${pathToProject}'`)

    logs.log(0, `Creating folder at ${pathToProject}`)
    fs.mkdirSync(pathToProject)
    logs.log(0, `Created!`)
    logs.log(0, `Adding new project to 'projects.json'`)
    addProject({ name: projectName, path: pathToProject })
    logs.log(0, `Added!`)

    const command = `orgn open ${projectName}`;
    logs.log(1, "Opening newly created project...")
    logs.log(0, `Running: ${command}`);
   try {
        const output = execSync(command);
        console.group();
        console.log(output);
        console.groupEnd();
   }catch(err) {
       logs.log(3, `An error occured while opening the project.`);
       logs.log(3, `See the logs above`);
   }
}
