import {useEffect, useState} from "react";
import axios from "axios";
import {Field, Form, Formik} from "formik";
 import './EditCustomer.css'
import Swal from "sweetalert2";
import {useDispatch, useSelector} from "react-redux";
import {createAction} from "@reduxjs/toolkit";
const updateStatus = createAction("update")

export default function EditCustomer(){
    const user = JSON.parse(sessionStorage.getItem('user'));
    const [updated, setUpdated] = useState(false)
    const status = useSelector(state => state.update)
    const dispatch = useDispatch()
   const [customer,setCustomer] = useState({
       email : "",
       firstName : "",
       lastName : "",
       addressLine1:"",
       addressLine2:"",
       phoneNumber : "",
       city:"",
       state : "",
       country : {
           id : ""
       }
   });
    const [country, setCountry] = useState([{
        id : 0,
        name : "",
        code : ""}]);

    useEffect(() => {
        axios.get("http://localhost:8080/api/v1/customers/list-country").then(res => {
            console.log(res.data)
            setCountry(res.data)
        }).catch(err => {
            console.log(err)
        })
        axios.get("http://localhost:8080/api/v1/customers/"+ user.id).then(res => {
            console.log(res.data)
            setCustomer(res.data)
        }).catch(err => {
            console.log(err)
        })
    }, [])

    const handleFormSubmit = (value) =>{
        console.log(value)
        axios.put('http://localhost:8080/api/v1/customers/update/'+user.id,value).then((res) =>{
                console.log("OK")
                console.log(value)
            sessionStorage.setItem('user', JSON.stringify(res.data))
            dispatch(updateStatus())
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: "Successfully updated personal information",
                showConfirmButton: false,
                timer: 10000
            })
            }
        )
    }

    return(
        <>
            <div className={'content-edit'}>
            <h1 className={'h1-edit'}>Edit Customer</h1>
            <Formik initialValues={customer} onSubmit={handleFormSubmit} enableReinitialize={true}>
                <Form>
                    <table>
                        <tbody>
                        <tr>
                            <td style={{textAlign:'left'}}> Email:</td>
                            <td><Field
                                style={{
                                    textAlign: 'left',
                                    width: '250px',
                                    marginLeft: '5px',
                                    background: '#e8e2e2',  // Màu tối cho trường chìm xuống
                                    // padding: '5px',  // Tùy chỉnh padding nếu cần
                                    borderRadius: '5px'  // Tùy chỉnh border radius nếu cần
                                }} type={'text'} name={'email'} readOnly/>
                            </td>
                            <td style={{textAlign:'left'}}> First Name:</td>
                            <td ><Field style={{textAlign:'left',width:'250px'}} type={'text'} name={'firstName'}></Field></td>
                        </tr>
                        <tr>
                            <td style={{textAlign:'left'}}> Last Name:</td>
                            <td><Field style={{textAlign:'left',width:'250px',marginLeft:'5px'}} type={'text'} name={'lastName'}></Field></td>
                            <td style={{textAlign:'left'}}> Address Line1:</td>
                            <td><Field style={{textAlign:'left',width:'250px'}} type={'text'} name={'addressLine1'}></Field></td>
                        </tr>
                        <tr>
                            <td style={{textAlign:'left'}}> Address Line2:</td>
                            <td><Field style={{textAlign:'left',width:'250px',marginLeft:'5px'}} type={'text'} name={'addressLine2'}></Field></td>
                            <td style={{textAlign:'left'}}> Phone Number:</td>
                            <td><Field style={{textAlign:'left',width:'250px'}} type={'text'} name={'phoneNumber'}></Field></td>
                        </tr>
                        <tr>
                            <td style={{textAlign:'left'}}>City:</td>
                            <td><Field style={{textAlign:'left',width:'250px',marginLeft:'5px'}} type={'text'} name={'city'}></Field></td>
                            <td style={{textAlign:'left'}}>State:</td>
                            <td><Field style={{textAlign:'left',width:'250px'}} type={'text'} name={'state'}></Field></td>
                        </tr>
                        <tr>
                            <td style={{textAlign:'left'}}>Country:</td>
                            <td style={{textAlign: 'left', paddingLeft:'20px'}}>
                                <Field as="select" name="country.id" style={{width:'250px'}}>
                                    <option>-- Country --</option>
                                    {country.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.code}
                                        </option>
                                    ))}
                                </Field>
                            </td>
                        </tr>
                        <tr>
                            <button className={'bnt-edit'} style={{margin:'30px'}}>Update</button>
                        </tr>
                        </tbody>
                    </table>
                </Form>
            </Formik>
            </div>
        </>
    )

}