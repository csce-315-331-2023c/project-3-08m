import './App.css';
import * as Menu from "./Menu.js";

// async function renderMenu() {
//   var menuJSON = await menu.getMenu();
//   console.log(menuJSON);
//   console.log(menuJSON.menu);
//   var menuList = [];
//   for (const item in menuJSON.menu) {
//     console.log(menuJSON.menu[item].id);
//     menuList.push(menuJSON.menu[item]);
//   }
//   return menuJSON;
// }

// function updateMenu(update) {
//   console.log(update);
//   var json;
//   fetch("http://localhost:9000/updateMenu", {
//     method: 'POST',
//     headers:{
//       "Accept": "application/json, text/plain, */*",
//       "Content-type": "application/json; charset = UTF-8"
//     },
//     body: JSON.stringify(update)
//   }).then((res) => {
//     console.log(res);
//   });
//   // console.log(res);
// }

function App() {
  //TODO
  var update = {'id': 555, 'name': 'test'};
  Menu.UpdateMenu(update);
  // var menuJSON = renderMenu();
  // console.log(menuJSON.menu);
  // for (const item in menuJSON.menu) {
  //   console.log(item.id);
  // }
  // renderMenu();
  // const menuList = this.state.Menu?.map((item) => {
  //   return <li key={item.id}>{item.name} {item.price}</li>
  // });
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Menu Items:
          {Menu.ShowMenu()}
        </p>
      </header>
    </div>
  );
}

export default App;
