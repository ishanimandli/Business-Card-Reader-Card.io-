import unittest
from card_scanner import get_email_id, get_name, get_phone_number

class CardScannerTest(unittest.TestCase):

    def get_email_id_test(self):

        self.assertAlmostEqual(get_email_id('this is sample.data@set.email.id'),
                                ['sample.data@set.email.id'])
        self.assertAlmostEqual(get_email_id('this is sample.data@ set.email.id'),
                                [])
    
    def get_phone_number_test(self):

        self.assertAlmostEqual(get_phone_number('this is 123-234-2222 and fax: 234-345-5432'),
                                ['123-234-2222'])
        self.assertAlmostEqual(get_phone_number('this is 123-234-2s222 and fax: 234-3s45-5432'),
                                [])
    def get_name_test(self):

        self.assertAlmostEqual(get_name('this is Tom Wilson'),
                                'Tom Wilson')
        self.assertAlmostEqual(get_name('this is Zang Li'),
                                '')

if __name__ == "__main__":
    unittest.main()