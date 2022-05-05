# flowify-component-azure-blob

[Flowify](https://flowify-docs.equinor.com/) componenet for downloading and uploading files from/to Azure Blob Storage

Set the following environmental variables

Variables denoted with * can be set by run arguments by setting them as lowercase
## Common settings
```
# Operation: upload or download *
export OPS=download

# Authentication method *
export AUTH_METHOD=app

# Blob Container name *
export CONTAINER_NAME

# Storage account name *
export ACCOUNT

# Auth. The service principal should have list read and write permission (e.g. Storage Blob data Contributor role)
export CLIENT_ID
export CLIENT_SECRET
export TENANT_ID
```
## Download
```
# File path to store the downloaded files *
export DOWNLOAD_PATH

# Only files under this directory in the Blob container (Optional) *
# If downloading one specific file, set it to the file path. Leave FILE_FILTER empty.
export DIR_FILTER

# Only files containing this string (Optional) *
export FILE_FILTER 
```
## Upload

```
# Path inside the Blob container to upload to *
export UPLOAD_PATH

# Local directory of the files to upload *
# If uploading one specific file, set it to the file path
export UPLOAD_FILES

# Rename upload file (Only when uploading a single file)*
export FILE_UPLOAD_NAME
```

## Log level
```
export LOG_LEVEL=4
```


