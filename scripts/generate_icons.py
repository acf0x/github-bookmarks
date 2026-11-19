"""Generate the three local PNG extension icons without runtime assets."""

from pathlib import Path
import struct
import zlib


def inside_polygon(x, y, points):
    odd = False
    previous = points[-1]
    for point in points:
        if ((point[1] > y) != (previous[1] > y)) and x < (previous[0] - point[0]) * (y - point[1]) / (previous[1] - point[1]) + point[0]:
            odd = not odd
        previous = point
    return odd


def chunk(kind, data):
    return struct.pack('>I', len(data)) + kind + data + struct.pack('>I', zlib.crc32(kind + data))


def write_icon(size):
    pixels = bytearray()
    shape = [(0.36, 0.23), (0.64, 0.23), (0.64, 0.77), (0.5, 0.66), (0.36, 0.77)]
    for y in range(size):
        pixels.append(0)
        for x in range(size):
            nx = (x + .5) / size
            ny = (y + .5) / size
            in_box = .07 < nx < .93 and .07 < ny < .93
            corner = min(nx - .07, .93 - nx, ny - .07, .93 - ny)
            rounded = in_box and (corner > .17 or ((min(nx - .07, .93 - nx) - .17) ** 2 + (min(ny - .07, .93 - ny) - .17) ** 2 < .17 ** 2))
            if inside_polygon(nx, ny, shape):
                pixels.extend((255, 255, 255, 255))
            elif rounded:
                pixels.extend((9, 105, 218, 255))
            else:
                pixels.extend((0, 0, 0, 0))
    ihdr = struct.pack('>2I5B', size, size, 8, 6, 0, 0, 0)
    png = b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', ihdr) + chunk(b'IDAT', zlib.compress(pixels)) + chunk(b'IEND', b'')
    Path(f'icons/icon-{size}.png').write_bytes(png)


Path('icons').mkdir(exist_ok=True)
for dimension in (16, 48, 128):
    write_icon(dimension)
