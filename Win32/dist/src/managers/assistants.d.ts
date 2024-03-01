import { DataManager } from "./base/base";
export declare class AssistantManager extends DataManager {
    protected Names: Map<string, string>;
    protected Ids: Map<string, string>;
    constructor(username?: string, password?: string);
    get(assistantId: string): Promise<AssistantInfo>;
    getName(assistantId: string): string | undefined;
    getId(name: string): string | undefined;
    download(assistantIds: string[]): Promise<string[]>;
}
//# sourceMappingURL=assistants.d.ts.map