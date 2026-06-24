#!/usr/bin/env python3
"""Generate PWA app icons (no external image libraries needed).

Draws a dumbbell glyph on a brand-gradient rounded square using simple
signed-distance fields with anti-aliasing, then writes PNGs via zlib.
"""
import zlib, struct, math, os

OUT = os.path.join(os.path.dirname(__file__), "..", "icons")
BRAND_TOP = (99, 102, 241)     # indigo-500
BRAND_BOT = (139, 92, 246)     # violet-500
WHITE = (255, 255, 255)


def clamp(x, lo=0.0, hi=1.0):
    return max(lo, min(hi, x))


def smoothstep(edge0, edge1, x):
    t = clamp((x - edge0) / (edge1 - edge0))
    return t * t * (3 - 2 * t)


def sd_round_rect(px, py, cx, cy, hw, hh, r):
    """Signed distance to a rounded rectangle centred at (cx,cy)."""
    dx = abs(px - cx) - (hw - r)
    dy = abs(py - cy) - (hh - r)
    ax, ay = max(dx, 0.0), max(dy, 0.0)
    outside = math.hypot(ax, ay)
    inside = min(max(dx, dy), 0.0)
    return outside + inside - r


def over(dst, src, a):
    """Alpha-composite src (rgb) over dst (rgb) with coverage a."""
    return tuple(int(round(src[i] * a + dst[i] * (1 - a))) for i in range(3))


def render(size, maskable=False):
    s = float(size)
    # Background rounded-rect: full-bleed for maskable, inset rounded otherwise
    if maskable:
        bg_hw = bg_hh = s / 2
        bg_r = 0.0
        bg_cx = bg_cy = s / 2
    else:
        bg_hw = bg_hh = s / 2
        bg_r = s * 0.235
        bg_cx = bg_cy = s / 2

    # Dumbbell geometry (scaled to canvas). Keep inside maskable safe zone.
    cx = cy = s / 2
    bar_hw = s * 0.20
    bar_hh = s * 0.052
    bar_r = bar_hh
    # plates: inner (tall) and outer (taller) on each side
    inner_off = s * 0.205
    inner_hw = s * 0.045
    inner_hh = s * 0.155
    outer_off = s * 0.285
    outer_hw = s * 0.05
    outer_hh = s * 0.115
    plate_r = s * 0.035

    px_bytes = bytearray()
    for y in range(size):
        px_bytes.append(0)  # PNG filter type 0 per scanline
        for x in range(size):
            fx, fy = x + 0.5, y + 0.5
            # background coverage
            d_bg = sd_round_rect(fx, fy, bg_cx, bg_cy, bg_hw, bg_hh, bg_r)
            bg_cov = smoothstep(1.0, -1.0, d_bg)
            if bg_cov <= 0.0:
                px_bytes.extend((0, 0, 0, 0))
                continue
            # vertical gradient background colour
            t = fy / s
            base = tuple(int(round(BRAND_TOP[i] * (1 - t) + BRAND_BOT[i] * t)) for i in range(3))

            # dumbbell coverage = union of bar + 4 plates
            d = sd_round_rect(fx, fy, cx, cy, bar_hw, bar_hh, bar_r)
            for off in (inner_off, -inner_off):
                d = min(d, sd_round_rect(fx, fy, cx + off, cy, inner_hw, inner_hh, plate_r))
            for off in (outer_off, -outer_off):
                d = min(d, sd_round_rect(fx, fy, cx + off, cy, outer_hw, outer_hh, plate_r))
            db_cov = smoothstep(1.0, -1.0, d)

            color = over(base, WHITE, db_cov)
            a = int(round(bg_cov * 255))
            px_bytes.extend((color[0], color[1], color[2], a))

    raw = bytes(px_bytes)
    compressed = zlib.compress(raw, 9)

    def chunk(typ, data):
        c = struct.pack(">I", len(data)) + typ + data
        return c + struct.pack(">I", zlib.crc32(typ + data) & 0xFFFFFFFF)

    sig = b"\x89PNG\r\n\x1a\n"
    ihdr = struct.pack(">IIBBBBB", size, size, 8, 6, 0, 0, 0)  # 8-bit RGBA
    png = sig + chunk(b"IHDR", ihdr) + chunk(b"IDAT", compressed) + chunk(b"IEND", b"")
    return png


def write(name, size, maskable=False):
    path = os.path.join(OUT, name)
    with open(path, "wb") as f:
        f.write(render(size, maskable))
    print("wrote", path, size, "maskable" if maskable else "")


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    write("icon-192.png", 192)
    write("icon-512.png", 512)
    write("icon-maskable-512.png", 512, maskable=True)
    write("apple-touch-icon.png", 180)
    write("favicon.png", 64)
