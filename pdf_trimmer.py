from doctr.models import ocr_predictor
from doctr.io import DocumentFile
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

    def main(self, file_name, path, pages=None):
        
        # Do the OCR
        model = ocr_predictor(det_arch='db_resnet50', reco_arch='crnn_vgg16_bn', pretrained=True)

        # If no specific pages is specified
        if pages == None:

            my_list = range(len((PyPDF2.PdfReader(open(os.path.join(path, file_name), 'rb'))).pages))
            
            if len(my_list) > 30:
                max_length = 30
            else:
                # 25% of the book is saved as vectors
                max_length = int(0.25*len(my_list))
                if max_length == 0:
                    max_length=len(my_list)

            pages = random.sample(my_list, max_length)

        else:

            # If the specific set of pages that needs to be transcribed have been specified
            pass

        pages = sorted(pages)
        print('\n\nLength - ', len(pages), '\nList of pages - ',pages, '\n')
        # Trim the pdf to the new required size
        file_path = self.page_selector(path, file_name, pages)
        
        # Use the new PDF
        
        doc = DocumentFile.from_pdf(file_path)
        result = model(doc)

        pagewise_transcript = []

        for page in result.pages:
            blocks = page.blocks
            transcript = ''
            for block in blocks:
                for line in block.lines:
                    for word in line.words:
                        transcript += " " + word.value
                    transcript += '. '
                transcript += '\n'
            pagewise_transcript.append(transcript)
        # print('pagewise transcript - ', pagewise_transcript)
        transcript = ''
        for page in pagewise_transcript:
            transcript += "\n\n"
            transcript += page

        return transcript, path
    
    def convert(self, file_name, path):
    
        # Incase specific page numbers are given
        pages=None

        pagewise_transcript, file_path = self.main(path=path, file_name=file_name, pages=pages)

        return pagewise_transcript, file_path