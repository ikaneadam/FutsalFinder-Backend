export type keyValuePair<T> = { [key: string]: T };

export type multerImage = {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    destination: string;
    filename: string;
    path: string;
};
