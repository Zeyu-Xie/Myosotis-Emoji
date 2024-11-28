import os
import subprocess
from datetime import datetime
from PIL import Image

number = 0
success_number = 0
error_number = 0

def is_special_file(basename, ext):

    special_ext_list = [".DS_Store"]
    if not ext.startswith("."):
        return True
    if ext in special_ext_list:
        return True
    return False

def heic_to_png(image_path):
    dirname = os.path.dirname(image_path)
    basename = os.path.basename(image_path)
    basename_without_ext = os.path.splitext(basename)[0]
    subprocess.run(f"heif-convert {image_path} {os.path.join(dirname, basename_without_ext+'.png')}", shell=True)
    os.remove(image_path)

def jpg_to_png(image_path):
    dirname = os.path.dirname(image_path)
    basename = os.path.basename(image_path)
    basename_without_ext = os.path.splitext(basename)[0]
    ext = os.path.splitext(basename)[-1]
    im = Image.open(image_path)
    im.save(os.path.join(dirname, basename_without_ext+".png"), "PNG")
    os.remove(image_path)

def to_png(image_path):
    ext = os.path.splitext(image_path)[-1]

    # Skip special files
    if is_special_file(os.path.basename(image_path), ext):
        return (False, f"Skipped: Special file")
    
    # Skip if already png or gif
    if ext == ".png" or ext == ".gif":
        return (True, f"Skipped: Already png or gif")
    
    # Convert to png
    if ext == ".heic":
        heic_to_png(image_path)
        return (True, f"Converted to png")
    elif ext == ".jpg" or ext == ".jpeg":
        jpg_to_png(image_path)
        return (True, f"Converted to png")
    else:
        return (False, f"Skipped: Unsupported format")

def dfs(path):

    global number, success_number, error_number

    if not os.path.isdir(path):
        return
    else:
        formatted_time = datetime.now().strftime("%Y%m%d%H%M%S%f")
        
        file_list = [f for f in os.listdir(path) if os.path.isfile(os.path.join(path, f))]
        folder_list = [f for f in os.listdir(path) if os.path.isdir(os.path.join(path, f))]

        for i in range(len(file_list)):

            basename = os.path.basename(file_list[i])
            ext = os.path.splitext(basename)[-1]
            old_path = os.path.join(path, file_list[i])
            new_path = os.path.join(path, str(i+1)+"_"+formatted_time+ext)
            os.rename(old_path, new_path)

        file_list = [f for f in os.listdir(path) if os.path.isfile(os.path.join(path, f))]

        for i in range(len(file_list)):

            basename = os.path.basename(file_list[i])
            ext = os.path.splitext(basename)[-1].lower()
            old_path = os.path.join(path, file_list[i])
            new_path = os.path.join(path, basename.split("_")[0]+ext)
            os.rename(old_path, new_path)

            if is_special_file(basename, ext):
                print(f"Skipped {new_path}")
                continue

            try:
                number += 1
                is_succ, result = to_png(new_path)
                if not is_succ:
                    error_number += 1
                    raise Exception(result)
                else:
                    success_number += 1
            except Exception as e:
                print(f"Error at {new_path}: {e}")

        for folder in folder_list:
            dfs(os.path.join(path, folder))

if __name__ == "__main__":

    dir_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")
    dfs(dir_path)

    print(f"Total: {number}, Success: {success_number}, Error: {error_number}")