import fs from "fs"
import { Arguments } from "yargs"

import * as logs from "../logs"
import { deleteProject, getProjects } from "../projects"

export function execute(args: Arguments){
    const projectName = args._[1]?.toString();

    if(projectName == undefined) {
        logs.log(3, `You did not provide any project to delete`);
        return
    }

    logs.log(0, `Searching for project named '${projectName}'`);
    const project = getProjects().find(project => project.name == projectName);
    if(project == undefined) {
        logs.projectNotFound(projectName)
        return
    }
    logs.log(0, "Found one !");

    logs.log(0, `Deleting project '${projectName}' from 'projects.json'`);
    deleteProject(project);
    logs.log(0, "Deleted!");
    logs.log(0, `Removing folder at: ${project.path}`);
    fs.rmdirSync(project.path);
    logs.log(0, "Removed!");
    logs.log(1, `The project named ${projectName} has been successfully deleted from your disk !`);
}