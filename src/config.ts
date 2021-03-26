import fs from "fs-extra"
import path from "path"

export const pathToConfig = path.join(process.env.HOME as string, "origeen", "config.json")

export interface Config {
    [x: string]: string
}

function* loadConfig() {
    const {debug} = console

    const config: Config = fs.readJSONSync(pathToConfig)
    debug("The config file has been loaded.")
    debug(JSON.stringify(config, undefined, 4))
    debug()
    debug(`Path: ${pathToConfig}`)
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
    fs.writeFileSync(pathToConfig, JSON.stringify(config))
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
