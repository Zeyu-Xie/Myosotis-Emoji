import os
import hashlib
import mimetypes


def calculate_md5(file_path):
    md5_hash = hashlib.md5()
    with open(file_path, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            md5_hash.update(chunk)
    return md5_hash.hexdigest()


def get_file_type(file_path):
    """
    Extension | `mime_type`
    -----------------------
    avif      | image/avif
    bmp       | image/bmp
    gif       | image/gif
    heic      | image/heic
    heif      | image/heif
    ico       | image/x-icon
    jpg, jpeg | image/jpeg
    png       | image/png
    svg       | image/svg+xml
    tiff      | image/tiff
    webp      | image/webp
    """
    file_type_dict = {
        "avif": "avif",
        "bmp": "bmp",
        "gif": "gif",
        "heic": "heic",
        "heif": "heif",
        "x-icon": "ico",
        "jpeg": "jpeg",
        "png": "png",
        "svg+xml": "svg",
        "tiff": "tiff",
        "webp": "webp",
    }
    mime_type, _ = mimetypes.guess_type(file_path)
    if mime_type is None:
        raise TypeError(f"Type of file {file_path} is unknown")
    file_class, file_type = mime_type.split("/")
    if file_class != "image":
        raise TypeError(f"File {file_path} is not an image")
    if file_type not in file_type_dict:
        raise TypeError(f"Unsupported file type {file_type}: {file_path}")
    return file_class, file_type_dict[file_type]


def rename_to_md5(file_path):
    if not os.path.isfile(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")
    file_dir = os.path.dirname(file_path)
    _, file_type = get_file_type(file_path)
    file_md5 = calculate_md5(file_path)
    new_file_name = f"{file_md5}.{file_type}"
    new_file_path = os.path.join(file_dir, new_file_name)
    os.rename(file_path, new_file_path)

def rename_to_md5_recursive(dir_path):
    if not os.path.isdir(dir_path):
        raise NotADirectoryError(f"Directory not found: {dir_path}")
    for root, _, files in os.walk(dir_path):
        for file_name in files:
            file_path = os.path.join(root, file_name)
            try:
                rename_to_md5(file_path)
            except Exception as e:
                print(f"Error at {file_path}: {e}")

if __name__ == "__main__":

    rename_to_md5_recursive("./data")