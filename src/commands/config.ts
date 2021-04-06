 
import { flags, positionals } from "../cli"
import { OrigeenError } from "../commands"

import { getConfig, setProperty } from "../config"
import { h1, h3 } from "../logs"

export function execute() {
    const { log, debug } = console

    const config = getConfig()

    const configName = positionals()[0]
    const inputFlags = flags()
    
    if (configName == undefined) {
        log(JSON.stringify(config, null, 4))
        return
    }
    debug(`Provided config name : '${configName}'`)

    if (inputFlags.set == undefined) {
        debug(`Reading config '${configName}'`)
        if (config[configName] == undefined) {
            log(`Config property '${configName}' is not defined yet`)
            return
        }
        debug(`Property '${configName}' found`)
        log(`Value of '${configName}' is '${config[configName.toString()]}'`)
        return
    }

    h1("Write mode")
    debug(`Setting config ${configName}`)

    const newValue = inputFlags.set
    if(typeof newValue !== "string") {
        throw new OrigeenError("You put the '--set' flag, but did not give any value.", [
            "Insert a value after the '--set' flag",
            "Remove the '--set' flag",
            "Check that the given value is of type string."
        ])
    }
    setProperty(configName, newValue)
    log(`Set '${configName}' to '${newValue}'`)
}
