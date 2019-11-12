import numpy as np 
import cv2
import pytesseract
from PIL import Image, ImageEnhance
import re
import spacy 

tesseract_cmd = r'/usr/bin/tesseract'
pytesseract.pytesseract.tesseract_cmd = r'/usr/bin/tesseract'

original_img = cv2.imread('business_cards/Reference/006.jpg')
img = cv2.cvtColor(original_img,cv2.COLOR_BGR2GRAY)

img = cv2.resize(img,None,fx=1.2,fy=1.2)

kernel = np.array([[-1,-1,-1], 
                   [-1, 9,-1],
                   [-1,-1,-1]])
img = cv2.filter2D(img, -1, kernel)

img = cv2.bitwise_not(img)

thresh,img = cv2.threshold(img, 127, 255,cv2.THRESH_BINARY | cv2.THRESH_OTSU)
img = cv2.bitwise_not(img)
img = cv2.blur(img,(5,5))

cv2.imwrite("final.png",img)
im = Image.open("final.png")

print('----------------------------------------------')
result = pytesseract.image_to_string(im,lang='eng')
print(result)


print('===================================================')

print(re.findall(r"[a-z0-9\.\-+_]+@[a-z0-9\.\-+_]+\.[a-z]+", result))
print(re.findall(r'[\+\(]?[1-9][0-9 .\-\(\)]{8,}[0-9]', result))
print(re.findall(r'\b([A-Z]*[a-z]*) ([A-Z]*[a-z]*)\b', result))

# name = re.findall(r'\b([A-Z]*[a-z]*) ([A-Z]*[a-z]*)\b', result)
# job = re.findall(r'\b([A-Z]*[a-z]*) ([A-Z]*[a-z]*) ([A-Z]*[a-z]*)\b', result)


# print('Name : '+name[0][0]+" "+name[0][1])
# print('Job title : '+job[0][0]+" "+job[0][1]+" "+job[0][2] )

nlp = spacy.load('en_core_web_sm')

sent = nlp('John Smith loves coding in Python!')


print([token.pos_ for token in sent ])
