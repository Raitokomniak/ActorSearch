// A form for inputting the names of the actor or character and the show or movie they were in
export default function Form({topPlaceHolder, nameValue, setName, title, setTitle, setCharError, setLoading, setSearchState, instruction, formtitle1, formtitle2, buttonContent}){
    const handleSubmit = (event) => {
        try {
            event.preventDefault();
            setCharError(false);
            setLoading(true);
            setSearchState(1);
        }
        catch (TypeError){
        }
    };

    return (
        <span className="align-middle">
                <p className="instruction"> {instruction}</p>
            <div className="formDiv">
                <form onSubmit={handleSubmit}>
                    <h1>{formtitle1}</h1>
                    <p><input className="form-control form-control-lg" type="text" placeholder={topPlaceHolder} id="char" value={nameValue} onChange={(e) => setName(e.target.value)}></input></p>
                    <h1>{formtitle2}</h1>
                    <p><input className="form-control form-control-lg" type="text" placeholder="Enter Show/Movie Name" id="title" value={title} onChange={(e) => setTitle(e.target.value)}></input></p>
                    <p><button type="submit" className="btn btn-primary searchButton">{buttonContent}</button></p>
                </form>
            </div>
            </span>
        )
}