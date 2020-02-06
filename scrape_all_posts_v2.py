# Credits to Nishant Ghanate
# https://github.com/NishantGhanate/PythonScripts/blob/master/Selenium/Instagram.py

# updated on 02/02/2020

from selenium import webdriver
import time
import logging as logger
import re
import boto3

non_posts = []
open_file = open("non_posts.txt", 'r')
for line in open_file:
    non_posts.append(str(line.strip("\n")))

class Post:
    def __init__(self):
        self.media_url = ""
        self.post_url = ""
        self.caption = ""
        self.is_comic = False
        self.post_index = None

class Instagram:
    def __init__(self, driverPath=None, url=None, savePhotosDir=None, count=None):
        self.driverPath = driverPath
        self.url = url  # instagram open Account URL
        self.count = count  # images count
        self.SCROLL_PAUSE_TIME = 5
        self.LOAD_PAUSE_TIME = 6
        self.postsUrls = []
        self.posts = []

    def loadDriver(self):
        try:
            if self.driverPath is None:
                logger.error(" Please provide a driver path")
                return
            # open crome options pass --incognito add_argument
            # open crome options pass --incognito add_argument
            chrome_options = webdriver.ChromeOptions()
            chrome_options.add_argument("--incognito")
            self.driver = webdriver.Chrome(executable_path=self.driverPath, options=chrome_options)
            self.getUrl()
        except Exception as e:
            logger.error(str(e))

    def getUrl(self):
        try:
            if self.driver is None:
                logger.error(" Please provide an url")
                return
            self.driver.get(self.url)
            # print(driver.get_log('driver'))
            self.scrollEnd()
        except Exception as e:
            logger.error(str(e))

    # Helps to scroll down
    def scrollEnd(self):
        # Get scroll height
        last_height = self.driver.execute_script("return document.body.scrollHeight")
        while True:
            print("Scrolling..............")
            path = self.driver.find_elements_by_xpath("//*[@class='v1Nh3 kIKUG  _bz0w']//a")
            self.getPostUrls(path)
            self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")  # Scroll down to bottom
            time.sleep(self.SCROLL_PAUSE_TIME)  # Wait to load page
            # Calculate new scroll height and compare with last scroll
            new_height = self.driver.execute_script("return document.body.scrollHeight")
            # print(last_height ,new_height )
            if new_height == last_height:
                self.getPost()
                return
            last_height = new_height

    def getPostUrls(self, path):
        print("\nRetrieving posts url .......")
        for p in path:
            url = p.get_attribute("href")
            print(url)
            if url not in self.postsUrls:
                self.postsUrls.append(url)

        print("Total posts found = " + str(len(self.postsUrls)))

    def getPost(self):
        start_counter = 1
        for i in range(len(self.postsUrls)-1, -1, -1):
            url = self.postsUrls[i]
            post = Post()
            post.post_url = url
            post.post_index = start_counter
            start_counter += 1
            print("Here : ", url)
            print("post index : ", post.post_index)

            self.driver.execute_script("window.open('" + url + "', '_self')")
            self.driver.implicitly_wait(self.LOAD_PAUSE_TIME)
            caption = self.driver.find_element_by_xpath("//div[@class='C4VMK']/span").get_attribute("innerHTML")

            # pattern match with the regular caption format (m o n i t o r)
            pattern = "[a-z]\s"
            r = re.compile(pattern)
            result = r.findall(caption)
            string = ""
            for i in result:
                string += i
            string += caption[-1]

            # check if it is a comic post
            if string == caption:
                post.is_comic = True
                post.caption = caption.replace(" ", "")
                print("CAPTION : ", post.caption)

            # only take images
            imagesXpath = self.driver.find_elements_by_xpath("//*[@class='FFVAD']")

            if imagesXpath != [] and post.is_comic == True:
                for x in imagesXpath:
                    img = x.get_attribute("srcset")
                    # in @srcset there's about 3-4 resolution images url separated by ,
                    img = img.split(",")
                    img = img[-1][:-6]
                    print("img : ", img + "\n")
                    post.media_url = img
                    # retrieve only the first picture
                    break

            # videosXpath = self.driver.find_elements_by_xpath("//*[@class='tWeCl']")
            #
            # if videosXpath != []:
            #     for v in videosXpath:
            #         video = v.get_attribute("src")

            self.posts.append(post)

if __name__ == "__main__":
    driverPath = r"/Users/izadi/Downloads/chromedriver_win32/chromedriver"
    url = "https://www.instagram.com/nathanwpylestrangeplanet/"
    count = 500

    instagram = Instagram(
        driverPath=driverPath,
        url=url,
        count=count
    )
    instagram.loadDriver()

    # checkpoint
    file = open('checkpoint.txt', 'a')
    file.write(str(instagram.post[0].post_index) + " " + str(instagram.post[0].post_url))

    print("number of posts in list : ", len(instagram.posts))
    dynamodb = boto3.resource('dynamodb', aws_access_key_id='AKIAJV4YVFG3QP7BEP3Q',aws_secret_access_key='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', region_name='ap-southeast-1')
    dynamoTable = dynamodb.Table('instagram_posts_v2')

    non_post_counter = 0
    for i in range(len(instagram.posts)-1, -1, -1):
        if instagram.posts[i].post_url in non_posts:
            instagram.posts[i].is_comic = False

        print("media url : ", instagram.posts[i].media_url)
        print("post url : ", instagram.posts[i].post_url)
        print("caption : ", instagram.posts[i].caption)
        print("post index : ", instagram.posts[i].post_index)
        print("is comic : ", instagram.posts[i].is_comic)
        print("\n")

        if instagram.posts[i].is_comic == False:
            non_post_counter += 1

        if instagram.posts[i].media_url == "" or instagram.posts[i].caption == "" or instagram.posts[i].is_comic == False:
            dynamoTable.put_item(
                Item={
                    'id': instagram.posts[i].post_index,
                    'post_url': instagram.posts[i].post_url,
                    'media_url': "NONE",
                    'caption': "NONE",
                    'is_comic': instagram.posts[i].is_comic,
                }
            )
        else:
            dynamoTable.put_item(
                Item={
                    'id': instagram.posts[i].post_index,
                    'post_url': instagram.posts[i].post_url,
                    'media_url': instagram.posts[i].media_url,
                    'caption': instagram.posts[i].caption,
                    'is_comic': instagram.posts[i].is_comic
                }
            )
    print("Number of non posts: ", non_post_counter)