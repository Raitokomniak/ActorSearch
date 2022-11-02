import {useRef} from 'react';

export default function NotFoundError({type, title, backToSearch, list, tempListNames, handleNameFix, setName, listDesc}){
    var charRefs = useRef([]);
    let elements = [];

    //create buttons for possible matches
    const createElements = () => {
        for(var i = 0; i < list.length; i++){
            if(list[i] === null) return;
            var tempName = '';
            if(type==="actor") tempName = list[i][1].charname[0].characters[0];
            if(type==="character") tempName = list[i][1].name.name;
            tempListNames[i] = tempName;
        }
            
        for(let i = 0; i < list.length; i++){
            elements.push(
                <tr key={`child-${i}`} ref={(ref) => charRefs.current.push(ref)}>
                    <td> 
                        <form onSubmit={handleNameFix}>
                        <button width="200px" className="btn btn-primary charButton" type="submit" onClick={() => setName(tempListNames[i])}>{tempListNames[i]}</button>
                        <input type="hidden" value={tempListNames[i]}/>
                        </form>
                    </td>
                </tr>
            )
        }
        return elements;
    }

    return (
        <div>
            <p>You might have mispelled that. Was it possibly any of these? <button className="btn btn-primary backButton" onClick={backToSearch}>No</button></p>
            <p className="charTitle">{listDesc} from {title}</p>
            <p/>
            <table width="100%" align="center">
                <tbody>
                    {createElements()}
                </tbody>
            </table>    
        </div>
    )
}