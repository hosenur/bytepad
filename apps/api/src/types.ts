export type PlaygroundTemplateType = {
    id: number;
    name: string;
    description: string;
    image: string;
    framework: FrameworkType;
};
export type PlaygroundType = {
    id: number;
    name: string;
    framework: FrameworkType;
    owner: string;
    createdAt: string;
    PlaygroundMember: {
        role: string;
        userId: string;
    }
}
export enum FrameworkType {
    REACT = "REACT",
    VUE = "VUE",
    NEXTAPP = "NEXTAPP",
    NEXTPAGE = "NEXTPAGE"
}
