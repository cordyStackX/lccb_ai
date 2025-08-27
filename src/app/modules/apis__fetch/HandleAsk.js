import { SweetAlert2 } from '@/app/modules/Modules__Imports';

export default async function HandleAsk(questions, address, setResponse, setLoading) {
    
    if (!questions || questions.length === 0) {
        console.error("No questions provided");
        return;
    }

    if (!address) {
        console.error("No address provided");
        return;
    }

    try {
        setLoading(true);
        const response = await fetch('/services/api/Ask__ai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ questions, address }),
        });

        const data = await response.json();

        if (response.ok) {
            setResponse(data);
            setLoading(false);
        } else {
            setLoading(false);
            SweetAlert2(
                'Error',
                "Error fetching data: " + data.error,
                'error',
                true,
                false
            );
        }
    } catch (error) {
        SweetAlert2(
            'Error',
            "Error fetching data: " + error.message,
            'error',
            true,
            false
        );
    }
}