## Client Management System — LaTeX Report

This folder contains a compilable LaTeX version of the project report.

### Files
- `main.tex`: Full report source
- `figures/`: Put screenshots/figures here (optional)

### How to compile (recommended)
Install **TeX Live** or **MiKTeX**, then run:

```bash
pdflatex main.tex
pdflatex main.tex
```

If you have `latexmk`:

```bash
latexmk -pdf -interaction=nonstopmode main.tex
```

### Adding screenshots
Place images in `figures/` and replace the placeholder boxes in **Appendix** with:

```latex
\includegraphics[width=\textwidth]{figures/<your-image-file>}
```

