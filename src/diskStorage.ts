import multer from "multer";

export default class DiskStorage {
  private fileStoragePath = process.cwd() + "/fileStorage/";
  private diskStorage: multer.StorageEngine | null = null;
  public maxFileSize = 2 * 1024 * 1024 * 1024;

  public getDiskStorage(): multer.StorageEngine {
    if (this.diskStorage !== null) {
      return this.diskStorage
    }

    this.diskStorage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, this.fileStoragePath)
      },

      filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now()+'.'+file.mimetype.split('/')[1]);
      },
    })

    return this.getDiskStorage()
  }
}
