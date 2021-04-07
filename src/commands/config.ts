import { flags, positionals } from "../cli"
import { Command } from "../commandUtils"
import { OrigeenError } from "../errors"

import { getConfig, setProperty } from "../configUtils"
import { h1, h3 } from "../logUtils"

const descriptor: Command = {
    name: "config",
    description: "Get/Set values in the config file",
    run: async () => execute(),
    alias: [],

    positionals: [
        {
            name: "configName",
            desc: "The name of the config you want to get the value",
            required: false,
        },
    ],
    options: {
        set: {
            desc:
                "The new value for the property. Has an effect only if you provide a config name.",
            required: (flags) => {
                return flags.get == undefined
            },
            alias: ["s"],
        },
    },
}

function execute() {
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
    if (typeof newValue !== "string") {
        throw new OrigeenError(
            "You put the '--set' flag, but did not give any value.",
            [
                "Insert a value after the '--set' flag",
                "Remove the '--set' flag",
                "Check that the given value is of type string.",
            ]
        )
    }
    setProperty(configName, newValue)
    log(`Set '${configName}' to '${newValue}'`)
}

export default { descriptor }
