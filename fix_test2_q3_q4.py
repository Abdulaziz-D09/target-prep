import json

with open('test2_parsed.json', 'r') as f:
    data = json.load(f)

# Let's fix test 2 reading m1
# Look at Q3
# "passage": "The fog extended its tentacles over city and river..."
# "question": "As used in the text, what does the word “traces” most nearly mean?\nThe following text is adapted from John Matheus’s 1925 short story “Fog.”"
# We want:
# "passage": "The following text is adapted from John Matheus’s 1925 short story “Fog.”\n\nThe fog extended its tentacles over city and river..."
# "question": "As used in the text, what does the word “traces” most nearly mean?"

q3 = data[0]['questions'][2]
q3['passage'] = "The following text is adapted from John Matheus’s 1925 short story “Fog.”\n\n" + q3['passage']
q3['question'] = "As used in the text, what does the word “traces” most nearly mean?"

# Look at Q4
# "passage": "onerous to comprehensively classify the microplastics in a water sample, so Ojeda-Benitez\net al. are exploring a device to help quickly and accurately identify certain characteristics."
# "question": "Which choice completes the text with the most logical and precise word or phrase?\nMicroplastics are a common pollutant in large masses of water like glaciers. High\nconcentrations and among particles—variations in size, shape, and material—make it"
# We want:
# "passage": "Microplastics are a common pollutant in large masses of water like glaciers. High\nconcentrations and among particles—variations in size, shape, and material—make it onerous to comprehensively classify the microplastics in a water sample, so Ojeda-Benitez\net al. are exploring a device to help quickly and accurately identify certain characteristics."
# "question": "Which choice completes the text with the most logical and precise word or phrase?"

q4 = data[0]['questions'][3]
q4['passage'] = "Microplastics are a common pollutant in large masses of water like glaciers. High\nconcentrations and among particles—variations in size, shape, and material—make it " + q4['passage']
q4['question'] = "Which choice completes the text with the most logical and precise word or phrase?"

with open('test2_parsed.json', 'w') as f:
    json.dump(data, f, indent=2)

with open('test2_reading.json', 'w') as f:
    json.dump(data, f, indent=2)

print("Fixed q3 and q4 passages")
