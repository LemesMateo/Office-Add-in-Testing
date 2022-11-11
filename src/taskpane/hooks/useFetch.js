import { useEffect, useState } from "react";

export const useFetch = (query, setData) => {
    // const [data, setData] = useState();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);

    console.log("Llamando antes del useEffect:", query);
    // useEffect(() => {
        // console.log("Llamando desde el useEffect:", query)
        setLoading(true);
        fetch(`https://cd-net-demo2.eastus2.cloudapp.azure.com/api/v1.0/ContainersList?query=${query}`)
            .then(response => response.json())
            .then( response => setData(response.data))
            .catch(setError)
            .finally(() => setLoading(false))
    // }, [query]);

    return { error, loading };
};