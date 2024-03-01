import { Logger } from "../util";
export declare class UserManager {
    protected logger: Logger;
    protected username: string;
    protected secretKey: string;
    protected assistantIds: string[];
    protected conversationIds: string[];
    protected invoiceIds: string[];
    protected currAssistant: string;
    protected currConversation: string;
    protected balance: number;
    protected credentials: {
        username: string;
        secretKey: string;
    };
    constructor();
    getUsername(): string;
    getBalance(): number;
    getCurrConversation(): string;
    getCurrAssistant(): string;
    login(username: string, password: string): Promise<{
        status: boolean;
        errMsg: string;
    }>;
    setCurrConversation(conversationId: string): boolean;
    setCurrAssistant(assistantId: string): boolean;
    sendMessage(message: string): Promise<{
        status: boolean;
        message: string;
        content?: undefined;
    } | {
        status: boolean;
        content: {
            message: string;
            conversationId: string;
            conversation: Conversation;
            assistantId: string;
        };
        message?: undefined;
    }>;
    register(username: string, password: string, email: string, token: string): Promise<{
        status: boolean;
        errMsg: string;
    }>;
    listAssistantIds(): string[];
    listConversationIds(): string[];
    listInvoiceIds(): string[];
    sync(): Promise<boolean | undefined>;
    isLoggedIn(): boolean;
    recharge(token: string): Promise<{
        status: boolean;
        msg: any;
    }>;
}
//# sourceMappingURL=user.d.ts.map