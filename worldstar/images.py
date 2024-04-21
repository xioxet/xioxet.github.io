from seleniumbase import Driver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from PIL import Image
import os
import time

cities = open('worldcities.csv', encoding='utf-8').read().split('\n')
pop_limit = 100000

city_objects = []
for city in cities[1:]:
    try:
        city_name, city_name_ascii, lat, lon, country, pop = city.split(",")
        if int(pop) > 1000000:
            city_object = [city_name, lat, lon, country]
            city_objects.append(city_object)
    except:
        pass


#selenium
webdriver_path = r'C:\Users\event\Desktop\driverr' 
driver = Driver(uc=True)

def find_button(jsaction_value):
    return WebDriverWait(driver, 15).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, f"button[jsaction*='{jsaction_value}']")))

for i, x in enumerate(city_objects[228:1000]):
    try:
        url = f'https://www.google.com/maps/@{x[1]},{x[2]},12.8z?entry=ttu'

        driver.get(url)
        driver.maximize_window()
        # turn off labels
        find_button('minimap.main;contextmenu:minimap.main;focus:minimap.main;mousemove:minimap.main;mouseover:minimap.main;mouseout:minimap.main').click()
        find_button('layerswitcher.quick.more').click()
        find_button('layerswitcher.intent.labels').click()
        find_button('layerswitcher.close').click()
        fn = f'downloaded_files/{x[0]}, {x[-1]}.png'
        time.sleep(1)
        driver.save_screenshot(fn)
        cropped = Image.open(fn).crop([250, 150, 250+1450, 150+700])

        # filter errors
        color_to_count = (51, 51, 51, 255)
        width, height = cropped.size
        count = 0
        for x in range(width):
            for y in range(height):
                pixel_color = cropped.getpixel((x, y))
                if pixel_color == color_to_count:
                    count += 1

        # Calculate the percentage of pixels with the specified color
        total_pixels = width * height
        percentage = (count / total_pixels) * 100
        print(percentage, fn)
        
        if percentage < 0.1: 
            cropped.save(fn)
        else:
            os.remove(fn)
    except:
        pass

driver.quit()
    