import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Tab from 'react-bootstrap/Tabs';
import Tabs from 'react-bootstrap/Tabs';
import SearchEngine from './components/SearchEngine';

function App() {
  return (
    <div className="App">
        <Header/>
        <div className='container'>
            <Tabs defaultActiveKey="actor" transition={false} id="noanim-tab-example" className="mb-3 nav-fill" >
                <Tab eventKey="actor" title="Search for an actor">
                    <SearchEngine searchType='actor'/>
                </Tab>
                <Tab eventKey="character" title="Search for a character">
                    <SearchEngine searchType='character'/>
                </Tab>
          </Tabs>
        </div>
        <Footer/>
    </div>
  );
  
}

export default App;
