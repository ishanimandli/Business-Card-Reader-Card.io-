import numpy as np 
import cv2
import pytesseract
from PIL import Image, ImageEnhance
import re
from spacy.lang.en import English 
# import spacy
from nerd import ner
import pandas as pd
from fuzzywuzzy import fuzz, process
import csv
import requests


tesseract_cmd = r'/usr/bin/tesseract'
pytesseract.pytesseract.tesseract_cmd = r'/usr/bin/tesseract'

def scan_card(path):
    Image_Path = 'uploadCards/'+path
    
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
    

    fax_pattern = re.compile(r'[Ff][Aa]?[Xx]?[:\- ]*([\+\()]?[0-9]{3}.*[0-9]{3}[\.\-]?[ ]?[0-9]{4})')
    phone_regex = re.compile(r'[\+\()]?[0-9]{3}[\)\.\-]?[ ]?[0-9]{3}[\.\-]?[ ]?[0-9]{4}')
    email_regex = re.compile(r"[a-zA-Z0-9\.\-+_]+@[a-zA-Z0-9\.\-+_]+\.[a-zA-Z]+")
    pat = re.compile(r'\d\{1,5}[( \w+){1,5}, (.*), ( \w+){1,5}, (A-ZA-Z), [0-9]+(-[0-9]\{4})\?', re.IGNORECASE)

    email_list = email_regex.findall(result)
    phone_numbers = phone_regex.findall(result)
    fax_number = fax_pattern.findall(result)
    name = parseName(result).strip()
    result = ' '.join(result.split())
    print(result)
    URL = 'https://london-nlp.finidex.com/entitiesapi'
    PARAMS = {'mode':'getentities',
              'apikey': 'b47d41ibsnmxdw20xim07rzerb1v18qn',
              'item1': result}

    r= requests.get(url = URL, params = PARAMS)
    response = r.json()

    print(response['item1']['list_all_persons_raw'])
    print(response['item1']['list_all_organizations_raw'])

    # name = []
    # for value in response['item1']['list_all_persons_raw'].values():
    #     name.append(value.title())   

    # org = []
    # for value in response['item1']['list_all_organizations_raw'].values():
    #     org.append(value.title())


    if phone_numbers is not [] and fax_number is not []:
        for num in fax_number:
            if num in phone_numbers:
                phone_numbers.remove(num)


    card_dictionary = {'name': name,
                        'phones': phone_numbers,
                        'emails': email_list,
                        'jobTitle': parseJobTitle(result).title()}
    print(card_dictionary)
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

    return name_str
   
    
    # return names    

def parseJobTitle(document):
    name_str = ""
    search_through = pd.read_csv('job-title.csv', sep=',\n',header= None,engine='python')
    Regex = "[\w]{2,}"
    names = re.findall(Regex, document)
    for word in names:
        ratio = process.extract( word, search_through[0], limit=1,scorer=fuzz.ratio)
        if ratio[0][1] > 80:
            name_str = f'{name_str} {word}'
    return name_str



# scan_card('../business_cards/Reference/069.jpg')