export default async function HandleSubmit(event, pdfFile, address) {

    event.preventDefault();

    if (!pdfFile) return alert("Please upload a PDF file.");
    if (!address) return alert("Please connect your wallet.");

    const formData = new FormData();
    formData.append("pdf", pdfFile);
    formData.append("address", address);

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