from bs4 import BeautifulSoup
import os

def count_words_in_html(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        soup = BeautifulSoup(file, 'html.parser')
        body_text = soup.find('body').get_text()
        words = body_text.split()
        return len(words)

def main():
    html_files = [file for file in os.listdir() if file.endswith('.html')]
    total_word_count = 0

    for file in html_files:
        file_path = os.path.join(os.getcwd(), file)
        word_count = count_words_in_html(file_path)
        print(file, word_count)
        total_word_count += word_count

    print("Total word count in all HTML files:", total_word_count)

if __name__ == "__main__":
    main()
