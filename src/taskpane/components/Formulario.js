import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { MyTextInput } from './MyTextInput';
import formJson from '../data/custom-form.json'
import { Myselect } from './MySelect';

const initialValues = {};
const requiredFields = {};

for (const input of formJson) {
    initialValues[input.name] = input.value;

    if( !input.validations ) continue;

    let schema = Yup.string()

    for (const rule of input.validations) {
        if (rule.type === 'required') {
            schema = schema.required('Este campo es requerido');
        }
        if (rule.type === 'minLength') {
            schema = schema.min( rule.value || 2, `Mínimo de ${rule.value || 2} caracteres`);
        }
        if ( rule.type === 'email') {
            schema = schema.email( `Revise el formato del email` );
        }
    }

    requiredFields[input.name] = schema;
}

const validationSchema = Yup.object({...requiredFields});

export const Formulario = () => {
  return (
    <div>
        <h1>Formulario</h1>
        <Formik
            initialValues={ initialValues}
            onSubmit={ (values) => {
                console.log(values)
            }}
            validationSchema={validationSchema}
        
        >
            { ({handleReset}) => (
                <Form noValidate>
                    { formJson.map( ({type, name, placeholder, label, options}) => {
                        if (type === 'input' || type === 'password' || type === 'email') {
                            return <MyTextInput
                                        label={label}
                                        name={name}
                                        type={type}
                                        placeholder={placeholder}
                                        key={name}
                                    />
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

                        throw new Error(`El type ${type} no es soportado`)

                    })}
                        <button type='submit' >Submit</button>
                        <button type="button" onClick={ handleReset }>Reset Form</button>
                </Form>
            )}
        </Formik>
    </div>
  )
}
