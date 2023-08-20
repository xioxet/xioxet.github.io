import json

# Read the contents of the 'english.txt' file
with open('english.txt', 'r') as file:
    words = file.read().splitlines()

# Convert the list of words into a JSON format
json_data = json.dumps(words)

# Write the JSON data to a new file
with open('english.json', 'w') as json_file:
    json_file.write(json_data)