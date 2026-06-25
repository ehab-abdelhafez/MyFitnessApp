#!/usr/bin/env python3
"""Generate PWA app icons (no external image libraries needed).

"Volt / blacked-out" identity: near-black field, acid volt-green dumbbell,
harder (less rounded) silhouette. Pure SDF anti-aliasing -> zlib PNG.
"""
import zlib, struct, math, os

OUT = os.path.join(os.path.dirname(__file__), "..", "icons")
BG = (10, 10, 11)        # #0a0a0b near-black
VOLT = (199, 255, 46)    # #c7ff2e volt green


def clamp(x, lo=0.0, hi=1.0):
    return max(lo, min(hi, x))


def smoothstep(e0, e1, x):
    t = clamp((x - e0) / (e1 - e0))
    return t * t * (3 - 2 * t)


def sd_round_rect(px, py, cx, cy, hw, hh, r):
    dx = abs(px - cx) - (hw - r)
    dy = abs(py - cy) - (hh - r)
    ax, ay = max(dx, 0.0), max(dy, 0.0)
    return math.hypot(ax, ay) + min(max(dx, dy), 0.0) - r


def over(dst, src, a):
    return tuple(int(round(src[i] * a + dst[i] * (1 - a))) for i in range(3))


def render(size, maskable=False):
    s = float(size)
    bg_r = 0.0 if maskable else s * 0.16   # harder corners than the old squircle
    cx = cy = s / 2

    # chunkier, more aggressive dumbbell
    bar_hw, bar_hh = s * 0.215, s * 0.060
    inner_off, inner_hw, inner_hh = s * 0.215, s * 0.052, s * 0.170
    outer_off, outer_hw, outer_hh = s * 0.300, s * 0.058, s * 0.125
    plate_r = s * 0.018

    out = bytearray()
    for y in range(size):
        out.append(0)  # PNG filter type 0
        for x in range(size):
            fx, fy = x + 0.5, y + 0.5
            d_bg = sd_round_rect(fx, fy, cx, cy, s / 2, s / 2, bg_r)
            bg_cov = smoothstep(1.0, -1.0, d_bg)
            if bg_cov <= 0.0:
                out.extend((0, 0, 0, 0)); continue

            d = sd_round_rect(fx, fy, cx, cy, bar_hw, bar_hh, bar_hh)
            for off in (inner_off, -inner_off):
                d = min(d, sd_round_rect(fx, fy, cx + off, cy, inner_hw, inner_hh, plate_r))
            for off in (outer_off, -outer_off):
                d = min(d, sd_round_rect(fx, fy, cx + off, cy, outer_hw, outer_hh, plate_r))
            mark = smoothstep(1.0, -1.0, d)

            color = over(BG, VOLT, mark)
            out.extend((color[0], color[1], color[2], int(round(bg_cov * 255))))

    raw = bytes(out)
    comp = zlib.compress(raw, 9)

    def chunk(typ, data):
        return struct.pack(">I", len(data)) + typ + data + struct.pack(">I", zlib.crc32(typ + data) & 0xFFFFFFFF)

    return (b"\x89PNG\r\n\x1a\n"
            + chunk(b"IHDR", struct.pack(">IIBBBBB", size, size, 8, 6, 0, 0, 0))
            + chunk(b"IDAT", comp) + chunk(b"IEND", b""))


def write(name, size, maskable=False):
    with open(os.path.join(OUT, name), "wb") as f:
        f.write(render(size, maskable))
    print("wrote", name, size, "maskable" if maskable else "")


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    write("icon-192.png", 192)
    write("icon-512.png", 512)
    write("icon-maskable-512.png", 512, maskable=True)
    write("apple-touch-icon.png", 180)
    write("favicon.png", 64)
