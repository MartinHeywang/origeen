import path from "path"
import fs from "fs-extra"

// https://stackoverflow.com/a/26227660/13100860
export const HOME = path.join(
    process.env.APPDATA ||
        (process.platform === "darwin"
            ? `${process.env.HOME}/Library/Preferences`
            : process.env.HOME + "/.local/share"),
    "origeen"
)

export const CONFIG = path.join(HOME, "config.json")
export const PROJECTS = path.join(HOME, "projects.json")
export const TEMPLATES = path.join(HOME, "templates")
export const EMPTY_TEMPLATE = path.join(TEMPLATES, "@empty")

export const LICENSES = path.join(__dirname, "..", "licenses")

/**
 * Ensures that all the exported constants points to an existing and valid file/directory
 */
export function ensure() {
    console.debug("Origeen's home:")
    console.debug(HOME)
    console.debug()

    fs.ensureDirSync(HOME)
    if (!fs.existsSync(CONFIG)) fs.writeJsonSync(CONFIG, {})
    if (!fs.existsSync(PROJECTS)) fs.writeJsonSync(PROJECTS, [])

    fs.ensureDirSync(TEMPLATES)
    fs.emptyDirSync(EMPTY_TEMPLATE)
}
