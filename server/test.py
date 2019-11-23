from nerd import ner

doc = ner.name("""ace sdaytons

COMMUNICATIONS

carol soh
general manager

h65 9630 1571
[aE VAP.)
f 65 6475 3041
carol@acecomm.sg""")
text_label = [(X.text, X.label_) for X in doc]
print(text_label)






   # cv2.imwrite("final.png",img)
    # im = Image.open("final.png")


 # if  disqualifiersInNameParts is not None:
        #     # print(nameParts)
        #     sent = nlp(" ".join(nameParts))
        #     for word in sent.ents:
        #         if word.label_ == 'ORG':
        #             print(word.text,"-------",word.label_)