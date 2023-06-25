from doctr.models import ocr_predictor
from text_summarize import summarize
from doctr.io import DocumentFile
import argparse
import random
import PyPDF2
import os

def page_selector(path, file_name, pages):

    input_pdf = open(os.path.join(path, file_name), 'rb')
    file_name = os.path.join(path, file_name[:-4] + '_selected_pages' + file_name[-4:])
    output_pdf = open(file_name, 'wb')

    pdf_reader = PyPDF2.PdfReader(input_pdf)
    # total = len(pdf_reader.pages)
    pdf_writer = PyPDF2.PdfWriter()

    for page_num in pages:

        # if page_num in pages:
        pdf_writer.add_page(pdf_reader.pages[page_num-1])

    pdf_writer.write(output_pdf)

    output_pdf.close()
    input_pdf.close()

    return file_name

def main(file_name, path, pages=None, sub_len = None):
    # PDF
    model = ocr_predictor(det_arch='db_resnet50', reco_arch='crnn_vgg16_bn', pretrained=True)
    # doc = DocumentFile.from_pdf("F:\Projects\Generative AI\dummy.pdf")

    if pages == None:

        my_list = range(len((PyPDF2.PdfReader(open(os.path.join(path, file_name), 'rb'))).pages))
        
        if len(my_list) > 30:
            max_length = 30
        else:
            # 25% of the book is saved as vectors
            max_length = int(0.25*len(my_list))
            if max_length == 0:
                max_length=len(my_list)

        subset_length = min(len(my_list), max_length)
        
        indices = random.sample(range(len(my_list)), subset_length)
        subset = [my_list[i] for i in sorted(indices)]


        pages = random.sample(my_list, subset_length)

        print('\n\nLength - ', len(pages), '\nList of pages - ',pages, '\n')

    file_name = page_selector(path, file_name, pages)
    file_name = file_name[file_name.rfind('\\')+1:]
    
    # Analyze
    path = os.path.join(path, file_name)
    print('\npath - ', path, '\n')
    doc = DocumentFile.from_pdf(path)
    result = model(doc)

    pages = []

    for page in result.pages:
        blocks = page.blocks
        transcript = ''
        # if page == 100:
        #     break
        for block in blocks:
            for line in block.lines:
                for word in line.words:
                    transcript += " " + word.value
                transcript += '. '
            transcript += '\n'
        pages.append(transcript)
    
    # print(pages[-2])
    i=0
    # os.remove(path)
    # for page in pages:
    #     print('\nActual page - ', page, '\nSummarized - ', summarize(page))
    #     i+=1
    #     if i == 5:
    #         break
    return pages, path

# if __name__ == "__main__":

def convert(file_name):
    # # Initialize the Parser
    # parser = argparse.ArgumentParser(description ='Page number list')
  
    # # Adding Arguments
    # parser.add_argument('-fl', help ='an integer flag for page number selection', required=True)
  
    # args = parser.parse_args()
    # flag = int(args.fl)
    path = os.path.join("media", "pdfs")
    # file_name = "Horowitz_and_sahani_fundamentals_of_comp.pdf"
    
    # if flag ==1:
    #     pages = [1, 4, 666, 100]
    # else:
    #     pages = None
    pages = None

    return main(path=path, file_name=file_name, pages=pages)