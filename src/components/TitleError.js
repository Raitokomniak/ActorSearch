export default function TitleError({backToSearch}){
    return(
        <div>
           <h1>Show/movie title was not recognized :(</h1>
           <p><button className="btn btn-primary" onClick={backToSearch}>Back</button></p>
        </div>
    )
}