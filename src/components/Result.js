export default function Result({actorImgURL, resultName, IMDB, resultFor, reset, title, backToSearch}){

    if(actorImgURL === ''){
        return(
            <div>
               <h1>Hey it's {resultName}</h1>
               <p><a href={IMDB} target="_blank" rel="noreferrer">IMDB</a></p>
               <p>No image available</p>
               <p>(Result for {resultFor})</p>
               <p><button onClick={reset}>Flex some more</button></p>
            </div>
        )
    }
    else {
        return(
            <div>
               <h1>Hey it's {resultName}</h1>
               <p><a href={IMDB} target="_blank" rel="noreferrer">
               <img src={actorImgURL} alt="This is who you were thinking of" width="300px"/></a></p>
               <p>(Result for <b>{resultFor}</b> from <b>{title}</b>)</p>
               <p>Click on image to go to IMDB</p>
               <p><button className="btn btn-primary" onClick={backToSearch}>Flex some more</button></p>
            </div>
        )
    }
}