 
import { flags, positionals } from "../cli"
import { OrigeenError } from "../commands"
import { getProjects, createProject, openProject } from "../projects"

export async function execute() {

    const inputFlags = flags()
    
    const projectName = positionals()[0]
    if (projectName == undefined) {
        throw new OrigeenError("You need to provide a project name", [
            "Add a <projectName> after the command name",
        ])
    }

    const templateName = (inputFlags.template as string) || "@empty"
    const licenseName = inputFlags.license

    createProject(projectName, templateName, licenseName)

    if(inputFlags.open) {
        openProject(projectName)
    }
}
