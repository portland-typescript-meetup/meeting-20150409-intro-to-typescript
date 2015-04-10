
interface IAPIProject {
    projectId: number;
    name: string;
    description: string;
    tasks: IAPIProjectTask[];
}

interface IAPIProjectTask {
    name: string;
    completed: boolean;
    hours: number;
}

interface API {
    getProjects(): IAPIProject[];
    saveProjects(projects: IAPIProject[]): void;
}

declare var api: API;
