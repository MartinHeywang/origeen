import { Arguments } from "yargs"
import { getProjects } from "../projects"
import * as logs from "../logs";

export function execute(args: Arguments){
    const projects = getProjects();
    if(projects.length === 0) {
        logs.log(1, "You haven't got any project yet.")
        logs.log(1, `Type ${logs.command("create <projectName>")} to create one.`);
        return
    }
    logs.log(1, `You got ${projects.length} project(s)`);
    logs.log(1, ``);
    for(const project of projects) {
        logs.log(1, `${project.name} --- ${project.path}`);
    }
}