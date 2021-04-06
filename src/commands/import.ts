 
import { positionals } from "../cli"
import { OrigeenError } from "../commands"
import { importProject } from "../projects"

export function execute() {
    const pathToProject = positionals()[0]

    if(pathToProject == undefined) {
        throw new OrigeenError("You did not provide a path to a project to import.", [
            "Provide the <pathToProject> after the command name."
        ])
    }
    
    importProject(pathToProject)
}