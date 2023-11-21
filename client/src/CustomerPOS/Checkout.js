import { useEffect } from "react";
import { NavLink, Routes, Route } from "react-router-dom";

const serverURL = process.env.REACT_APP_SERVER_URL || 'http://localhost:9000';

export const Checkout = () => {
    let orderMenuItems = JSON.parse(sessionStorage.getItem("order-menu-items"));
    let orderAddOns = JSON.parse(sessionStorage.getItem("order-add-ons"));
    let price = 0;
    // if (orderAddOns !== null) {
    //     for (const menuAddOn of orderAddOns) {
    //         for (const addOn of menuAddOn) {
    //             price += addOn.price;
    //         }
    //     }
    // }
    // if (orderMenuItems !== null) {
    //     for (const menuItem of orderMenuItems) {
    //         price += menuItem.price;
    //     }
    // }
    // console.log(orderMenuItems);
    // console.log(orderAddOns);
    var menuItemAddOns = []
    var parsedOrderAddOnsIds = [];
    var parsedOrderMenuItemsIds = [];
    if (orderAddOns !== null && orderMenuItems !== null) {
        for (let i = 0; i < orderMenuItems.length; i++) {
            var addOns = [];
            var parsedAddOns = JSON.parse(orderAddOns[i]);
            var parsedAddOnIds = [];
            console.log(parsedAddOns);
            for (let j = 0; j < parsedAddOns.length; j++) {
                // console.log(parsedAddOns[j]);
                // console.log(orderAddOns[i]);
                // addOns.push(JSON.parse(orderAddOns[i][j]));
                addOns.push(parsedAddOns[j]);
                parsedAddOnIds.push(parsedAddOns[j].id);
                price += parsedAddOns[j].price;
            }
            parsedOrderAddOnsIds.push(parsedAddOnIds);
            // parsedOrderAddOns.push(addOns);
            console.log(addOns);
            // console.log(JSON.parse(orderMenuItems[i]));
            menuItemAddOns.push({"menuItem": JSON.parse(orderMenuItems[i]), "addOns": addOns});
            price += JSON.parse(orderMenuItems[i]).price;
            parsedOrderMenuItemsIds.push(JSON.parse(orderMenuItems[i]).id);
        }
    }


    const CheckoutOrder = () => {
        // useEffect(() => {
            // var abortController = new AbortController();
            const checkout = async () => {
                try {
                    var response = await fetch(serverURL+"/updateOrders",{
                        // signal: abortController.signal,
                        method: "POST",
                        headers: {
                            "Content-type": "application/json; charset = UTF-8"
                        },
                        body: JSON.stringify({'add': {'price': price, 'addOns': parsedOrderAddOnsIds, 'menuItems': parsedOrderMenuItemsIds}})
                    });
                    var success = await response.json();
                    success = success.updateSuccess;
                    console.log(success);
                }
                catch (error) {
                    console.error(error);
                }
            }
            checkout();
            // return () => {
            //     abortController.abort();
            // }
        // }, []);
    }

    // console.log(menuItemAddOns);
    // menuItemAddOns.map((item) => {
    //     // console.log(item);
    //     console.log(item.menuItem.name);
    //     console.log(item.menuItem.price);
    // });

    return (
        <>
        <div>
            <header>
                {`$${price.toFixed(2)}`}
            </header>
            <ul>
                {
                    menuItemAddOns.map((item) => {
                        return (
                        <li>
                            <h1>
                                <pre>
                                    {item.menuItem.name}    {`$${item.menuItem.price.toFixed(2)}`}
                                </pre>
                            </h1>
                            <ul>
                                {
                                    item.addOns.map((addOn) => {
                                        return (
                                        <li>
                                            <pre>
                                                {addOn.name}    {`$${addOn.price.toFixed(2)}`}
                                            </pre>
                                        </li>
                                        )
                                    })
                                }
                            </ul>
                        </li>
                        )
                    })
                }
                {/* <li>
                    Bonk
                </li> */}
            </ul>
        </div>
        <div>
            <nav>
                <NavLink to="/customer" className={({ isActive }) => isActive ? 'active' : ''}>Cancel</NavLink>
            </nav>
            <Routes>
                <Route path="/customer" element={<Checkout />} />
            </Routes>
            <button onClick={() => CheckoutOrder()}>Checkout</button>
        </div>
        </>
    )
}