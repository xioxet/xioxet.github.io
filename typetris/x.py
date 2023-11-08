d = [
    "Phrase introduced in Thomas Kuhn's The Structure of Scientific Revolutions Operation to provide ventilatory support also known as electrophenic respiration",
    "Rodential metaphor for corporate life that requires intensive, grueling competition Overly sentimental film or book meant to evoke strong emotion",
    "Second song on Tyler the Creator's critically acclaimed breakup album Industrial Revolution era invention by Richard Arkwright and John Kay",
    "Separate a deck into halves and interleave each half together Having all that one needs to live securely and comfortably",  
    "Mental illness that Karen Carpenter fell victim to in 1983 Alfred Nobel invention that's not dynamite, but just as explosive",
    "Devised set of procedures on how to execute a plan What the policeman said in a Philip K. Dick novel",
    "Williams' algorithm and Floyd's algorithm are two implementations of this Morph like Beast Boy, or like water in different containers",
    "Documentary about prominent Malaysian fugitive who is still at large Diagonal band running down the middle of a Hertzsprung-Russell diagram",
    "Taylor Swift song where the haters gonna hate hate hate Sudden attacks or violent outbursts characteristic of intermittent explosive disorder"
]

for y in d:
    y = sorted([x.lower() for x in y.split(" ")])
    print(" ".join(y))