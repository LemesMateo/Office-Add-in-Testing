import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { MyTextInput } from './MyTextInput';
import formJson from '../data/custom-form.json'
import { Myselect } from './MySelect';
import React from 'react';
// import { DefaultButton } from "@fluentui/react";

const initialValues = {};
const requiredFields = {};

for (const input of formJson) {
    initialValues[input.name] = input.value;

    if( !input.validations ) continue;

    let schema = Yup.string()

    for (const rule of input.validations) {
        if (rule.type === 'required') {
            schema = schema.required('This field is required');
        }
        if (rule.type === 'minLength') {
            schema = schema.min( rule.value || 2, `At least ${rule.value || 2} characters required`);
        }
        if ( rule.type === 'email') {
            schema = schema.email( `Check email format` );
        }
    }

    requiredFields[input.name] = schema;
}

const validationSchema = Yup.object({...requiredFields});

export const Formulario = ({submit}) => {
  return (
    <div>
        {/* <h1 className='ms-fontSize-su ms-fontWeight-semilight ms-fontColor-neutralPrimary'>Dynamic Form</h1> */}
        <Formik
            initialValues={ initialValues}
            onSubmit={async (values) => {
                submit(JSON.stringify(values));
                console.log('Submit succeded');
            }}
            validationSchema={validationSchema}
        
        >
            { ({handleReset}) => (
                <Form noValidate>
                    { formJson.map( ({type, name, placeholder, label, options}) => {
                        if (type === 'input' || type === 'password' || type === 'email') {
                            return <div className='ms-List' ><MyTextInput
                                        label={label}
                                        name={name}
                                        type={type}
                                        placeholder={placeholder}
                                        key={name}
                                    />
                                    <br/>
                                    </div>
                        } else if (type === 'select') {
                            return (
                                <Myselect
                                    key={name}
                                    label={label}
                                    name={name}
                                >
                                    <option value='' >Select an option</option>
                                    {
                                        options?.map( ({id, label}) => (
                                            <option key={id} value={id}>{label}</option>
                                        ))
                                    }

                                </Myselect>
                            )
                        }

                        throw new Error(`Type ${type} is not supported`)

                    })}
                        <button type='submit'>Enviar</button>
                        {/* <button type="button" onClick={ handleReset }>Reset Form</button> */}
                </Form>
            )}
        </Formik>
    </div>
  )
}
