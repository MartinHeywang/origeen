import { Arguments } from "yargs"

import { getConfig, setConfig } from "../config"
import { h1 } from "../logs"

export function execute(args: Arguments) {
    const { log } = console

    const config = getConfig()

    const configName = args._[1]
    if (configName == undefined) {
        log(1, JSON.stringify(config, null, 4))
        return
    }
    log(0, `Provided config name : '${configName}'`)

    if (args.S == undefined && args.set == undefined) {
        h1("Read mode")
        log(0, `Reading config '${configName}'`)
        if (config[configName] == undefined) {
            log(1, `Config property '${configName}' is not defined yet`)
            return
        }
        log(0, `Property '${configName}' found`)
        log(1, `Value of '${configName}' is '${config[configName.toString()]}'`)
        return
    }

    h1("Write mode")
    log(0, `Setting config ${configName}`)

    const newValue = (args.S as string) ?? (args.set as string)
    log(1, `Set '${configName}' to '${newValue}'`)
    config[configName] = newValue
    setConfig(config)
}
