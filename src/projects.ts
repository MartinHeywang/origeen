import fs from "fs-extra"
import path from "path"
import { getConfig, getProperty } from "./config"

import { EMPTY_TEMPLATE, LICENSES, PROJECTS, TEMPLATES } from "./paths"
import { OrigeenError } from "./commands"
import { ask, bash, booleanValidator } from "./logs"
import { execFileSync } from "child_process"
import { replaceVariable } from "./licenses"
export interface Project {
    name: string
    path: string
    license?: string

    createdAt?: number
    importedAt?: number
    lastOpenedAt: number

    openings: number
}

let _loadProjects = loadProjects()

function* loadProjects() {
    const projects = fs.readJSONSync(PROJECTS)

    while (true) {
        yield projects
    }
}

function setProjects(projects: Project[]): void {
    fs.writeFileSync(PROJECTS, JSON.stringify(projects, undefined, 4))
    // Re-create the generator to make sure the last version of projects.json is used
    _loadProjects = loadProjects()
}

function addProject(newProject: Project): void {
    const updatedProjects = [...getProjects(), newProject]
    setProjects(updatedProjects)
}

function updateProject(project: Project): void {
    removeProject(project.name)
    addProject(project)
}

function removeProject(projectName: string) {
    const updatedProjects = getProjects().filter(
        (project) => project.name !== projectName
    )
    setProjects(updatedProjects)
}

export function getProjects() {
    // We know the generator won't return void
    return _loadProjects.next().value as Project[]
}

export function projectExists(projectName: string) {
    return getProjects().some((project) => project.name === projectName)
}

export function isValidName(projectName: string): boolean {
    const regex = new RegExp(`^[a-zA-Z0-9_\\.\\-]+$`)

    if (!projectName.match(regex)) return false
    return true
}

export function getProject(projectName: string): Project {
    const project = getProjects().find(
        (project) => project.name === projectName
    )
    if (project == undefined) {
        throw new OrigeenError(
            `A project named: ${projectName} was not found.`,
            [
                "Check the spelling",
                `List all your projects: ${bash("projects")}`,
            ]
        )
    }
    return project
}

function isSubProject(pathToProject: string) {
    getProjects().forEach(({ path }) => {
        if (path.includes(pathToProject) || pathToProject.includes(path)) {
            return true
        }
    })
    return false
}

function isSupportedLicense(licenseName: string) {
    if (licenseName.startsWith("@")) {
        return false
    }
    const exists = fs.existsSync(
        path.join(__dirname, "..", "licenses", `${licenseName}.md`)
    )
    return exists
}

export function createProject(
    projectName: string,
    templateName = EMPTY_TEMPLATE,
    licenseName = "ISC"
) {
    const { debug, log } = console

    log("Creating a project")
    log()
    log(`Name: ${projectName}`)
    log(`Template: ${templateName}`)
    log()

    if (!isValidName(projectName)) {
        throw new OrigeenError("The project name is not valid.", [
            "Check that it is alpha-numerical. (it can still contain '-', '.', '_')",
        ])
    }

    if (projectExists(projectName)) {
        throw new OrigeenError(
            `You can't create two projects with the name. '${projectName}' is already used.`,
            [
                "Choose another name",
                "Check the spelling",
                "Delete the existing project",
            ]
        )
    }

    const pathToProject = path.resolve(getProperty("workspace"), projectName)
    debug(`Absolute path to project:`)
    debug(pathToProject)
    debug()

    if (fs.existsSync(pathToProject)) {
        throw new OrigeenError(
            "It looks like a folder already exists at:\n" +
                `${pathToProject}\n` +
                `\n` +
                `Did you mean to import it?`,
            [
                "Import/register the project into Origeen instead of creating it",
                "Delete the existing folder",
            ]
        )
    }

    if (isSubProject(pathToProject)) {
        throw new OrigeenError(
            `Origeen doesn't support sub-projects\n` +
                `The given path '${pathToProject}' relates\nsomehow to '${path}' in a unsupported way.\n` +
                `Such a project structure would cause inconvenience.`,
            [
                "Check the spelling of the path",
                "Think of another location for the project",
                "Delete the other project",
            ]
        )
    }

    if (!isSupportedLicense(licenseName)) {
        throw new OrigeenError(
            `The name of the license you gave is not supported by Origeen`,
            [
                "Choose another license",
                `Wait for the '${licenseName}' license to be added. (you should open an issue in this case)`,
            ]
        )
    }

    const templatePath = path.join(TEMPLATES, templateName)
    debug("Absolute path to template:")
    debug(templatePath)
    debug()

    debug(`Copying template to the project destination`)
    fs.copySync(templatePath, pathToProject)
    debug(`Copied!`)
    debug()

    debug(`Copying license to project root`)

    const name = getConfig().userName;
    let license = fs.readFileSync(path.join(LICENSES, `${licenseName}.md`), "utf-8")
    license = replaceVariable("name", name, license);
    license = replaceVariable("year", new Date().getFullYear().toString(), license);

    fs.writeFileSync(path.join(pathToProject, `LICENSE`), license);

    debug("Done!")

    debug(`Adding new project to 'projects.json'`)
    addProject({
        name: projectName,
        path: pathToProject,
        createdAt: Date.now(),
        importedAt: -1,
        lastOpenedAt: -1,
        openings: 0,
        license: licenseName,
    })
    debug(`Added!`)
    debug()
}

export function openProject(projectName: string) {
    const { debug, log } = console

    const editorPath = getProperty("editorPath")
    const project = getProject(projectName)

    log(`Opening project named: ${projectName}`)
    log()
    log("Path to project:")
    log(project.path)
    log()
    debug("Path to editor")
    debug(editorPath)
    debug()

    try {
        execFileSync(editorPath, [project.path], { encoding: "utf8" })
    } catch (error) {
        throw new OrigeenError(
            `Origeen tried to run your favourite code editor\n` +
                `$ "${editorPath}" "${project.path}"\n` +
                `\n` +
                `However, an error occured.`,
            ["Run the command manually", "Check the path to your editor"]
        )
    }

    project.openings++
    project.lastOpenedAt = Date.now()
    updateProject(project)
}

export function importProject(pathToProject: string) {
    const { log } = console

    if (!path.isAbsolute(pathToProject)) {
        throw new OrigeenError(
            "You need to provide the absolute path to the project you're importing.",
            ["Re-run the command, but provide an absolute path"]
        )
    }

    if (!fs.existsSync(pathToProject)) {
        throw new OrigeenError(
            "The path you provided doesn't exist on your machine.",
            [
                "Check the spelling",
                "Use an absolute path to the project you're importing, if that's not already the case.",
            ]
        )
    }

    if (isSubProject(pathToProject)) {
        throw new OrigeenError(
            `Origeen doesn't support sub-projects\n` +
                `The given path '${pathToProject}' relates\nsomehow to '${path}' in a unsupported way.\n` +
                `Such a project structure would cause inconvenience.`,
            [
                "Check the spelling of the path",
                "Think of another location for the project",
                "Delete the other project",
            ]
        )
    }

    const projectName = path.basename(pathToProject)

    log("Importing a project...")
    log(`Name: ${projectName}`)
    log(`Path: ${pathToProject}`)
    log()

    addProject({
        name: path.basename(pathToProject),
        path: pathToProject,
        createdAt: -1,
        importedAt: Date.now(),
        lastOpenedAt: -1,
        openings: 0,
    })
}

export async function deleteProject(projectName: string) {
    const { log, warn, debug, group, groupEnd } = console
    const project = getProject(projectName)

    log("Deleting a project...")
    log(`Name: ${project.name}`)
    log(`Path: ${project.path}`)
    log()

    warn("You are about to delete a project!")
    warn("You can't go back.")
    warn()
    warn("This will:")
    group()
    warn("- Delete the project recursively")
    warn("- Unregister it from Origeen")
    warn()
    groupEnd()

    const verification = await ask("Are you sure? ", booleanValidator)
    const notSoSure =
        verification.toLowerCase() === "n" ||
        verification.toLowerCase() === "no"
            ? true
            : false

    if (notSoSure) {
        throw new OrigeenError("Project deletion cancelled.", [
            "Re-run the command, but be sure you wan't to delete this project.",
        ])
    }

    debug("Deleting content on the disk...")

    fs.rmdirSync(project.path, { recursive: true })

    debug("Deleted!")
    debug("Unregistering the project from Origeen...")

    removeProject(projectName)

    debug("Unregistered!")
}
