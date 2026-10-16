"""Image pipeline pure parts: naming + JPEG shrink (PIL)."""
import io


def storage_paths(district_id, n_images):
    """First image -> covers/, rest -> gallery/. Returns (cover, [gallery])."""
    cover = f'covers/d3292-{district_id}-0.jpg'
    gallery = [f'gallery/d3292-{district_id}-{i}.jpg'
               for i in range(1, n_images)]
    return cover, gallery


def shrink_jpeg(data, max_width=1600, quality=0.82):
    """Resize to max_width (keep aspect), return JPEG bytes."""
    from pillow_heif import register_heif_opener
    register_heif_opener()
    from PIL import Image
    img = Image.open(io.BytesIO(data)).convert('RGB')
    if img.width > max_width:
        img = img.resize((max_width, round(img.height * max_width / img.width)),
                         Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, 'JPEG', quality=int(quality * 100), optimize=True)
    return buf.getvalue()
