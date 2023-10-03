import "./App.css";
import SearchIcon from "./images/search.png";

function App() {
  return (
    <div className='app m-8'>
      <SearchBar />
    </div>
  );
}

const SearchBar = () => {
  return (
    <div>
      <div style={{ backgroundColor: "#FAFAFA" }} className='h-12 w-full rounded-xl flex items-center justify-center'>
        <input placeholder='Search Location' style={{ backgroundColor: "#FAFAFA", outline: "none" }} className='h-12 w-full rounded-xl pl-4' />
        <img className='h-4.5 mr-3' src={SearchIcon} alt='Search Icon' />
      </div>
    </div>
  );
};

export default App;
