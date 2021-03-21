import fs from "fs"
import path from "path"

export interface Project {
    name: string;
    path: string;
}

export function getProjects(){
    const file = fs.readFileSync(path.join(__dirname, "..", "projects.json"), "utf8");
    const data: Project[] = JSON.parse(file);
    return data;
}