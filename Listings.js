//document.getElementById("List").addEventListener('click', Listfunc("Hello"));
//document.getElementById("List").addEventListener('click' , function()
//    {
//    
//    document.getElementById("")
//});

function Listfunc(s)
{
    //Create local system to store Manifest data

    //Get manifest
            // read contents of the file
        const data = fs.readFileSync(Mloc, 'UTF-8');

        // split the contents by new line
        var lines = data.split(/\r?\n/);
    //Variables to access and mainttain listings
//let ListArray = localStorage.getItem('List') ? JSON.parse(localStorage.getItem('List')) : []
//localStorage.setItem('List', JSON.stringify(ListArray))
//const data = JSON.parse(localStorage.getItem('List'))    

//function displays listings when called
//const ListMaker = text => {
//  const li = document.createElement('li')
//  li.textContent = text
//  Listings.appendChild(li)
//}
//    //Loop for Manifest to be printed out
    for( int i = 0; lines.length; i++)
        {
            console.log(lines[i])
        }
//   
//    
}