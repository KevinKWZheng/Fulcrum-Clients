import { Logger } from "../../util";
export declare class DataManager {
    protected readonly cacheDir: string;
    protected readonly credentials: {
        username: string;
        secretKey: string;
    };
    protected logger: Logger;
    constructor(module: string, username?: string, password?: string);
    setCredentials(username?: string, password?: string): void;
}
//# sourceMappingURL=base.d.ts.map