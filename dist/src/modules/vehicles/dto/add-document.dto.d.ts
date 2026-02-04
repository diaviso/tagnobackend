export declare enum DocumentType {
    INSURANCE = "INSURANCE",
    REGISTRATION = "REGISTRATION",
    TECHNICAL_VISIT = "TECHNICAL_VISIT"
}
export declare class AddDocumentDto {
    type: DocumentType;
    fileUrl: string;
}
