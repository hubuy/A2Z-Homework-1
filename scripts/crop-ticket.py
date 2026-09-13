#!/usr/bin/env python3
"""Crop a phone screenshot of a ticket down to the pass itself.

The pass has to meet its container on all four sides in the wallet, so the
crop must exclude the phone chrome above it, the soft glow around it, and the
phone background showing through its rounded corners.

Usage: scripts/crop-ticket.py <screenshot> <output.jpg>
"""
import sys

from PIL import Image

# The pass is deeply coloured; the phone background and its glow are not.
COLOUR_MAX = 215
# How far the pass's corner radius reaches in from the top and bottom edges.
CORNER_ROWS = 44
# Share of a row that must be pass for that row to count as inside the pass.
ROW_COVERAGE = 0.6
COL_COVERAGE = 0.5


def is_pass(pixel):
    return max(pixel) < COLOUR_MAX


def crop(path, out):
    im = Image.open(path).convert('RGB')
    w, h = im.size
    px = im.load()

    # Find the pass by the rows and columns it covers. Scanning inward along a
    # single line does not work: the middle column runs into the stub notch cut
    # out of the top edge, and an off-centre column runs into the status bar.
    rows = [y for y in range(h)
            if sum(1 for x in range(0, w, 4) if is_pass(px[x, y])) > (w / 4) * ROW_COVERAGE]
    if not rows:
        raise SystemExit(f'{path}: no ticket found')
    top, bottom = rows[0], rows[-1]

    cols = [x for x in range(w)
            if sum(1 for y in range(top, bottom, 4) if is_pass(px[x, y]))
            > ((bottom - top) / 4) * COL_COVERAGE]
    left, right = cols[0], cols[-1]

    card = im.crop((left, top, right + 1, bottom + 1))
    cw, ch = card.size
    cp = card.load()

    # The pass's corners are rounded, so the cropped rectangle still holds
    # background there. Extend each corner row's own colour outward to fill it;
    # the container's border-radius rounds the result back off.
    for y in list(range(min(CORNER_ROWS, ch))) + list(range(max(0, ch - CORNER_ROWS), ch)):
        inside = [x for x in range(cw) if is_pass(cp[x, y])]
        if not inside:
            continue
        first, last = inside[0], inside[-1]
        for x in range(first):
            cp[x, y] = cp[first, y]
        for x in range(last + 1, cw):
            cp[x, y] = cp[last, y]

    card.save(out, 'JPEG', quality=90, optimize=True)
    print(f'{out}: {cw}x{ch} from ({left},{top})-({right},{bottom})')


if __name__ == '__main__':
    if len(sys.argv) != 3:
        raise SystemExit(__doc__)
    crop(sys.argv[1], sys.argv[2])
