from pdfminer.high_level import extract_pages
from pdfminer.layout import LTPage
import random
import PyPDF2
import os

class PDFtoText:

    def __init__(self):
        pass



    def page_selector(self, path, file_name, pages):

        input_pdf = open(os.path.join(path, file_name), 'rb')
        file_path = os.path.join(path, file_name[:-4] + '_selected_pages' + file_name[-4:])
        output_pdf = open(file_path, 'wb')

        pdf_reader = PyPDF2.PdfReader(input_pdf)
        # total = len(pdf_reader.pages)
        pdf_writer = PyPDF2.PdfWriter()

        for page_num in pages:

            # if page_num in pages:
            pdf_writer.add_page(pdf_reader.pages[page_num-1])

        pdf_writer.write(output_pdf)

        output_pdf.close()
        input_pdf.close()

        return file_path
    
    def extract_text(self, path, data, full_pdf_path):
        extracted_text = []

        # Intitial details as first page
        pagewise_transcript = []

        with open(path, 'rb') as pdf_file:
            for page_layout in extract_pages(pdf_file):
                # Check if it's a page object (not all layouts are pages)
                if isinstance(page_layout, LTPage):
                    page_text = ""
                    for element in page_layout:
                        # Extract text from different layout elements (text lines, characters, etc.)
                        if hasattr(element, 'get_text'):
                            page_text += element.get_text() + '\n'  # Add newline for readability

                    pagewise_transcript.append(page_text)

        return pagewise_transcript

    def main(self, file_name, path, pages, data):
        
        """
        Select the pages to be vectorized
        """

        # If no specific pages is specified
        if pages == None:

            no_of_pages = len((PyPDF2.PdfReader(open(os.path.join(path, file_name), 'rb'))).pages)
            my_list = range(no_of_pages)
            selected_pages = []

            # if the number of pages is greater than 300 we divide to atmost 10 parts and select more than 30 pages
            if no_of_pages > 300:

                # If the number of pages is less than 1000 we divide to less than 10 parts
                if no_of_pages < 1000:

                    # We divide the book into 'p' parts where p,q,r is the digits in number of pages, 'pqr'.
                    n_parts = int(str(no_of_pages)[0])

                else:
                    # if  no.of pages is greater than 1000, we divide the book into 10 parts
                    n_parts = 10

                total_pages_to_select = int(0.1*no_of_pages)
                pages_to_select_from_each_part = total_pages_to_select//n_parts
                total_pages_per_part = no_of_pages//n_parts
                
                for i in range(n_parts):
                    selected_pages += random.sample(my_list[i*total_pages_per_part:(i+1)*total_pages_per_part], pages_to_select_from_each_part)
            else:
                
                # If the no of pages is between 30 and 300, we vectorize random 30 pages.
                if no_of_pages > 30:
                    selected_pages = random.sample(my_list, 30)
                else:

                # Else we vectorize the entire document
                    selected_pages = range(no_of_pages)
        else:

            # If the specific set of pages that needs to be transcribed have been specified
            pass

        pages = sorted(selected_pages)
        print('\n\nLength - ', len(pages), '\nList of pages - ',pages, '\n')

        print("Initiating pdf trimming to selected pages")
        # Trim the pdf to the new required size
        file_path = self.page_selector(path, file_name, pages)
        
        print("Trimming complete.\n")

        pagewise_transcript = self.extract_text(file_path, data, os.path.join(path, file_name))
        

        print("Transcript generation completed.\n")

        final_transcript = ''
        for page in pagewise_transcript:
            final_transcript += "\n\n"
            final_transcript += page

        final_transcript = f"""Title:{data['title']}\nAuthor:{data['author']}\n
                               Year:{data['year']}\nType:{data['type']}\n\n""" + final_transcript
        return final_transcript, file_path
    
    def convert(self, file_name, path, data):
    
        # Incase specific page numbers are given
        pages=None

        pagewise_transcript, file_path = self.main(path=path, file_name=file_name, pages=pages, data=data)

        if os.path.isfile(file_path):
            os.remove(file_path)
        return pagewise_transcript, file_path
