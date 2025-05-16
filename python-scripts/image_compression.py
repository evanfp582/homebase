import cv2
import numpy as np
import matplotlib.pyplot as plt

def compress(img, new_height=100, new_width=100, display=False):
  """Take a large image and turn it into a pixelated 100 x 100 image
  Args:
      img (Image): _description_
      new_height (int, optional): New compressed height. Defaults to 100.
      new_width (int, optional): New compressed width. Defaults to 100.
      display (bool, optional): Whether to display final compressed image. Defaults to False.
  """
  block_height = img.shape[0] // new_height
  block_width = img.shape[1] // new_width
  
  resized = np.zeros((new_height, new_width, 3), dtype=np.uint8)

  for c in range(3):
    for i in range(new_height):
      for j in range(new_width):
        y0, y1 = i * block_height, (i + 1) * block_height
        x0, x1 = j * block_width, (j + 1) * block_width
        block = img[y0:y1, x0:x1, c]
        resized[i, j, c] = np.mean(block).astype(np.uint8)
  
  resized_rgb = cv2.cvtColor(resized, cv2.COLOR_BGR2RGB)
  if display:
    plt.imshow(resized_rgb)
    plt.title("Resized 100x100 Image (Averaged)")
    plt.show()
  return resized_rgb

if __name__ == "__main__":
  path = r'C:\Users\evanf\Documents\projects\homebase_storage\images_example\shade.jpg'
  image = cv2.imread(path, cv2.IMREAD_COLOR)
  
  print("Shape: ", image.shape)
  
  # main(image)
  compressed_img = compress(image, display=True)
  
  cv2.waitKey(0)

  # closing all open windows
  cv2.destroyAllWindows()