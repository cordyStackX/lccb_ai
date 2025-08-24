export default async function HandleSubmit(event, pdfFile) {
  
    event.preventDefault();

    if (!pdfFile) return alert("Please upload a PDF file.");

    const formData = new FormData();
    formData.append("pdf", pdfFile);

    const response = await fetch("/services/api/Connect__python", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (response.ok) {
      alert(`PDF uploaded successfully: ${result.saved_to}`);
    } else {
      alert(`Error: ${result.error || "Unknown error"}`);
    }

    console.log(result);
}