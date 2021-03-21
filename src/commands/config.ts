import { Arguments } from "yargs"

import { getConfig, setConfig } from "../config"
import * as logs from "../logs"

export function execute(args: Arguments) {
    const config = getConfig()

    const configName = args._[1]
    if (configName == undefined) {
        logs.log(1, JSON.stringify(config, null, 4))
        return
    }
    logs.log(0, `Provided config name : '${configName}'`)

    if (args.S == undefined && args.set == undefined) {
        logs.log(0, `Reading config '${configName}'`)
        if (config[configName] == undefined) {
            logs.log(1, `Config property '${configName}' is not defined yet`)
            return
        }
        logs.log(0, `Property '${configName}' found`)
        logs.log(
            1,
            `Value of '${configName}' is '${config[configName.toString()]}'`
        )
        return
    }

    logs.log(0, `Setting config ${configName}`)

    const newValue = args.S as string ?? args.set as string;
    logs.log(1, `Set '${configName}' to '${newValue}'`)
    config[configName] = newValue;
    setConfig(config);
}
