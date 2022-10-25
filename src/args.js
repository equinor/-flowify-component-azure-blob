

export function parse() {
  let args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    let arg = args[i].split('=');
    switch (arg[0]) {
      case 'auth_method':
        process.env.AUTH_METHOD = arg.slice(1,);
        break;
      case 'container_name':
        process.env.CONTAINER_NAME = arg.slice(1,);
        break;
      case 'account':
        process.env.ACCOUNT = arg.slice(1,);
        break;
      case 'ops':
        process.env.OPS = arg.slice(1,);
        break;
      case 'download_path':
        process.env.DOWNLOAD_PATH = arg.slice(1,);
        break;
      case 'dir_filter':
        process.env.DIR_FILTER = arg.slice(1,);
        break;
      case 'file_filter':
        process.env.FILE_FILTER = arg.slice(1,);
        break;
      case 'upload_path':
        process.env.UPLOAD_PATH = arg.slice(1,);
        break;
      case 'upload_files':
        process.env.UPLOAD_FILES = arg.slice(1,);
        break;
      case 'file_upload_name':
        process.env.FILE_UPLOAD_NAME =arg.slice(1,);
      default:
    }
  }

}
