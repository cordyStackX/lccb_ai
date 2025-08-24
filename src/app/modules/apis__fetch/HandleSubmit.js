export default async function HandleSubmit(event, pdfFile, address) {

    event.preventDefault();

    if (!pdfFile) return import('sweetalert2').then(Swal => {
        Swal.default.fire({
            icon: 'error',
            title: 'Error',
            text: "Please upload a PDF file.",
        });
    });
    if (!address) return import('sweetalert2').then(Swal => {
        Swal.default.fire({
            icon: 'error',
            title: 'Error',
            text: "Please connect your wallet.",
        });
    });

    import('sweetalert2').then(Swal => {
        Swal.default.fire({
            icon: 'success',
            title: 'Success',
            text: "PDF uploaded successfully!",
        });
    });

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