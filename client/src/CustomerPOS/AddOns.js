import { Dialog, Listbox } from '@headlessui/react';
import { useState, useEffect } from 'react';
import './AddOns.css';
import './Menu.css';
import { TranslateBulk } from '../Translate';
// import defaultDrinkImage from './assets/boba.svg';


const serverURL = process.env.REACT_APP_SERVER_URL || 'http://localhost:9000';

const AddOn = ({name, price}) => (
    // return (
        <div>
            <h3>{name}</h3>
            <div>{`$${price.toFixed(2)}`}</div>
        </div>
    // )
)

export function AddOnDialog({menuId, menuName, menuPrice, enName}) {
    let [ isOpen, setIsOpen ] = useState(false);
    const [ addOns, setAddOns ] = useState([]);

    useEffect(() => {
        var abortController = new AbortController();
        const getMenu = async () => {
            try {
                var response = await fetch(serverURL+'/single', {
                    signal: abortController.signal,
                    method: 'POST',
                    headers: {
                        "Content-type": "application/json; charset = UTF-8"
                    },
                    body: JSON.stringify({'menu_add_ons': menuId})
                });
                var data = await response.json();
                console.log(data.response);
                setAddOns(data.response);
            }
            catch (error) {
                console.error('Error fetching data: ', error);
            }
        };
        getMenu();
        return () => {
            abortController.abort();
        }
    }, []);
    console.log(addOns);

    try {
        var temp = [];
        for (const addOn of addOns) {
            temp.push(addOn.name);
        }
        // console.log(temp);
        var translations = TranslateBulk(temp);
        // var translations = [];
        // if (menuItems[0].name !== 'default') {
        //   console.log(menuItems);
        //   translations = TranslateBulk(temp);
        // }
        console.log(addOns);
        for (let i = 0; i < translations.length && i < addOns.length; ++i) {
            addOns[i].name = translations[i];
        }
    }
    catch (error) {
        console.log(error);
    }
    const [ selectedAddOns, setSelectedAddOns ] = useState([]);

    const addOrderItem = () => {
        let orderAddOns = JSON.parse(sessionStorage.getItem("order-add-ons"));
        if (orderAddOns === null) {
            sessionStorage.setItem("order-add-ons", JSON.stringify([JSON.stringify(selectedAddOns)]));
        }
        else {
            console.log(orderAddOns);
            orderAddOns.push(JSON.stringify(selectedAddOns));
            sessionStorage.setItem("order-add-ons", JSON.stringify(orderAddOns));
        }
        let orderMenuItems = JSON.parse(sessionStorage.getItem("order-menu-items"));
        if (orderMenuItems === null) {
            sessionStorage.setItem("order-menu-items", JSON.stringify([JSON.stringify({"id": menuId, "name": menuName, "price": menuPrice})]));
        }
        else {
            orderMenuItems.push(JSON.stringify({"id": menuId, "name": menuName, "price": menuPrice}));
            sessionStorage.setItem("order-menu-items", JSON.stringify(orderMenuItems));
        }
        setIsOpen(false);
        setSelectedAddOns([]);
    }

    // let menuPicture = "./assets/"+menuName.toLowerCase().replaceAll(" ","_")+".jpeg";
    let menuPicture = enName.toLowerCase().replaceAll(" ", "_").replaceAll('.','')+".jpeg";
    // try {
    //     require(menuPicture);
    // }
    // catch (error) {
    //     console.log(error);
    //     menuPicture = defaultDrinkImage;
    // }

    const importAll = (r) => {
        let images = {};
        r.keys().map((item, index) => { images[item.replace('./','')] = r(item); });
        return images;
    }

    const images = importAll(require.context('./assets', false, /\.(png|jpe?g|svg)$/));

    console.log(images);

    if (!(menuPicture in images)) {
        menuPicture = 'boba.svg';
    }
    
    return (
        <>
        <button onClick={() => setIsOpen(true)}>
            <div className="menu-item">
                <img src={images[menuPicture]} alt="Default Drink"className='menu-image' />
                <h3>{menuName}</h3>
                <div className="menu-price">{`$${menuPrice.toFixed(2)}`}</div>
                {/* Likes functionality can be added if you have that data */}
            </div>
        </button>
        <Dialog className='addOnDialog' open={isOpen} onClose={() => setIsOpen(false)}>
            {/* <Dialog.Panel>
                <Dialog.Title>{menuName}</Dialog.Title>
            </Dialog.Panel> */}
            <Dialog.Panel>
                <Dialog.Title>{menuName}</Dialog.Title>
                {/* <Dialog.Description>
                    Add-Ons
                </Dialog.Description> */}
                {/* <ul>
                    {
                        addOns.map(item => (
                            <li>
                            // AddOn(item.name, item.price)
                                <AddOn key={item.id} {...item}/>
                            </li>
                        ))
                    }
                </ul> */}
                <Listbox value={selectedAddOns} onChange={setSelectedAddOns} multiple>
                    {/* <Listbox.Label>Select Add-Ons</Listbox.Label> */}
                    {/* <Listbox.Button>{selectedAddOns.map((item) => item.name).join(', ')}</Listbox.Button> */}
                    <Listbox.Button>Select Add-Ons</Listbox.Button>
                    <Listbox.Options>
                        {addOns.map((item) => (
                            <Listbox.Option key={item.id} value={item}>
                                <pre>
                                    {item.name}     {item.price}
                                </pre>
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </Listbox>
            <button onClick={() => addOrderItem() }>
                Add To Order
            </button>
            </Dialog.Panel>
        </Dialog>
        </>
    )
}