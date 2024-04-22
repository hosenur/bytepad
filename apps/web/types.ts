export type PlaygroundTemplateType = {
    id: number;
    name: string;
    description: string;
    framework: FrameworkType;
};
export type PlaygroundType = {
    id: number;
    tag: string;
    framework: FrameworkType;
    owner: string;
    createdAt: string;
    running: boolean;
    PlaygroundMember: {
        role: string;
        userId: string;
    }
}
export enum FrameworkType {
    REACT = "REACT",
    VUE = "VUE",
    NEXTAPP = "NEXTAPP",
    NEXTPAGE = "NEXTPAGE",
    NUXT = "NUXT",
    SVELTE = "SVELTE",
}