export type PutObjectInput = {
  buffer: Buffer;
  mimeType: string;
  prefix: "references" | "generated" | "templates";
  filename?: string;
};

export type StoredObject = {
  storageKey: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
  hash: string;
  width?: number;
  height?: number;
};

export type LoadedObject = {
  buffer: Buffer;
  mimeType: string;
  sizeBytes: number;
};

export type StorageProvider = {
  putObject(input: PutObjectInput): Promise<StoredObject>;
  getObject(storageKey: string): Promise<LoadedObject>;
  deleteObject(storageKey: string): Promise<void>;
  publicUrl(storageKey: string): string;
};
