import json

def get_id(file):
    with open(file) as f:
        data = json.load(f)
        return data['results'][0]['id']

print(f"study: {get_id('data1.json')}")
print(f"lang: {get_id('data2.json')}")
print(f"exam: {get_id('data3.json')}")
