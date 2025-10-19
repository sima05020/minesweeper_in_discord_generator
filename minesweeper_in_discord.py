import numpy as np


def make_board(w: int, h: int, mark: str, bomb: int, first_open: int):
    num_dict = {
        0: "zero",
        1: "one",
        2: "two",
        3: "three",
        4: "four",
        5: "five",
        6: "six",
        7: "seven",
        8: "eight",
        mark: mark,
    }
    if w <= 0 or h <= 0:
        return -1
    if bomb < 0 or bomb >= w * h:
        return -1
    if w * h - bomb < first_open:
        return -1
    big_board = [[0 for _ in range(w + 2)] for __ in range(h + 2)]
    arrange = []
    count = 0
    while count < bomb:
        tmp = np.random.randint(1, w * h + 1)
        if tmp not in arrange:
            arrange += [tmp]
            count += 1

    for i in range(1, h + 1):
        for j in range(1, 1 + w):
            if (i - 1) * w + j in arrange:
                big_board[i][j] = "||:" + mark + ":||"
    for i in range(1, 1 + h):
        for j in range(1, 1 + w):
            if big_board[i][j] != "||:" + mark + ":||":
                big_board[i][j] = (
                    "||:" + num_dict[cal_number(j, i, mark, big_board)] + ":||"
                )
    result = f"w×h : {w}×{h} , Bombs : {bomb} , first open : {first_open}\n"

    count = 0
    while count < first_open:
        tmp = np.random.randint(1, w * h + 1)
        x = (tmp - 1) % w + 1
        y = (tmp - 1) // w + 1
        if big_board[y][x] != "||:" + mark + ":||" and "||" in big_board[y][x]:
            big_board[y][x] = big_board[y][x][2:-2]
            count += 1
    for i in range(1, h + 1):
        result += "".join(big_board[i][1 : w + 1])
        result += "\n"
    return result


def cal_number(w: int, h: int, mark: str, board: list[list]):
    if board[h][w] == "||:" + mark + ":||":
        return mark
    num = 0
    pointLIST = [
        [w - 1, h - 1],
        [w - 1, h],
        [w, h - 1],
        [w + 1, h + 1],
        [w + 1, h],
        [w, h + 1],
        [w + 1, h - 1],
        [w - 1, h + 1],
    ]
    for point in pointLIST:
        if board[point[1]][point[0]] == "||:" + mark + ":||":
            num += 1
    return num


if __name__ == "__main__":
    print(make_board(8, 6, "death_pic", 8, 6))
