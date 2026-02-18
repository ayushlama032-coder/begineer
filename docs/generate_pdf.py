"""Generate a simple PDF (no external dependencies) from PROJECT_WALKTHROUGH.md."""

from pathlib import Path

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "PROJECT_WALKTHROUGH.md"
TARGET = ROOT / "backend-concepts-guide.pdf"


def escape_pdf_text(value: str) -> str:
    return value.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")


def create_simple_pdf(lines: list[str]) -> bytes:
    # Very small PDF writer: one page, Helvetica font.
    objects = []

    def add_object(content: str) -> int:
        objects.append(content.encode("latin-1", errors="replace"))
        return len(objects)

    font_obj = add_object("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>")

    y = 800
    commands = ["BT", "/F1 11 Tf", "14 TL", "72 800 Td"]

    for line in lines:
        safe = escape_pdf_text(line.strip()[:110] if line.strip() else " ")
        commands.append(f"({safe}) Tj")
        commands.append("T*")
        y -= 14
        if y < 60:
            break

    commands.append("ET")
    stream = "\n".join(commands)
    content_obj = add_object(
        f"<< /Length {len(stream.encode('latin-1'))} >>\nstream\n{stream}\nendstream"
    )

    page_obj = add_object(
        f"<< /Type /Page /Parent 4 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 {font_obj} 0 R >> >> /Contents {content_obj} 0 R >>"
    )
    pages_obj = add_object("<< /Type /Pages /Kids [3 0 R] /Count 1 >>")
    catalog_obj = add_object("<< /Type /Catalog /Pages 4 0 R >>")

    result = [b"%PDF-1.4\n"]
    offsets = [0]

    for index, obj in enumerate(objects, start=1):
        offsets.append(sum(len(part) for part in result))
        result.append(f"{index} 0 obj\n".encode("latin-1"))
        result.append(obj)
        result.append(b"\nendobj\n")

    xref_offset = sum(len(part) for part in result)
    result.append(f"xref\n0 {len(objects) + 1}\n".encode("latin-1"))
    result.append(b"0000000000 65535 f \n")

    for offset in offsets[1:]:
        result.append(f"{offset:010d} 00000 n \n".encode("latin-1"))

    result.append(
        f"trailer\n<< /Size {len(objects) + 1} /Root {catalog_obj} 0 R >>\nstartxref\n{xref_offset}\n%%EOF\n".encode("latin-1")
    )

    return b"".join(result)


def build_pdf() -> None:
    lines = SOURCE.read_text(encoding="utf-8").splitlines()
    pdf_bytes = create_simple_pdf(lines)
    TARGET.write_bytes(pdf_bytes)
    print(f"Generated: {TARGET}")


if __name__ == "__main__":
    build_pdf()
