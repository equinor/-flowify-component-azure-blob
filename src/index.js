
import { azListBlobs, azDownloadBlobs, azUploadBlobs } from './azblob.js'
import {ClientSecretCredential} from '@azure/identity'
import { BlobServiceClient } from '@azure/storage-blob'
import { parse } from './args.js'
import * as log from './log.js'

async function main() {
    parse();
    const authMethod = process.env.AUTH_METHOD;
    log.info(`Authenticating using ${authMethod}`)
    let containerClient;

    switch (authMethod) {
        case 'app':
            const credentials = new ClientSecretCredential(process.env.TENANT_ID,process.env.CLIENT_ID,process.env.CLIENT_SECRET)
            const blobClient = new BlobServiceClient(`https://${process.env.ACCOUNT}.blob.core.windows.net`,credentials)
            containerClient = blobClient.getContainerClient(process.env.CONTAINER_NAME)
            break;
        default:
            throw new Error(`Invalid authentication method ${authMethod}`);
    }

    const operation = process.env.OPS;

    log.info(`${operation} files`)
    switch (operation) {
        case 'download':
            log.info('listing file to download');
            const dirFilter = process.env.DIR_FILTER ? process.env.DIR_FILTER : null;
            const fileFilter = process.env.FILE_FILTER ? process.env.FILE_FILTER : null;
            const filesToDownload = await azListBlobs(containerClient, fileFilter, dirFilter);

            log.info(`Start downloading ${filesToDownload.length} files`);
            await azDownloadBlobs(containerClient, filesToDownload, process.env.DOWNLOAD_PATH);
            break;
        case 'upload':
            const uploadPath = process.env.UPLOAD_PATH ? process.env.UPLOAD_PATH : null;
            await azUploadBlobs(containerClient, process.env.UPLOAD_FILES, uploadPath)
            break;
        default:
            throw new Error(`Invalid operation ${operation}`);
    }
}

await main()










