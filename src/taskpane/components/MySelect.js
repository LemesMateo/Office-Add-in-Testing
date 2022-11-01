import { ErrorMessage, useField } from 'formik';
import * as React from "react";

export const Myselect = ({label, ...props}) => {
    const [field] = useField(props);

    return ( 
        <>
            <label htmlFor={props.id || props.name }>{label}</label>
            <select {...field} {...props} />
            <ErrorMessage name={props.name} component="span" />
        </>
    )
}