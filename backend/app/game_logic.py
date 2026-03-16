def evaluate_guess(secret: str, guess: str):
    secret = secret.lower()
    guess = guess.lower()

    result = [{"letter": ch, "status": "absent"} for ch in guess]
    secret_chars = list(secret)
    used = [False] * 5

    # 1ª passagem: letras na posição certa
    for i in range(5):
        if guess[i] == secret[i]:
            result[i]["status"] = "correct"
            used[i] = True

    # 2ª passagem: letras que existem mas noutra posição
    for i in range(5):
        if result[i]["status"] == "correct":
            continue

        for j in range(5):
            if not used[j] and guess[i] == secret_chars[j]:
                result[i]["status"] = "present"
                used[j] = True
                break

    return result