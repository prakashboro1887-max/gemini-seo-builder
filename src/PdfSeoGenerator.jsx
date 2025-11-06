import React, { useState } from "react";
import * as pdfjsLib from "pdfjs-dist/webpack";

export default function PdfSeoGenerator() {
  const [seoTitle, setSeoTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async function () {
        const typedArray = new Uint8Array(this.result);
        const pdf = await pdfjsLib.getDocument(typedArray).promise;
        let text = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map((s) => s.str).join(" ");
        }

        // Simple SEO Title Suggestion
        const words = text
          .split(/\s+/)
          .filter((w) => w.length > 4)
          .slice(0, 8)
          .join(" ");

        setSeoTitle(`Best ${words} | SEO Optimized Title`);
        setLoading(false);
      };
      reader.readAsArrayBuffer(file);
    } catch (err) {
      console.error(err);
      alert("Failed to read PDF");
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        marginTop: "30px",
        padding: "20px",
        backgroundColor: "#161b22",
        borderRadius: "8px",
        color: "#e6edf3",
        border: "1px solid #30363d",
      }}
    >
      <h2 style={{ color: "#58a6ff", marginBottom: "10px" }}>
        📄 Upload PDF for SEO Title
      </h2>

      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileUpload}
        style={{
          background: "#0d1117",
          color: "#e6edf3",
          padding: "10px",
          borderRadius: "6px",
          border: "1px solid #30363d",
          cursor: "pointer",
        }}
      />

      {loading && <p style={{ marginTop: "10px" }}>⏳ Reading PDF...</p>}

      {seoTitle && (
        <div style={{ marginTop: "15px" }}>
          <strong>Suggested Title:</strong>
          <p
            style={{
              marginTop: "5px",
              backgroundColor: "#0d1117",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #30363d",
              wordWrap: "break-word",
            }}
          >
            {seoTitle}
          </p>
        </div>
      )}
    </div>
  );
}
