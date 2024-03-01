export declare class Logger {
    protected cacheDir: string;
    protected getLogFile(timestamp?: string): string;
    constructor(module?: string);
    log(msg: string): void;
}
export declare function sign(content: string, secretKey: string): string;
export declare function verify(content: string, secretKey: string, signature: string): boolean;
export declare function getUUID(): string;
export declare function getHash(str: string): string;
export declare function ping(): Promise<{
    ip: any;
    lag: number;
}>;
export declare function getAnnouncement(): Promise<string>;
export declare function clearOutput(): void;
//# sourceMappingURL=util.d.ts.map