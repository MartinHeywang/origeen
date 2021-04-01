import fs from "fs-extra"

import {PROJECTS} from "./paths"
export interface Project {
    name: string
    path: string
}

let _loadProjects = loadProjects()

function* loadProjects() {
    const projects = fs.readJSONSync(PROJECTS)

    while(true) {
        yield projects
    }
}

export function getProjects() {
    // We know the generator won't return void
    return _loadProjects.next().value as Project[]
}

function setProjects(projects: Project[]): void {
    fs.writeFileSync(PROJECTS, JSON.stringify(projects))
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
