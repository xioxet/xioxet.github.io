import json

# Read the input text file
input_file_path = 'english.txt'  # Update with the actual file path
with open(input_file_path, 'r') as file:
    words = file.read().splitlines()

# Convert all words to uppercase
uppercase_words = [word.upper() for word in words]

# Organize words into arrays by their length
max_word_length = max(len(word) for word in uppercase_words)
organized_words = [[] for _ in range(max_word_length + 1)]

for word in uppercase_words:
    word_length = len(word)
    organized_words[word_length].append(word)

# Save the organized words in a JSON file
output_file_path = 'english.json'  # Update with the desired output file path
with open(output_file_path, 'w') as json_file:
    json.dump(organized_words, json_file, indent=4)

print("Words organized and saved to JSON file.")
