import fs from "fs-extra"

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
    fs.writeFileSync(CONFIG, JSON.stringify(config))
    _loadConfig = loadConfig()
}

export function getProperty(property: string) {
    return getConfig()[property]
}

export function setProperty(property: string, newValue: string) {
    const config = getConfig()

    config[property] = newValue
    setConfig(config)
}
