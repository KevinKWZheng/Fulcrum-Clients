import { DataManager } from "./base/base";
export declare class ConversationManager extends DataManager {
    constructor(username?: string, password?: string);
    get(conversationId: string): Promise<Conversation>;
    download(conversationIds: string[]): Promise<string[]>;
    listInfo(conversationIds: string[]): Promise<string>;
}
//# sourceMappingURL=conversations.d.ts.map