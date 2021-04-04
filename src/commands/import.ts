import { Arguments } from "yargs"
import { OrigeenError } from "../commands"
import { importProject } from "../projects"

export function execute(args: Arguments) {
    const pathToProject = args._[1]?.toString()

    if(pathToProject == undefined) {
        throw new OrigeenError("You did not provide a path to a project to import.", [
            "Provide the <pathToProject> after the command name."
        ])
    }
    
    importProject(pathToProject)
}