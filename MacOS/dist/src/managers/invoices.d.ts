import { DataManager } from "./base/base";
export declare class InvoiceManager extends DataManager {
    constructor(username?: string, password?: string);
    get(invoiceId: string): Promise<Invoice>;
    download(invoiceIds: string[]): Promise<string[]>;
    export(invoiceIds: string[], saveToFile: boolean): Promise<string>;
}
//# sourceMappingURL=invoices.d.ts.map