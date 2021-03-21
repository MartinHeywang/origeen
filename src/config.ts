import fs from "fs";
import path from "path";

const pathToConfig = path.join(__dirname, "..", "config.json");

export interface Config {
    [x: string]: string;
}

export function getConfig(): Config {
    const config: Config = JSON.parse(
        fs.readFileSync(pathToConfig, "utf8")
    );
    return config;
}

export function setConfig(config: Config): void {
    fs.writeFileSync(pathToConfig, JSON.stringify(config));
}