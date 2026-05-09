import numpy as np
import cv2
from PIL import Image

def preprocess_image(file):
    img = Image.open(file)
    img = img.resize((224, 224))

    img = np.array(img)
    img = img / 255.0

    img = np.expand_dims(img, axis=0)

    return img