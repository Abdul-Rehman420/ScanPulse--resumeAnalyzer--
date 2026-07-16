import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Analysis } from "@/types";

export async function exportPDF(analysisId: string) {
  const element = document.getElementById(`analysis-report-${analysisId}`);
  if (!element) return;

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pageWidth - 20;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 10;

  pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
  heightLeft -= pageHeight - 20;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight + 10;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight - 20;
  }

  pdf.save(`resume-analysis-${analysisId}.pdf`);
}

export async function exportDOCX(analysis: Analysis) {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, AlignmentType } = await import("docx");

  const scoreToColor = (score: number) => {
    if (score >= 80) return "2AC5CA";
    if (score >= 60) return "22c55e";
    return "CA492A";
  };

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            children: [new TextRun({ text: "Resume Analysis Report", bold: true, size: 28, color: "1E293B" })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [new TextRun({ text: analysis.resume.originalName, size: 18, color: "64748b" })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),

          new Paragraph({
            children: [new TextRun({ text: "Scores", bold: true, size: 22, color: "1E293B" })],
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `ATS Score: `, bold: true, size: 20 }),
              new TextRun({ text: `${analysis.atsScore}/100`, size: 20, color: scoreToColor(analysis.atsScore) }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `Grammar: `, bold: true, size: 20 }),
              new TextRun({ text: `${analysis.grammarScore}/100`, size: 20, color: scoreToColor(analysis.grammarScore) }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `Keywords: `, bold: true, size: 20 }),
              new TextRun({ text: `${analysis.keywordScore}/100`, size: 20, color: scoreToColor(analysis.keywordScore) }),
            ],
            spacing: { after: 200 },
          }),

          new Paragraph({
            children: [new TextRun({ text: "Summary", bold: true, size: 22, color: "1E293B" })],
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [new TextRun({ text: analysis.summary, size: 20 })],
            spacing: { after: 400 },
          }),

          new Paragraph({
            children: [new TextRun({ text: "Strengths", bold: true, size: 22, color: "1E293B" })],
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
          ...analysis.strengths.map(
            (s) =>
              new Paragraph({
                children: [new TextRun({ text: `  ${s}`, size: 20 })],
                spacing: { after: 100 },
              })
          ),

          new Paragraph({
            children: [new TextRun({ text: "Areas for Improvement", bold: true, size: 22, color: "1E293B" })],
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
          ...analysis.weaknesses.map(
            (w) =>
              new Paragraph({
                children: [new TextRun({ text: `  ${w}`, size: 20 })],
                spacing: { after: 100 },
              })
          ),

          new Paragraph({
            children: [new TextRun({ text: "Recommendations", bold: true, size: 22, color: "1E293B" })],
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
          ...analysis.recommendations.map(
            (r, i) =>
              new Paragraph({
                children: [new TextRun({ text: `${i + 1}. ${r}`, size: 20 })],
                spacing: { after: 100 },
              })
          ),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `resume-analysis-${analysis.id}.docx`;
  a.click();
  URL.revokeObjectURL(url);
}
