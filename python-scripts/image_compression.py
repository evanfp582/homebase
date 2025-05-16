import cv2
import numpy as np
import matplotlib.pyplot as plt
import os
import argparse

def parse_args_func():
  """standard arg parse function

  Returns:
      Namespace: Arg Parse parser
  """
  parser = argparse.ArgumentParser(description="Description")
  parser.add_argument("rec_folder", help="Path to folder to receive images")
  parser.add_argument("save_folder", help="Path to folder to save compressed images")
  parser.add_argument("--display", action='store_true', help="Display each compressed image as it is generated")
  
  return parser.parse_args()

def compress_folder(rec_folder, save_folder, new_height=100, new_width=100, display=False):
  """Take a folder of images and turn it into pixelated 100 x 100 images
  Args:
      rec_folder (String): Path to folder to receive images
      save_folder (String): Path to folder to save compressed images
      new_height (int, optional): New compressed height. Defaults to 100.
      new_width (int, optional): New compressed width. Defaults to 100.
      display (bool, optional): Whether to display final compressed image. Defaults to False.
  """
  image_files = [f for f in os.listdir(rec_folder) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp'))]
  base_dir = os.path.dirname(__file__)
  for image in image_files:
    image_path = os.path.join(base_dir, rec_folder ,image)
    img = cv2.imread(image_path, cv2.IMREAD_COLOR)
    
    block_height = img.shape[0] // new_height
    block_width = img.shape[1] // new_width
    
    resized_bgr = np.zeros((new_height, new_width, 3), dtype=np.uint8)

    for c in range(3):
      for i in range(new_height):
        for j in range(new_width):
          y0, y1 = i * block_height, (i + 1) * block_height
          x0, x1 = j * block_width, (j + 1) * block_width
          block = img[y0:y1, x0:x1, c]
          resized_bgr[i, j, c] = np.mean(block).astype(np.uint8)
    
    resized_rgb = cv2.cvtColor(resized_bgr, cv2.COLOR_BGR2RGB)
    if display:
      plt.imshow(resized_rgb)
      plt.title("Resized 100x100 Image")
      plt.show()
    cv2.imwrite(os.path.join(save_folder, image), resized_bgr)

def main():
  args = parse_args_func()
  rec_folder = args.rec_folder
  save_folder = args.save_folder
  display_bool = args.display
    
  compress_folder(rec_folder, save_folder, display=display_bool)
  
  # Not sure what this does, but it seems needed
  cv2.waitKey(0)
  cv2.destroyAllWindows()
  

if __name__ == "__main__":
  main()
  