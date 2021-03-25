import { Arguments } from "yargs"
import fs from "fs-extra"
import path from "path"

import {addProject} from "../projects"

import {h1} from "../logs"

export function execute(args: Arguments) {
    const {error, log, debug} = console

    h1("Project import")
        
    const pathToProject = args._[1]?.toString()
    if(pathToProject == undefined) {
        error("You did not provide a path to a folder")
    }
    debug("Path to project root: ")
    debug(pathToProject)
    debug()
    if(!fs.existsSync(pathToProject)){
        error("You did provide a path, but this one doesn't exist")
        error("Check the spelling.")
    }
    debug("Given path does exist")

    const projectName = path.basename(pathToProject)

    log(`Project Name : ${projectName}`)
    log(`Path to project : ${pathToProject}`)
    log()

    addProject({name: projectName, path: pathToProject})
}