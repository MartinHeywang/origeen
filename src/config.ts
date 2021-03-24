import fs from "fs";
import path from "path";

const pathToConfig = path.join(__dirname, "..", "config.json");

export interface Config {
    [x: string]: string;
}

function* loadConfig() {
    const config: Config = JSON.parse(fs.readFileSync(pathToConfig, "utf8"))

    while(true) {
        yield config
    }
}

const _loadConfig = loadConfig()

export function getConfig(): Config {
    // We know the generator won't return void
    return _loadConfig.next().value as Config
}

function setConfig(config: Config): void {
    fs.writeFileSync(pathToConfig, JSON.stringify(config));
}

export function getProperty(property: string) {
    return getConfig()[property]
}

export function setProperty(property: string, newValue: string) {
    const config = getConfig()

    config[property] = newValue
    setConfig(config)
}