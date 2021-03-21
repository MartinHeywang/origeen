import { ask } from "stdio";
import { Arguments } from "yargs";

export async function execute(args: Arguments) {
    console.clear();
    console.log("Welcome to Ogy !\n");
    console.log("Ogy is a projects manager that helps you manage your projects in your everyday life.")
    console.log("Let's start the configuration; you'll do it once, but you won't regret it !");
    console.log("Note: All the settings defined here can be changed at any time.\n")
    console.log(
        `The project folder is the default place for all your projects. You can consider it as your workspace.\n`
    );

    const projectsFolder = await ask("Workspace location ?");
    console.log("You entered :"+projectsFolder);
}
