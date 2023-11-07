import { Component, useEffect, useState } from "react";

// export async function getMenu() {
//     // var menu = await Database.getMenu();
//     const res = await fetch('http://localhost:9000/menu');
//     const menu = await res.json();
//     console.log(menu);
//     for (let i = 0; i < menu.length; i++) {
//         console.log(menu[i].id);
//     }
//     return menu;
// }

const ShowMenu = () => {
    const [items, setItems] = useState([]);

    useEffect( () => {
        async function fetchMenu() {
            try {
                const res = await fetch("http://localhost:9000/menu");
                const json = await res.json();
                setItems(json.menu);
            }
            catch (err) {
                console.log(err);
            }
        }
        fetchMenu();
    }, []);
    // console.log(items);
    return (
        <div>
            <ul>
                {items.map((item) => {
                    return <li key={item.id}>{item.name}: {item.price}</li>
                })}
            </ul>
        </div>
    )
}

export default ShowMenu;

// class Menu extends Component {
//     constructor() {
//         super();
//         this.setState = {};
//     }

//     componentDidMount() {
//         fetch("http://localhost:9000/menu")
//             .then(res => res.json())
//             .then(data => this.setState({data}));
//     }

//     render() {
//         console.log(this.state.data);
//         var menu = this.state.data?.map((item) => {
//             return <li key={item.id}>{item.name}: {item.price}</li>
//         })
//         return (
//             <div>
//                 <ul>
//                     {menu}
//                 </ul>
//             </div>
//         );
//     }
// }

// export default Menu;