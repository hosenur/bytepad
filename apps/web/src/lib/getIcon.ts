const BASE = "https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/main/icons/"
export function getIcon(fileName:string) {
    const cache = new Map<string, string>();
    cache.set("js", BASE + "javascript.svg");
    cache.set("jsx", BASE + "react.svg");
    cache.set("ts", BASE + "typescript.svg");
    cache.set("tsx", BASE + "react_ts.svg");
    cache.set("css", BASE + "css.svg");
    cache.set("json", BASE + "json.svg");
    cache.set("html", BASE + "html.svg");
    cache.set("png", BASE + "image.svg");
    cache.set("jpg", BASE + "image.svg");
    cache.set("ico", BASE + "image.svg");
    cache.set("txt", BASE + "text.svg");
    cache.set("md", BASE + "markdown.svg");
    cache.set("lockb", BASE + "bun.svg");
    cache.set("gitignore", BASE + "git.svg");
    cache.set("cjs", BASE + "javascript.svg");
    cache.set("mjs", BASE + "javascript.svg");
    cache.set("lock", BASE + "lock.svg");
    cache.set("yml", BASE + "yaml.svg");
    cache.set("src", BASE + "folder-src.svg");
    cache.set("node_modules", BASE + "folder-node.svg");
    cache.set("public", BASE + "folder-public.svg");
    cache.set("svg", BASE + "svg.svg");
    cache.set("assets", BASE + "folder-resource.svg");
    cache.set("app", BASE + "folder-app.svg");
    cache.set("openDirectory", BASE + "folder_open.svg");
    cache.set("openDirectory", BASE + "folder_open.svg");
    cache.set("openDirectory", BASE + "folder_open.svg");
    cache.set("openDirectory", BASE + "folder_open.svg");
    cache.set("openDirectory", BASE + "folder_open.svg");
    //check if filename exists then retutn that , then check for extension
    if(fileName){
        const file = cache.get(fileName);
        if(file) return file;
    }
    const extension = fileName.split('.').pop();
    if(extension){
        const file = cache.get(extension);
        if(file) return file;
    }
    return BASE + "default_file.svg";

}
