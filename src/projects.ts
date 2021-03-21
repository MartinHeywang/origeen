import fs from "fs"
import path from "path"

const pathToProjects = path.join(__dirname, "..", "projects.json")
export interface Project {
    name: string;
    path: string;
}

export function getProjects(): Project[] {
    const file = fs.readFileSync(pathToProjects, "utf8");
    return JSON.parse(file);
}

function setProjects(projects: Project[]): void{
    fs.writeFileSync(pathToProjects, JSON.stringify(projects));
}

export function addProject(project: Project): void{
    const projects = [...getProjects(), project];
    setProjects(projects);
}