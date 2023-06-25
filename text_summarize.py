import torch
from transformers import AutoTokenizer, AutoModelWithLMHead

def summarize(text):

    tokenizer=AutoTokenizer.from_pretrained('T5-small')
    model=AutoModelWithLMHead.from_pretrained('T5-base', return_dict=True)
    sequence = (text)
    inputs=tokenizer.encode("sumarize: " +sequence,return_tensors='pt', max_length=512, truncation=True)
    output = model.generate(inputs, min_length=80, max_length=100)
    summary=tokenizer.decode(output[0])
    print('\nType of summary - ', type(summary))
    return summary

if __name__ == "__main__":
    
    summarize()