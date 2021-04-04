import { Arguments } from "yargs"
import { OrigeenError } from "../commands"

import { getConfig, setProperty } from "../config"
import { h1, h3 } from "../logs"

export function execute(args: Arguments) {
    const { log, debug } = console

    const config = getConfig()

    const configName = args._[1]?.toString()
    if (configName == undefined) {
        log(JSON.stringify(config, null, 4))
        return
    }
    debug(`Provided config name : '${configName}'`)

    if (args.S == undefined && args.set == undefined) {
        h3("Read mode")
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

    const newValue = (args.S as string) ?? (args.set as string)
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
