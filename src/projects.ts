import fs from "fs"
import path from "path"

const pathToProjects = path.join(__dirname, "..", "projects.json")
export interface Project {
    name: string
    path: string
}

const _loadProjects = loadProjects()

function* loadProjects() {
    const file = fs.readFileSync(pathToProjects, "utf8")
    const projects: Project[] = JSON.parse(file)
    while (true) {
        yield projects
    }
}

export function getProjects() {
    // We know the generator won't return void
    return _loadProjects.next().value as Project[]
}

function setProjects(projects: Project[]): void {
    fs.writeFileSync(pathToProjects, JSON.stringify(projects))
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
