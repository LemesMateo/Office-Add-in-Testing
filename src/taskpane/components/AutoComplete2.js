
import * as React from "react";

import { useFetch } from "../hooks/useFetch";


const AutoComplete2 = ({label}) => {
    const [suggestions, setSuggestions] = React.useState([]);
    const [suggestionIndex, setSuggestionIndex] = React.useState(0);
    const [suggestionsActive, setSuggestionsActive] = React.useState(false);
    const [value, setValue] = React.useState("");
    const [error, setError] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    // const data = ({fetchDir, query}) => {
        // var requestOptions = {
        //     method: 'GET',
        //     headers: myHeaders,
        //     body: raw,
        //     redirect: 'follow'
        //   };
        //   fetch(`${fetchDir}?query=${query}`, requestOptions)
        //     .then(response => response.text())
        //     .then(result => console.log(result))
        //     .then(result => setList(result.data))
        //     .catch(error => console.log('error', error));
    
    // }

    // const fetchFn = ( fetchUrl, query) => {
    //     var myHeaders = new Headers();
    //     myHeaders.append("Content-Type", "application/json");
    //     var requestOptions = {
    //         method: 'GET',
    //         headers: myHeaders,
    //         redirect: 'follow'
    //       };
    //       fetch(`${fetchUrl}?query=${query}`, requestOptions)
    //         .then(response => response.text())
    //         .then(result => console.log(result))
    //         .then(result => {
    //             setSuggestions(result.data);
    //             setSuggestionsActive(true);
    //         })
    //         .catch(error => console.log('error', error));
    // }

    

    const handleChange = (e) => {
        
        const query = e.target.value.toLowerCase();
        setValue(query);
        if (query.length > 1) {
            console.log("Query:", query);
            // const { error, loading } = useFetch(query, setSuggestions);
            fetch(`https://cd-net-demo2.eastus2.cloudapp.azure.com/api/v1.0/ContainersList?query=${query}`)
                .then(response => response.json())
                .then( response => setSuggestions(response.data))
                .catch(setError)
                .finally(() => setLoading(false))
            // const filterSuggestions = data.filter(
            //     (suggestion) => 
            //         suggestion.toLowerCase().indexOf(query) > -1
            // );

            // fetchFn( fetchDir, query );

            // setSuggestions(data);
            setSuggestionsActive(true);
        } else {
            setSuggestionsActive(false);
        }
    };

    const handleClick = (e) => {
        setSuggestions([]);
        setValue(e.target.innerText);
        setSuggestionsActive(false);
    };

    const handleKeyDown = (e) => {
        // UP ARROW
        if (e.keyCode === 38) {
            if( suggestionIndex === 0) {
                return;
            }
            setSuggestionIndex(suggestionIndex - 1);
            // dataSet(data[suggestionIndex - 1]);
        }
        // DOWN ARROW
        else if (e.keyCode === 40) {
            if (suggestionIndex - 1 === suggestions.length) {
                return;
            }
            setSuggestionIndex(suggestionIndex + 1);
            // dataSet(data[suggestionIndex + 1]);
        }
        // ENTER
        else if (e.keyCode === 13) {
            setValue(suggestions[suggestionIndex]);
            setSuggestionIndex(0);
            // dataSet(data[0]);
            setSuggestionsActive(false);
        }
    };

    const Suggestions = () => {
        console.log("Suggestions:", suggestions);
        return (
            <ul className="suggestions" >
                { 
                    
                    suggestions.map((suggestion, index) => {
                    return (
                        <li
                            className={index === suggestionIndex ? "active" : ""}
                            key={suggestion.data.id}
                            onClick={handleClick}
                        >
                            {suggestion.name}
                        </li>
                    )
                })}

            </ul>
        );
    };

    return (
        <div className="autocomplete" >
            <label htmlFor={label} className='ms-u-slideUpIn20 ms-font-xl ms-fontWeight-semilight' >{label}</label>
            <br/>
            <input
                className="inputAutoComplete"
                type='text'
                placeholder={label}
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
            />
            {suggestionsActive && <Suggestions/>}

        </div>
    );
};

export default AutoComplete2;