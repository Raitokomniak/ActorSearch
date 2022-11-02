import {useState, React} from "react";
import axios from 'axios';
import Loading from "./Loading";
import NotFoundError from "./CharError";
import Form from "./Form";
import Result from "./Result";

var tempListNames = [];
var charList = [];
var paramString = '';
var topBilled = [];

export default function SearchEngine({searchType}){
    const [title, setTitle] = useState('');
    const [titleID, setTitleID] = useState('');
    const [charName, setCharName] = useState('');
    const [charNameF, setCharNameF] = useState('');
    const [actorName, setActorName] = useState('');
    const [actorID, setActorID] = useState('');
    const [reqComplete, setReqComplete] = useState(false);
    const [charError, setCharError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchState, setSearchState] = useState(0);
    const [actorIMDB, setActorIMDB] = useState('');
    const [actorImgURL, setActorImgURL] = useState('');
    const [charIMDB, setCharIMDB] = useState('');

    const options = { method: 'GET',
        headers: { 'X-RapidAPI-Key': process.env.REACT_APP_API_KEY, 'X-RapidAPI-Host': process.env.REACT_APP_DATABASE_URL}
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
        try{
            event.preventDefault();
            reset();
            setLoading(true);
            setSearchState(3);
        }
        catch (TypeError){}
    }

    //forcefully compares the strings first, if not found, then check if contained in the other string
    function compareNames(tempName, comparedTo){
        if(tempName.toLowerCase() === comparedTo.toLowerCase()) return true;
        return false;
    }

    function compareNameInclusion(tempName, comparedTo){
       if (tempName.toLowerCase().includes(comparedTo.toLowerCase())) return true;
       return false;
    }

    function completeReq(tempActorName, tempCharName, i){
        setActorIMDB('https://www.imdb.com/' + charList[i][1].name.id);
        setActorName(tempActorName);
        setActorID(charList[i][0]);
        setCharIMDB('https://www.imdb.com/title/' + titleID + '/characters/' + charList[i][0] + '');
        setCharName(charList[i][1].charname[0].characters[0]);

        try{ setActorImgURL(charList[i][1].name.image.url);}
        catch (TypeError){ setActorImgURL(''); }

        setReqComplete(true);
        setSearchState(0);
    }

    function titleSearch(){
        options.url = 'https://online-movie-database.p.rapidapi.com/auto-complete';
        options.params = {q: title};
        console.log("Looking for title...");
        axios.request(options).then(function (response) {
            setTitle(response.data.d[0].l);
            setTitleID(response.data.d[0].id);
            setSearchState(2);
            

         }).catch(function (error) {
             console.error(error);
         })
    }

    function topBilledSearch(){
        options.url = 'https://online-movie-database.p.rapidapi.com/title/get-top-cast';
            options.params = {tconst: titleID};

            axios.request(options).then(function (response) {
                console.log("Looking for top billed...");
                
                for(var i = 0; i < response.data.length; i++){
                    var tempID = '';
                    for(var j = 6; j < 15; j++) tempID += response.data[i][j];
                    topBilled[i] = tempID;
                }

                paramString = topBilled[0];
                for(var k = 1; k < topBilled.length; k++){
                    paramString += '&id=' + topBilled[k];
                }
                setSearchState(3);

            }).catch(function (error) {
                console.error(error);
            })
    }

    function characterSearch(){
        options.url = 'https://online-movie-database.p.rapidapi.com/title/get-charname-list';
        options.params = {tconst: titleID, id: paramString}

        axios.request(options).then(function (response) {
            console.log("Looking for characters...");
            charList =  Object.entries(response.data)
            
            for(var i = 0; i < charList.length; i++){
                setCharNameF(charList[i][1].charname[0].characters[0]);
                var tempCharName = charList[i][1].charname[0].characters[0];
                var tempActorName = charList[i][1].name.name;

                if(searchType === "actor"){
                    if(compareNames(charName, tempCharName)) { 
                    completeReq(tempActorName, tempCharName, i);
                    break;
                }}
                if(searchType === "character"){}
                if(compareNames(actorName, tempActorName)) { 
                    completeReq(tempActorName, tempCharName, i);
                    break;
                }
            }
            
            if(!reqComplete) {
                for(var i = 0; i < charList.length; i++){
                    setCharNameF(charList[i][1].charname[0].characters[0]);
                    var tempCharName = charList[i][1].charname[0].characters[0].toLowerCase();
                    var tempActorName = charList[i][1].name.name;

                    if(searchType === "actor"){
                        if(compareNameInclusion(charName, tempCharName)){
                        completeReq(tempActorName, tempCharName, i);
                        break;
                    }}
                    if(searchType === "character"){if(
                        compareNameInclusion(actorName, tempActorName)){
                        completeReq(tempActorName, tempCharName, i);
                        break;
                    }}

                    
                }
            }
            if(!reqComplete) {
                setCharError(true);
                setSearchState(0);
            }

        }).catch(function (error) {
            console.error(error);
        }).finally(() => setLoading(false));
    }
    if(reqComplete){
        if(searchType === "actor")      return <Result actorImgURL={actorImgURL} resultName={actorName} IMDB={actorIMDB} resultFor={charNameF} reset={reset} title={title} backToSearch={backToSearch}/>
        if(searchType === "character")  return <Result actorImgURL={actorImgURL} resultName={charName} IMDB={charIMDB} resultFor={actorName} reset={reset} title={title} backToSearch={backToSearch}/>
    }
    else if(loading){
        if(searchState === 1)       { titleSearch(); }
        else if(searchState === 2)  { topBilledSearch(); }
        else if(searchState === 3)  { characterSearch();}
        return <Loading/>
    }
    else if(charError){
        if(searchType === "actor")      return <NotFoundError type="actor" title={title} backToSearch={backToSearch} list={charList} tempListNames={tempListNames} handleNameFix={handleNameFix} setName={setCharName} listDesc="Characters from"/>
        if(searchType === "character")  return <NotFoundError type="character" title={title} backToSearch={backToSearch} list={charList} tempListNames={tempListNames} handleNameFix={handleNameFix} setName={setActorName} listDesc="Top billed"/>
    }
    else if(searchState < 1){
        if(searchType === "actor")      return <Form topPlaceHolder="Enter Character Name" instruction="Find the actor's name by referencing their character" formtitle1="Hey it's..." formtitle2="From..." buttonContent="Right?" nameValue={charName} setName={setCharName} title={title} setTitle={setTitle} setCharError={setCharError} setLoading={setLoading} setSearchState={setSearchState}/>
        if(searchType === "character")  return <Form topPlaceHolder="Enter Actor Name" formtitle1="What did..." formtitle2="Play in..." buttonContent="Search" instruction="Find the character name by referencing the actor" nameValue={actorName} setName={setActorName} title={title} setTitle={setTitle} setCharError={setCharError} setLoading={setLoading} setSearchState={setSearchState}/>
    }
}