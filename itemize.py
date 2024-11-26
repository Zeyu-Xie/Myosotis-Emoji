import os
import subprocess
from datetime import datetime
from PIL import Image

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

def dfs(path):
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

            try:
                if ext == ".heic":
                    heic_to_png(new_path)
                    print(f"Converted {new_path} to PNG")
                elif ext == ".jpg" or ext == ".jpeg":
                    jpg_to_png(new_path)
                    print(f"Converted {new_path} to PNG")
            except Exception as e:
                print(f"Error at {new_path}: {e}")

        for folder in folder_list:
            dfs(os.path.join(path, folder))

if __name__ == "__main__":

    dir_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")
    dfs(dir_path)
