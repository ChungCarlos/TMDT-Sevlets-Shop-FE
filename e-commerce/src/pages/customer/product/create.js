import CustomerHeader from "../../../components/customer/header";
import "./create.css"
import {useEffect, useState} from "react";
import axios from "axios";
import {Field, Form, Formik} from "formik";
import {Link, useNavigate} from "react-router-dom";
import Swal from "sweetalert2";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import app from "../../../firebase";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import {UploadModal} from "./edit";


export const CreateProduct = () =>{
    const [shops, setShop] = useState([])
    const [categories, setCategory] = useState([])
    const navigate = useNavigate()
    const [categoryVal, setCategoryVal] = useState(-1)
    const user = JSON.parse(sessionStorage.getItem('user'))
    const [brands, setBrand] = useState([])
    const [isUpdated, setIsUpdated] = useState(false)
    const [selectedImage, setSelectedImage] = useState(null)
    const [urlImage, setUrlImage ] = useState("")
    const [product, setProduct] = useState()
    const [file, setFile ] = useState()
    const [isUploading, setIsUploading] = useState(false);

    console.log(urlImage)
    useEffect(() => {
        if(user === null){
            navigate('/login')
        }else{
        const tabs = document.querySelectorAll('.tab-btn');
        const all_content = document.querySelectorAll('.content');
        const firstTab = tabs[0];
        const firstContent = all_content[0];

        firstTab.classList.add('active');
        firstContent.classList.add('active');
        tabs.forEach((tab, index) => {
            tab.addEventListener('click', (e) => {
                // console.log(e)
                tabs.forEach(tab => tab.classList.remove('active'))
                tab.classList.add('active')

                all_content.forEach(ct => ct.classList.remove('active'))
                all_content[index].classList.add('active');
            })
        })
        axios.get('http://localhost:8080/api/v1/shop/' + user.id + "?list=true").then((res) => {
            setShop(res.data.filter(shop => shop.enabled))
        }).catch(err => {
            console.log(err)
        })
        axios.get('http://localhost:8080/api/v1/category/all').then((res) =>{
            setCategory(res.data.filter(cate => cate.enabled === true))
        }).catch(err => {
            console.log(err)
        })
        }
        axios.get('http://localhost:8080/api/v1/brand/all?list=true').then((res) => {
            setBrand(res.data)
        }).catch(err => {
            console.log(err)
        })
    }, [isUpdated])
    const handleChangeSelect = (e) =>{
        console.log(e.target.value)
        setCategoryVal(e.target.value)
        setBrand(brands.filter(brand => brand.categories.filter(cate => cate.id === e.target.value)))
        console.log(brands)
        if(isUpdated){
            setIsUpdated(false)
        }else{
            setIsUpdated(true)
        }
    }
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setSelectedImage(reader.result);
        };

        if (file) {
            reader.readAsDataURL(file);
            uploadImageToFirebaseStorage(file).then(r => {
                console.log(r)
            }); // Thêm dòng này để tải hình ảnh lên Firebase Storage
        }
    };
    const uploadImageToFirebaseStorage = async (file) => {
        setIsUploading(true)
        try {
            const storage = getStorage(app);
            const storageRef = ref(storage, "images/" + file.name);
            await uploadBytes(storageRef, file);
            const imageURL = await getDownloadURL(storageRef);
            console.log(imageURL)
            setUrlImage(imageURL);
        } catch (error) {
            console.error("Lỗi khi tải hình ảnh lên Firebase Storage:", error);
        }
        setIsUploading(false)
    };

    return(
        <Formik
            initialValues={{
            name : "",
            alias : "",
            shortDescription : "",
            fullDescription : "",
            customer : user,
            cost : 0,
            price : 0,
            shop : {
                id : -1
            },

            discountPercent : 0,
            brand : {
                id : -1,

            },
            category : {
                id : -1
            },
                quantity : 0
        }}
            enableReinitialize={true}
        onSubmit={async (values) =>{
            values ={...values, mainImage : urlImage}
            console.log(values)
            await axios.post('http://localhost:8080/api/v1/products/add', values).then(res =>
                {
                    console.log(res)
                    Swal.fire("Create success!")
                    navigate('/customer/profile/product-manager')
                }
            ).catch(err => {
                console.log(err)
            })
        }}
        >
            <Form>
            <div id={'display-create'}>
                <div id={'customer-header'}>
                    <CustomerHeader></CustomerHeader>
                </div>
                <div id={'main-create'}>
                    <h2>Manage Product | Create New Product</h2>
                    <div id={'container-create'}>
                    <div id={'tab-box'}>
                        <button className={'tab-btn'} type={'button'}>Overview</button>
                        <button className={'tab-btn'} type={'button'}>Description</button>
                        <button className={'tab-btn'} type={'button'}>Images</button>
                        <Link to="/customer/profile/product-manager" style={{float:"right",paddingTop:'40px'}} id={'back-list'}><KeyboardBackspaceIcon></KeyboardBackspaceIcon> Back to List</Link>
                    </div>
                    <div id={'content-box'}>
                        <div className={'content'}>
                        <div id={'create-product-table'}>
                            <table>
                                <tr>
                                    <td>Product Name:</td>
                                    <td><Field name={'name'}placeholder={'Enter name product'}/></td>
                                </tr>
                                <tr>
                                    <td>Alias:</td>
                                    <td><Field name={'alias'}placeholder={'Enter name alias'}/></td>
                                </tr>
                                <tr>
                                    <td>Shop:</td>
                                    <td><Field component={'select'} name={'shop.id'} >
                                        <option value="">--Select--</option>
                                        {shops.map((item) => {
                                           return(
                                               <option value={item.id}>{item.name}</option>
                                           ) 
                                        })}
                                    </Field></td>
                                </tr>
                                <tr>
                                    <td>Category:</td>
                                    <td><Field component={'select'} name={'category.id'} onClick={e => handleChangeSelect(e)}>
                                        <option value="">--Select--</option>
                                        {categories.map((item) => {
                                        return(
                                            <option value={item.id}>{item.name}</option>
                                        )
                                    })}
                                    </Field></td>
                                </tr>
                                <tr>
                                    <td>Brand:</td>
                                    <td><Field name={'brand.id'} component={'select'}>
                                        <option value="">--Select--</option>
                                        {brands.map((item) => {
                                            return(
                                                <option value={item.id}>{item.logo === null ? "None" : item.logo}</option>
                                            )
                                        })}
                                    </Field>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Cost:</td>
                                    <td><Field name={'cost'}/></td>
                                </tr>
                                <tr>
                                    <td>Price:</td>
                                    <td><Field name={'price'}/></td>
                                </tr>
                                <tr>
                                    <td>Discount:</td>
                                    <td><Field name={'discountPercent'}/></td>
                                </tr>
                                <tr>
                                    <td>Quantity: </td>
                                    <td><Field name={'quantity'}></Field></td>
                                </tr>
                            </table>
                        </div>
                    </div>
                        <div className={'content'}>
                            <div id={'add-description-product'}>
                                <p>Short Description: </p>
                                <Field name={'shortDescription'} component={'textarea'}placeholder={'Enter short description'}></Field>
                                <p>Full Description:</p>
                                <Field name={'fullDescription'} component={'textarea'}placeholder={'Enter full description'}></Field>
                            </div>
                        </div>
                        <div className={'content'}>
                            <div id={'add-product-image'}>
                                <div className={'image-box-product'}>
                                    <p>Main image: </p>
                                    {selectedImage ? <img src={selectedImage}></img> : <img src={'/image/image-thumbnail.png'}></img>}
                                    <input type={'file'}
                                    onChange={e => handleImageChange(e)}/>
                                    <UploadModal isOpen={isUploading}></UploadModal>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                    <div id={'btn-submit'}>
                        <span><button id={'create-product'} type={'submit'}>Create</button> <Link to={'/customer/profile/product-manager'}><button id={'cancel-product'} type={'button'}>Cancel</button></Link></span>
                    </div>
            </div>

            </div>
            </Form>
        </Formik>
    )
}