import {useRef, useEffect,useState, React} from "react";
import axios from 'axios';

let API_KEY;
let DATABASE_URL;

const aws = require('aws-sdk');

var charList = [];

export default function ActorSearch(){
    const s3 = new aws.S3({
        API_KEY: process.env.API_KEY,
        DATABASE_URL: process.env.DATABASE_URL
      });


    const [title, setTitle] = useState('');
    const [titleID, setTitleID] = useState('');
    const [charName, setCharName] = useState('');
    const [actorName, setActorName] = useState('');
    const [actorIMDB, setActorIMDB] = useState('');
    const [actorImgURL, setActorImgURL] = useState('');
    const [reqComplete, setReqComplete] = useState(false);
    const [charError, setCharError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchState, setSearchState] = useState(0);

    var tempListNames = [];
    var charRefs = useRef([]);
    let elements = [];

    
    const options = { method: 'GET', url: 'https://online-movie-database.p.rapidapi.com/auto-complete', 
        params: {q: title},
        headers: { 'X-RapidAPI-Key': s3.API_KEY, 'X-RapidAPI-Host': s3.DATABASE_URL}
        };

    const reset = (event) => {
        setCharError(false);
        setReqComplete(false);
        setLoading(false);
    }

    const backToSearch = (event) => {
        reset();
        setSearchState(0);
    }

    const handleNameFix = (event) => {
        if(event === undefined) return;
        //setCharName(charRefs.current[0].innerText);
        reset();
        event.preventDefault();
        setLoading(true);
        setSearchState(2);
    }

    const handleSubmit = (event) => {
        if(event === undefined) return;
        event.preventDefault();
        setCharError(false);
        setLoading(true);
        setSearchState(1);
    };

    const createElements = () => {
        for(var i = 0; i < charList.length; i++){
            if(charList[i] === null) return;
            var tempCharName = charList[i][1].charname[0].characters[0];
            tempListNames[i] = tempCharName;
           //console.log(tempCharName);
        }
        
        for(let i = 0; i < charList.length; i++){
            elements.push(
                <tr key={`child-${i}`} ref={(ref) => charRefs.current.push(ref)}>
                    <td> 
                        <form onSubmit={handleNameFix}>
                        <button width="200px"  class="btn btn-primary" type="submit" onClick={() => setCharName(tempListNames[i])}>{tempListNames[i]}</button>
                        <input type="hidden" value={tempListNames[i]}/>
                        </form>
                    </td>
                </tr>
            )
        }
        return elements;
    }

    
    useEffect(() => {  
    }, [])

    if(reqComplete === true){
        if(actorImgURL === ''){
            return(
                <div>
                   <h1>Hey it's {actorName}</h1>
                   <p><a href={actorIMDB} target="_blank" rel="noreferrer">IMDB</a></p>
                   <p>No image available</p>
                   <p><button onClick={reset}>Flex some more</button></p>
                </div>
            )
        }
        else {
            return(
                <div>
                   <h1>Hey it's {actorName}</h1>
                   <p><a href={actorIMDB} target="_blank" rel="noreferrer">
                   <img src={actorImgURL} alt="This is who you were thinking of" width="300px"/></a></p>
                   <p><button onClick={backToSearch}>Flex some more</button></p>
                </div>
            )
        }
    }
    else if(loading === true){
        console.log("Loading...");
        if(searchState === 1){
            axios.request(options).then(function (response) {
               setTitle(response.data.d[0].l);
               setTitleID(response.data.d[0].id);
               setSearchState(2);
                
            }).catch(function (error) {
                console.error(error);
            })
        }
        else if(searchState === 2){
            options.url = 'https://online-movie-database.p.rapidapi.com/title/get-top-cast';
            options.params = {tconst: titleID};

           // console.log("New search with charname " + charName);
            axios.request(options).then(function (response) {

                var topBilled = [];

                for(var i = 0; i < response.data.length; i++){
                    //console.log(response.data[i]);
                    var tempID = '';
                    for(var j = 6; j < 15; j++) tempID += response.data[i][j];
                    topBilled[i] = tempID;
                }

                var paramString = topBilled[0];

                for(var k = 1; k < topBilled.length; k++){
                    paramString += '&id=' + topBilled[k];
                }
                
                options.url = 'https://online-movie-database.p.rapidapi.com/title/get-charname-list';
                options.params = {tconst: titleID, id: paramString}

                axios.request(options).then(function (response) {
                    charList =  Object.entries(response.data)

                    for(var i = 0; i < charList.length; i++){
                        var tempCharName = charList[i][1].charname[0].characters[0].toLowerCase();
                        var tempActorName = charList[i][1].name.name;

                        if(tempCharName.includes(charName.toLowerCase())) {
                            setActorIMDB('https://www.imdb.com/' + charList[i][1].name.id);
                            setActorName(tempActorName);
                            try{
                                setActorImgURL(charList[i][1].name.image.url);
                            }
                            catch (TypeError){
                                setActorImgURL('');
                                //console.log("no image");
                            }
                            setReqComplete(true);
                        }
                    }

                    if(!reqComplete){
                        setCharError(true);
                    }

                }).catch(function (error) {
                    console.error(error);
                })

            }).catch(function (error) {
                console.error(error);
            }).finally(() => setLoading(false));
        }

        return(
            <div>
               <h1>Big braining...</h1>
            </div>
        )
    }
    else if(charError === true){
     //   console.log("charerror");

        return (
            <div>You might have mispelled that. Was it possibly any of these?
            <p/>
                <table width="100%" align="center"><tbody>
                {createElements()}
                </tbody></table>
                <p>
                <button class="btn btn-primary" onClick={backToSearch}>Back</button></p>
              </div>
            )

    }
    else if(searchState < 1){
        return(
            <span className="align-middle">
            <div>
                <form onSubmit={handleSubmit}>
                    <h1>Hey it's...</h1>
                    <p><input className="form-control" type="text" placeholder="Enter Character Name" id="char" value={charName} onChange={(e) => setCharName(e.target.value)}></input></p>
                    <h1>From...</h1>
                    <p><input className="form-control" type="text" placeholder="Enter Show/Movie Name" id="title" value={title} onChange={(e) => setTitle(e.target.value)}></input></p>
                    <p><button type="submit" className="btn btn-primary">Right?</button></p>
                </form>
            </div>
            </span>
        )
        
    }

    
}



