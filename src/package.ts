import fs from "fs"
import path from "path"

interface Package {
    name: string;
    version: string;
    description?: string;
    main: string;
    author?: string;
    license?: string;
    keywords?: string[];

    scripts?: {
        [x: string]: string
    };

    bin?: {
        ogy: string;
    };
    engines?: {
        node: string;
    };

    devDependencies?: {
        [x: string]: string
    };
    dependencies?: {
        [x: string]: string
    };
}

export function getPackageInfo(): Package {
    const pathToPackageInfo: string = path.join(__dirname, "..", "package.json");
    const file: string = fs.readFileSync(pathToPackageInfo, "utf8");
    const data: Package = JSON.parse(file);
    return data;
}