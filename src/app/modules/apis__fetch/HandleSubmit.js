import { SweetAlert2 } from '@/app/modules/Modules__Imports';

export default async function HandleSubmit(pdfFile, address) {

    if (!pdfFile) return SweetAlert2(
        'Error',
        'Please upload a PDF file.',
        'error',
        true,
        false
    );
    


    try {

        const formData = new FormData();
        formData.append("pdf", pdfFile);
        formData.append("address", address);

        const response = await fetch("/services/api/Connect__python", {
        method: "POST",
        body: formData,
        });

        const result = await response.json();

        if (response.ok) {
        SweetAlert2(
            'Uploaded Successfully',
            result.message || 'PDF uploaded successfully.',
            'success',
            true,
            false
        );
        } else {
        SweetAlert2(
            'Error',
            result.message || 'Error uploading PDF.',
            'error',
            true,
            false
        );
        }

    } catch (error) {
        console.error(`Error: ${error.message || "Unknown error"}`);
        SweetAlert2(
            'Error',
            error.message || 'Error uploading PDF.',
            'error',
            true,
            false
        );
    }

}