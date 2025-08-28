
export default async function CheckConnections() {

    const response = await fetch("/services/api/check__connections");
    const data = await response.json();

    if (response.ok) {
        return data;
    } else {
        return false;
    }

}
