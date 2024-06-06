offset = 10
c = 0
s = 1
opac = 0.01
txt = "text-shadow: "
for x in range(1, 10):
    txt += f'{c}px {c}px 0px '
    if c % 20 == 0:
        txt += f'rgba(255, 0, 0, {s:.2f}), '
    else:
        txt += f'rgba(255, 255, 255, {s:.2f}), '
    c += offset
    s -= opac

f = open('output.txt', 'w')
f.write(txt)
f.close()