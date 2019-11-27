import numpy as np 
import cv2
import pytesseract
from PIL import Image, ImageEnhance
import re
from spacy.lang.en import English 
# import spacy
from nerd import ner

tesseract_cmd = r'/usr/bin/tesseract'
pytesseract.pytesseract.tesseract_cmd = r'/usr/bin/tesseract'

def scan_card(path):
    Image_Path = 'uploadedImages/'+path
    # print('!!!! adkfjhaskdjfhakljdshflkjashdfljhas dlkfjhsd lfkjhsdfy878 !!!!!!')
    # print(Image_Path)
    original_img = cv2.imread(Image_Path)
    img = cv2.cvtColor(original_img,cv2.COLOR_BGR2GRAY)

    img = cv2.resize(img,None,fx=1.2,fy=1.2)

    kernel = np.array([[-1,-1,-1], 
                    [-1, 9,-1],
                    [-1,-1,-1]])
    img = cv2.filter2D(img, -1, kernel)

    img = cv2.bitwise_not(img)

    thresh,img = cv2.threshold(img, 200, 255,cv2.THRESH_BINARY | cv2.THRESH_OTSU)
    img = cv2.bitwise_not(img)
    img = cv2.blur(img,(3,3))

    result = pytesseract.image_to_string(Image.fromarray(img),lang='eng')
    # print(result)
    # print('===================================================')

    fax_pattern = re.compile(r'[Ff][Aa]?[Xx]?[:\- ]*([\+\()]?[0-9]{3}.*[0-9]{3}[\.\-]?[ ]?[0-9]{4})')
    phone_regex = re.compile(r'[\+\()]?[0-9]{3}[\)\.\-]?[ ]?[0-9]{3}[\.\-]?[ ]?[0-9]{4}')
    email_regex = re.compile(r"[a-zA-Z0-9\.\-+_]+@[a-zA-Z0-9\.\-+_]+\.[a-zA-Z]+")
    pat = re.compile(r'\d\{1,5}[( \w+){1,5}, (.*), ( \w+){1,5}, (A-ZA-Z), [0-9]+(-[0-9]\{4})\?', re.IGNORECASE)

    email_list = email_regex.findall(result)
    phone_numbers = phone_regex.findall(result)
    fax_number = fax_pattern.findall(result)
    name = parseName(result).strip()

    # print("Name: ",name)
    # print('Email id: ',email_list)
    if phone_numbers is not [] and fax_number is not []:
        for num in fax_number:
            if num in phone_numbers:
                phone_numbers.remove(num)

    # print('Phone Number: ',phone_numbers)

    # address = "".join([s for s in result.strip().splitlines(True) if s.strip("\r\n").strip()])
    # print(address)
    # print('Address: ',pat.findall(result))

    card_dictionary = {'name': name,
                        'phones': phone_numbers,
                        'emails': email_list}
    
    return card_dictionary
    
def parseName(document):
    name_str = ""
    org_str = ""
    document = document.replace("\n"," ")
    sent = ner.name(document,language='en_core_web_sm')
    for word in sent:
        if word.label_ == 'PERSON':
            name_str = f'{name_str} {word}'
            break
    for word in sent:
        if word.label_ == 'ORG':
            org_str = f'{org_str} {word}'
    # # print(document)
    # # Two words (can contain "-" or ".") of 2 characters or more, separated by a space
    # personsNameRegex = "[\w\-.]{2,} [\w\-.]{2,}"
    # # print(re.findall(personsNameRegex, document))
    # nameDisqualifiers = ("ENGINEER", "DEVELOPER", "LTD", "INC", "TECHNOLOGIES",
    #                      "COMPANY","INSTITUTE","COMPUTER", "SCEINCE","SOLUTIONS",
    #                      "MANAGER")
    # names = re.findall(personsNameRegex, document)
    # name_str = ""
    # suggested_name = []
    # # nlp = spacy.load('en_core_web_sm')
    # # Iterate through each of the matches found in the document
    # for name in names:
    #     # Seperate the contents of this name by a space
    #     nameParts = name.upper().split(" ")

    #         # Take the intersection of the nameParts and the nameDisqualifiers,
    #         # if there are no intersecting names (the intersection set is empty),
    #         # then return this name (loop will exit, the first name that matches
    #         # this criteria is most likely the real name)
    #     disqualifiersInNameParts = set(nameParts).intersection(nameDisqualifiers)
    #     if not disqualifiersInNameParts:
    #         # print(nameParts)
    #         suggested_name.append(name)
    #         sent = ner.name(document,language='en_core_web_sm')
    #         for word in sent:
    #             if word.label_ == 'PERSON':
    #                 name_str = f'{name_str} {word}'
    #                 break
    #                 # print(word.text,"-------",word.label_)
    #             # if word.label_ == 'ORG':
    #             #     print(word.text,"-------",word.label_)
    #     if name_str is not "":
    #         break
    # if name_str is "":
    #     name_str = names
    # print(org_str)
    return name_str
   
    
    # return names    

# scan_card('../business_cards/Reference/069.jpg')