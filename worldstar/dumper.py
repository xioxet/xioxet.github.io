import os
import json

directory = '/downloaded_files'
x = open('worldcities.csv', encoding='utf-8').read().split('\n')
filenames = os.listdir(os.getcwd() + directory)
entries = []
for filename in filenames:
    cityname = filename.split(',')[0]
    for i in x:
        i = i.split(',')
        try:
            if i[0] == cityname:
                entry = {
                    'filename': filename,
                    'country': i[-2],
                    'city': i[1],
                    'population': i[-1]
                }
                entries.append(entry)
        except:
            pass

json_data = json.dumps(entries)
x = open('entries.json', 'w')
x.write(json_data)