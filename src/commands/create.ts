import { Arguments } from "yargs"
import { OrigeenError } from "../commands"
import { getProjects, createProject } from "../projects"

export async function execute(args: Arguments) {
    
    const projectName = args._[1]?.toString();
    if (projectName == undefined) {
        throw new OrigeenError("You need to provide a project name", [
            "Add a <projectName> after the command name",
        ])
    }

    const templateName = (args.template as string) || "@empty"

    createProject(projectName, templateName)
}
