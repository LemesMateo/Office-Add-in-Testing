import { ErrorMessage, useField  } from 'formik'
import * as React from "react";

export const MyTextInput = ( {label, ...props} ) => {
    const [field] = useField(props)

    return (
        <>
            <label htmlFor={props.id || props.name } className='ms-u-slideUpIn20 ms-font-xl ms-fontWeight-semilight' >{ label }</label>
            <br/>
            <input className='ms-font-m ms-fontColor-neutralPrimary input ms-ListItem' { ...field } {...props} />
            <br/>
            <ErrorMessage name={props.name} component="span" className='ms-font-l ms-fontWeight-semilight' />
        </>
    )
}