import json

import requests

url = 'https://api.github.com/repos/pagopa/template-java-spring-microservice/contents/.github/workflows'
url_raw = 'https://raw.githubusercontent.com/pagopa/template-java-spring-microservice/main/'

response = requests.get(url)

for item in json.loads(response.text):
    path = item["path"]
    name = item["name"]
    print(name)
    response = requests.get(url_raw + path)
    fo = open(name, "w")
    fo.write(response.text)
    fo.close()
