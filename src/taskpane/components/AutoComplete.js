
import * as React from "react";



const AutoComplete = ({label, fetchUrl, displayName, keyName }) => {
    const [suggestions, setSuggestions] = React.useState([]);
    const [suggestionIndex, setSuggestionIndex] = React.useState(0);
    const [suggestionsActive, setSuggestionsActive] = React.useState(false);
    const [value, setValue] = React.useState("");
    const [error, setError] = React.useState("");
    const [loading, setLoading] = React.useState(false);
   

    const handleChange = (e) => {
        
        const query = e.target.value.toLowerCase();
        setValue(query);
        if (query.length > 1) {
            console.log("Query:", query);
            
            fetch(`${fetchUrl}&query=${query}`)
                .then(response => response.json())
                .then( response => setSuggestions(response.data))
                .catch(setError)
                .finally(() => setLoading(false))
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
        return (
            <ul className="suggestions" >
                { 
                    
                    suggestions.map((suggestion, index) => {
                    return (
                        <li
                            className={index === suggestionIndex ? "active" : ""}
                            key={suggestion[keyName]}
                            onClick={handleClick}
                        >
                            {suggestion[displayName]}
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

export default AutoComplete;