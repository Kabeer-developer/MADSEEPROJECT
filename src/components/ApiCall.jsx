import { useEffect, useState } from "react";

function Fetch() {

    const [users, setUser] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function Call() {
            try {
                const response = await fetch('https://jsonplaceholder.typicode.com/users')
                if (!response.ok) {
                    throw new Error("could not fetch");
                } else {
                    const data = await response.json();
                    setUser(data);
                    setLoading(false);
                }
            } catch (e) {
                setError(e.message);
                setLoading(false);
            }
        }
        Call();
    },
        []);

    if (loading) return <div>Loading...</div>
    if (error) return <div>error : {error}</div>

    return (<div>
        {users.map((user) => {
            return <div key={user.id}>{user.name}</div>
        })}
    </div>)
}


export default Fetch;