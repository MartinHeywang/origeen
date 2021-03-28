import path from "path"
import fs from "fs-extra"

export const HOME = path.join(process.env.HOME as string, "origeen")
export const CONFIG = path.join(HOME, "config.json")
export const PROJECTS = path.join(HOME, "projects.json")
export const TEMPLATES = path.join(HOME, "templates")
export const EMPTY_TEMPLATE = path.join(TEMPLATES, "@empty")

/**
 * Ensures that all the exported constants points to an existing and valid file/directory
 */
export function ensure() {
    fs.ensureDirSync(HOME)
    if (!fs.existsSync(CONFIG)) fs.writeJsonSync(CONFIG, {})
    if (!fs.existsSync(PROJECTS)) fs.writeJsonSync(PROJECTS, [])

    fs.ensureDirSync(TEMPLATES)
    fs.emptyDirSync(EMPTY_TEMPLATE)
}
