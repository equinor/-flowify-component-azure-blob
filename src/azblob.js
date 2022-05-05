import readdirp from 'readdirp';
import { mkdirSync, existsSync, statSync } from 'fs'
import * as path from 'path';
import * as log from './log.js'

async function azListBlobs(containerClient, fileFilter, dirFilter) {

    let blobList = [];
    for await (const blob of containerClient.listBlobsFlat()) {
        blobList.push(blob.name);
    }
    if (blobList.length === 0) {
        throw new Error(`Container ${containerClient.containerName} has no file`);
    } else {
        if (typeof (dirFilter) === 'string') {
            log.info(`Filter files under directory ${dirFilter}`);
            dirFilter = dirFilter.replace(path.win32.sep, path.posix.sep);
            dirFilter = dirFilter.endsWith(path.posix.sep) ? dirFilter.slice(0, -1) : dirFilter;
            blobList = blobList.filter(blobName => blobName.toLowerCase().startsWith(dirFilter.toLowerCase()));
        };
        if (typeof (fileFilter) === 'string') {
            log.info(`Filter files containing ${fileFilter}`)
            let dirLength = dirFilter ? dirFilter.length : 0;
            blobList = blobList.filter(blob => blob.slice(dirLength).toLowerCase().includes(fileFilter.toLowerCase()));
        };
        log.info(`Number of files to download ${blobList.length}`);
    }
    if (blobList.length === 0) {
        throw new Error('No file to download');
    }
    return blobList;
}

async function azDownloadBlobs(containerClient, downloadList, downloadPath) {

    downloadPath = path.normalize(downloadPath);
    const downloadPathSep = downloadPath.endsWith(path.sep) ? downloadPath : `${downloadPath}${path.sep}`;
    await Promise.all(downloadList.map(async (file) => {
        if (file.includes(path.posix.sep)) {
            //create dir to keep dir structure
            let lastSep = file.lastIndexOf(path.posix.sep);
            let dir = file.slice(0, lastSep);
            dir = `${downloadPathSep}${dir}`

            if (!existsSync(dir)) {
                mkdirSync(dir, { recursive: true });
            }
        }
        const downloadFilePath = path.normalize(`${downloadPathSep}${file}`);

        const blockClient = containerClient.getBlockBlobClient(file);
        await blockClient.downloadToFile(downloadFilePath)
        log.info(`Downloaded ${file} to ${downloadPathSep}`);
    }));
    return
}
async function listFiles(path, fileFilters) {
    const isFile = statSync(path).isFile();
    let filesToUpload
    if (!isFile) {
        const config = fileFilters ? { type: 'files', fileFilter: fileFilters } : { type: 'files' };
        filesToUpload = await readdirp.promise(path, config);
    } else {
        if (path.split(path.sep).length > 1) {
            filesToUpload = [{
                basename: path.split(path.sep)[-1],
                path: path.split(path.sep)[-1],
                fullPath: path
            }]
        } else {
            filesToUpload = [{
                basename: path,
                path: path,
                fullPath: path
            }]
        }
    }
    return filesToUpload
}

async function azUploadBlobs(containerClient, filesPath, uploadPath) {
    const dirToUploadPosix = filesPath.replace(path.win32.sep, path.posix.sep);
    //const dirToUpload = dirToUploadPosix.endsWith(path.posix.sep) ? dirToUploadPosix.slice(0,-1) : dirToUploadPosix;
    const filesToUpload = await listFiles(dirToUploadPosix, null);
    console.log(filesToUpload.map(file => file.fullPath))
    if (filesToUpload.length === 0) {
        log.warning('No files to upload')
    } else {
        log.info(`Uploading ${filesToUpload.length} files`)
        await Promise.all(filesToUpload.map(async (file) => {
            const uploadPathPosix = uploadPath ? uploadPath.split(path.sep).join(path.posix.sep) : null;
            let fullUploadFilePath = file.path;
            if (uploadPathPosix) {
                fullUploadFilePath = uploadPathPosix.endsWith(path.posix.sep) ? `${uploadPathPosix}${fullUploadFilePath}` : `${uploadPathPosix}${path.posix.sep}${fullUploadFilePath}`;
            };
            if (process.env.FILE_UPLOAD_NAME && filesToUpload.length==1){
                fullUploadFilePath = uploadPathPosix? `${uploadPathPosix}/${process.env.FILE_UPLOAD_NAME}` : process.env.FILE_UPLOAD_NAME
            }
            const blockClient = containerClient.getBlockBlobClient(fullUploadFilePath);
            await blockClient.uploadFile(file.fullPath)

            log.info(`Uploaded ${file.basename} >>> ${fullUploadFilePath}`);
        }));
    }
    return
}


// glob(dirToUpload + '/**/*', (res)=>{console.log(res)})

// function getDirectories(src, callback) {
//     glob(src + '/**/*', callback);
//   };
//   getDirectories('test', function (err, res) {
//     if (err) {
//       console.log('Error', err);
//     } else {
//       console.log(res);
//     }
//   });

export { azListBlobs, azDownloadBlobs, azUploadBlobs }