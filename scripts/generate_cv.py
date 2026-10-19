"""Regenerate the starter CV PDF. Replace its draft details with real ones first."""
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor

OUT = Path(__file__).resolve().parents[1] / "public" / "Gehan-Malshan-CV-Template.pdf"
OUT.parent.mkdir(parents=True, exist_ok=True)

c = canvas.Canvas(str(OUT), pagesize=(595, 842))
c.setTitle("Gehan Malshan - CV template")
dark = HexColor("#171717")
accent = HexColor("#000000")
muted = HexColor("#777777")

def text(x, y, value, size=11, color=dark, font="Helvetica"):
    c.setFont(font, size)
    c.setFillColor(color)
    c.drawString(x, y, value)

def rule(y):
    c.setStrokeColor(HexColor("#D9D9D9"))
    c.line(44, y, 551, y)

def section(y, heading, lines):
    text(44, y, heading.upper(), 9, accent, "Helvetica-Bold")
    rule(y - 12)
    for i, line in enumerate(lines):
        text(44, y - 35 - 18 * i, line, 10.5, dark)

c.setFillColor(HexColor("#FFFFFF"))
c.rect(0, 0, 595, 842, stroke=0, fill=1)
c.setFillColor(accent)
c.rect(44, 770, 54, 5, stroke=0, fill=1)
text(44, 725, "Gehan Malshan", 32, dark, "Helvetica-Bold")
text(44, 700, "SOFTWARE ENGINEERING UNDERGRADUATE", 11, accent, "Helvetica-Bold")
text(44, 676, "Sri Lanka  |  Add your email, phone, GitHub, and LinkedIn", 10, muted)
rule(652)

section(625, "Profile", [
    "Software engineering undergraduate interested in building useful digital experiences.",
    "Replace this introduction with your focus, strengths, and career interests."
])
section(539, "Education", [
    "Undergraduate in Software Engineering",
    "Add university, degree details, expected graduation, and relevant coursework."
])
section(453, "Projects", [
    "Project name  |  Add technology stack and date",
    "Describe the problem, your contribution, and a measurable result if available.",
    "Add a second project with a repository or live demo link."
])
section(349, "Volunteering & Leadership", [
    "Role  |  Organization  |  Dates",
    "Describe your responsibilities and the community impact."
])
section(263, "Skills", [
    "Add only technologies and tools you have used or studied.",
    "Group them by languages, frameworks, tools, and working practices."
])

rule(115)
text(44, 91, "STARTER TEMPLATE", 8, accent, "Helvetica-Bold")
text(44, 74, "This draft contains prompts. Replace it with your completed CV before applying.", 9, muted)
text(44, 52, "Portfolio source: update src/data/portfolio.ts and replace this PDF in public/.", 8, muted)
c.save()
print(OUT)
