
import * as React from "react";



const AutoComplete = ({label, fetchUrl, displayName, keyName, setSelected }) => {
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
        let selected = suggestions.find( (x) => x[displayName] === e.target.innerText);
        setSelected(selected);
        console.log("selected:", selected);
        // console.log("setSelected:", setSelected);
        // console.log("suggestions[suggestionIndex](del click):", e.target);
        setSuggestionsActive(false);
    };

    const handleKeyDown = (e) => {
        // UP ARROW - FLECHA ARRIBA
        if (e.keyCode === 38) {
            if( suggestionIndex === 0) {
                return;
            }
            setSuggestionIndex(suggestionIndex - 1);
            // dataSet(data[suggestionIndex - 1]);
        }
        // DOWN ARROW - FLECHA ABAJO
        else if (e.keyCode === 40) {
            if (suggestionIndex - 1 === suggestions.length) {
                return;
            }
            setSuggestionIndex(suggestionIndex + 1);
            // dataSet(data[suggestionIndex + 1]);
        }
        // ENTER
        else if (e.keyCode === 13) {
            setValue(suggestions[suggestionIndex][displayName]);
            setSelected(suggestions[suggestionIndex]);
            console.log("suggestions[suggestionIndex](del enter):", suggestions[suggestionIndex]);
            setSuggestionIndex(0);
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
                className="inputAutoComplete ms-font-m ms-fontColor-neutralPrimary input ms-ListItem"
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