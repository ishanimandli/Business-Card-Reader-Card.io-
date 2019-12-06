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
import os
"""Provides functionalitites to extract information like name, phone number, email id,
   job title, company name from business card image.

   Args:
		image_path (str): Path to image
	Returns:
		card_dictionary (dict[str, str]): Extracted business card metadata.
"""

tesseract_cmd = r'/usr/bin/tesseract'
pytesseract.pytesseract.tesseract_cmd = r'/usr/bin/tesseract'

JOB_TITLE_FILE = 'job-title.csv'

def scan_card(path):
    image_path = os.path.join("uploadCards",path)
    
    original_img = cv2.imread(image_path)
    img = cv2.cvtColor(original_img, cv2.COLOR_BGR2GRAY)

    img = cv2.resize(img, None, fx=1.2, fy=1.2)

    kernel = np.array([[-1,-1,-1], 
                    [-1, 9,-1],
                    [-1,-1,-1]])

    img = cv2.filter2D(img, -1, kernel)

    img = cv2.bitwise_not(img)

    thresh,img = cv2.threshold(img, 200, 255,cv2.THRESH_BINARY | cv2.THRESH_OTSU)
    img = cv2.bitwise_not(img)
    img = cv2.blur(img,(3,3))

    result = pytesseract.image_to_string(Image.fromarray(img),lang='eng')
    
    card_deatails = get_card_details(result)
    

    return card_deatails

def get_card_details(document):
    """This function extract card information from given text.
       Args:
            String: block of text.
       Returns:
            card_dictionary(dict([str,str])): extracted card details."""

    name = get_name(document).strip()
    phone_numbers = get_phone_number(document)
    email_list = get_email_id(document)
    job_title = get_job_title(document)
    company_name = get_company_name(email_list)

    card_dictionary = {'name': name,
                        'phones': phone_numbers,
                        'emails': email_list,
                        'jobTitle': job_title,
                        'company': company_name}

    return card_dictionary
    
def get_phone_number(document):
    """This function detects phone number from given string.
       input: string/document
       output: returns list of phone numbers."""

    fax_pattern = re.compile(r'[Ff][Aa]?[Xx]?[:\- ]*([\+\()]?[0-9]{3}.*[0-9]{3}[\.\-]?[ ]?[0-9]{4})') 
    phone_regex = re.compile(r'[\+\()]?[0-9]{3}[\)\.\-]?[ ]?[0-9]{3}[\.\-]?[ ]?[0-9]{4}')
    phone_numbers = phone_regex.findall(document) # finds phone numbers and fax numbers
    fax_number = fax_pattern.findall(document) # finds numbers with 'fax' as label

    # Remove fax numbers from list and keeps phone numbers
    if phone_numbers is not [] and fax_number is not []:
            for num in fax_number:
                if num in phone_numbers:
                    phone_numbers.remove(num)

    return phone_numbers


def get_email_id(document):
    """This function takes block of text, reads email ids from given text 
       and returns list of all email ids."""

    email_regex = re.compile(r"[a-zA-Z0-9\.\-+_]+@[a-zA-Z0-9\.\-+_]+\.[a-zA-Z]+")
    pat = re.compile(r'\d\{1,5}[( \w+){1,5}, (.*), ( \w+){1,5}, (A-ZA-Z), [0-9]+(-[0-9]\{4})\?', re.IGNORECASE)

    email_list = email_regex.findall(document)

    return email_list


def get_name(document):
    """This function takes block of text as input and returns person's name."""

    name_str = ""
    
    document = document.replace("\n"," ")

    sent = ner.name(document,language='en_core_web_sm')

    for word in sent:
        if word.label_ == 'PERSON':
            name_str = f'{name_str} {word}'
            break
    
    return name_str
   


def get_job_title(document):
    """This function takes block of text as input and returns person's job title."""

    name_str = ""
    search_through = pd.read_csv(JOB_TITLE_FILE, sep=',\n',header= None,engine='python')
    name_regex = "[\w]{2,}"
    names = re.findall(name_regex, document)

    for word in names:
        ratio = process.extract( word, search_through[0], limit=1,scorer=fuzz.ratio)
        if ratio[0][1] > 80:
            name_str = f'{name_str} {word}'
    
    return name_str

def get_company_name(document):
    """This function will return company name in card."""

    company_name = document[0].split('@')[1]
    if company_name.count('.') == 1:
        company_name = company_name.split('.')[0]
    else :
        company_name = company_name.split('.')[1]
    
    return company_name