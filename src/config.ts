import fs from "fs-extra"
import { OrigeenError } from "./commands"
import { bash } from "./logs"

import { CONFIG } from "./paths"
export interface Config {
    [x: string]: string
}

function* loadConfig() {
    const { debug } = console

    const config: Config = fs.readJSONSync(CONFIG)
    debug("The config file has been loaded.")
    debug(JSON.stringify(config, undefined, 4))
    debug()
    debug(`Path: ${CONFIG}`)
    debug()

    while (true) {
        yield config
    }
}

let _loadConfig = loadConfig()

export function getConfig(): Config {
    // We know the generator won't return void
    return _loadConfig.next().value as Config
}

function setConfig(config: Config): void {
    fs.writeFileSync(CONFIG, JSON.stringify(config, undefined, 4))
    _loadConfig = loadConfig()
}

export function getProperty(property: string): string {
    const value = getConfig()[property]
    if (value == undefined) {
        throw new OrigeenError(
            `Origeen tried to access the config property '${property}'` +
                `, but its value resolved to undefined.`,
            [`Set it with: ${bash(`config ${property} --set <newValue>`)}`]
        )
    }
    return value;
}

export function setProperty(property: string, newValue: string) {
    const config = getConfig()

    config[property] = newValue
    setConfig(config)
}
