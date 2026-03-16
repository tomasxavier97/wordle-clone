import random


def load_words(path="words.txt"):
    with open(path, "r", encoding="utf-8") as f:
        words = [line.strip().lower() for line in f if len(line.strip()) == 5]

    return list(set(words))


WORDS = load_words()


def get_random_word():
    return random.choice(WORDS)


def is_valid_word(word: str) -> bool:
    return word.lower() in WORDS