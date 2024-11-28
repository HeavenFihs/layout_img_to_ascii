import cv2 as cv
import matplotlib.pyplot as plt

ASCII_CHARS = ["@","#","S","%","?","*","+",";",":",",","."]

def resize_image(img,new_width):
    height,width = img.shape
    ratio = height/width
    new_height = int(new_width*ratio)
    resized_image = cv.resize(img,(new_width,new_height))
    return resized_image

def to_gray(img):
    grayscale_img = cv.cvtColor(img,cv.COLOR_BGR2GRAY)
    return grayscale_img

def pixels_to_ascii(img):
    characters = "".join([ASCII_CHARS[pixel//25]for pixel in img])
    return characters

def img_to_ascii(path,new_width = 100):
    img = cv.imread(path)
    img_g = to_gray(img)
    img_r = resize_image(img_g,new_width)
    pixel_count = img_r.size

    chars = [ASCII_CHARS[px//25] for px in img_r.reshape(pixel_count)]
    cad = "".join(chars)
    cad_final = ""
    h,w = img_r.shape
    for i in range(h):
        cad_final += cad[i*w:(i+1)*w]
        cad_final += "\n"
    return cad_final[:-1],h,w

