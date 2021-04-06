 

import { openProject } from "../projects"
import { OrigeenError } from "../commands"
import { positionals } from "../cli"

export function execute(): void {
    const projectName: string = positionals()[0]
    
    if (projectName == undefined) {
        throw new OrigeenError("In order to open a project, you need to provide its name.", [
            "Provide '<projectName>' after the command name",
        ])
    }

    openProject(projectName)
}
