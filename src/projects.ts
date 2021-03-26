import fs from "fs-extra"
import path from "path"

export const pathToProjects = path.join(process.env.HOME as string, "origeen", "projects.json")
export interface Project {
    name: string
    path: string
}

let _loadProjects = loadProjects()

function* loadProjects() {
    const projects = fs.readJSONSync(pathToProjects)

    while(true) {
        yield projects
    }
}

export function getProjects() {
    // We know the generator won't return void
    return _loadProjects.next().value as Project[]
}

function setProjects(projects: Project[]): void {
    fs.writeFileSync(pathToProjects, JSON.stringify(projects))
    // Re-create the generator to make sure the last version of projects.json is used
    _loadProjects = loadProjects()
}

export function addProject(newProject: Project): void {
    const oldProjects = getProjects()
    const updatedProjects = [...oldProjects, newProject]
    setProjects(updatedProjects)
}

export function deleteProject(project: Project): void {
    const updatedProjects = getProjects().filter((pjct) => pjct.name !== project.name)
    setProjects(updatedProjects)
}
