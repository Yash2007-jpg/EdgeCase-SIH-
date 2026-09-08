from pypdf import PdfReader

pdf_path = "../raw/IS_3854_2023.pdf"
output_path = "IS_3854_2023.txt"

reader = PdfReader(pdf_path)

with open(output_path, "w", encoding="utf-8") as output:
    for page in reader.pages:
        text = page.extract_text()
        if text:
            output.write(text)
            output.write("\n\n")

print("Text extraction completed!")