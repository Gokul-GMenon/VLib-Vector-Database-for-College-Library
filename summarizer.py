from transformers import T5Tokenizer, T5ForConditionalGeneration

class Summarizer:

    def __init__(self):
        
        model_name = "t5-small"

        self.tokenizer = T5Tokenizer.from_pretrained(model_name)
        self.model = T5ForConditionalGeneration.from_pretrained(model_name)
        

    def generate(self, pagewise_transcript):

        full_transcript = ''

        for page in pagewise_transcript:

            text_len = len(page)
            try:
                input_ids = self.tokenizer(page, return_tensors="pt").input_ids
                output = self.model.generate(input_ids, max_length=int(text_len)*0.75, num_beams=5)  # Adjust max_length for desired summary length
                summary_tokens = output[0]
                summary_text = self.tokenizer.decode(summary_tokens, skip_special_tokens=True)
                full_transcript+=summary_text
                full_transcript+='\n\n'
            except:
                full_transcript+=page
                full_transcript+='\n\n'
        print(full_transcript)

        return full_transcript