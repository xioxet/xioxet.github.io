import os
import json

directory = '/downloaded_files'
x = open('worldcities.csv', encoding='utf-8').read().split('\n')
filenames = os.listdir(os.getcwd() + directory)
entries = []
c_mod = 6
c = 1
for filename in filenames:
    try:
        cityname, countryname = filename.split('.')[0].split(',')
        cityname, countryname = cityname.strip(' '), countryname.strip(' ')
        for i in x:
            i = i.split(',')
            if i[0] == cityname and i[-2] == countryname :
                entry = {
                    'filename': filename,
                    'country': i[-2],
                    'city': i[1],
                    'population': i[-1]
                }
                if countryname != 'China':
                    entries.append(entry)
                else:
                    c += 1
                    if c % c_mod == 0:
                        entries.append(entry)
    except Exception:
        print(Exception)
        pass

json_data = json.dumps(entries)
x = open('entries.json', 'w')
x.write(json_data)