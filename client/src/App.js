import './App.css';
import ShowMenu from "./Menu.js";

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

function App() {
  //TODO
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
          {ShowMenu()}
        </p>
      </header>
    </div>
  );
}

export default App;
