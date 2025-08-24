export default async function HandleAsk(event, questions, address, setResponse, setLoading) {
    event.preventDefault();

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
            import('sweetalert2').then(Swal => {
                Swal.default.fire({
                    icon: 'error',
                    title: 'Error',
                    text: "Error fetching data: " + data.error,
                });
            });
        }
    } catch (error) {
        import('sweetalert2').then(Swal => {
            Swal.default.fire({
                icon: 'error',
                title: 'Error',
                text: "Error fetching data: " + data.error,
            });
        });
    }
}