const inputElement = document.querySelector('input');
const buttonElement = document.querySelector('button');
const divElement = document.querySelector('div');

window.onload = () => inputElement.focus(); // focar na no loading


function myPromise(value){
    return new Promise( (resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', `https://api.github.com/users/${value}/repos`);
        xhr.send(null);

        xhr.onreadystatechange = () =>{
            if(xhr.readyState === 4){
                if(xhr.status === 200){
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    reject(xhr.status);
                    }
            }
        }
    })
}


buttonElement.onclick = () => {
    const value = inputElement.value;
    
    if(value === ''){
        alert('Insert username');
    } else {
        loading();
        myPromise(value)
            .then( result => createElementsWithBox(result) )
            .catch( err => error(err));
    }
};

function loading(){
    divElement.innerHTML= '';
    divElement.removeAttribute('id'); //remover para que nao caia no style #container e gere o loading com width 1fr
    divElement.classList.toggle('loading');
}


function createElementsWithBox( result ){
    if (result.length === 0){
        divElement.removeAttribute('class'); // remover a classe para que nao gere o loading;
        alert('the repository is empty!');
    } else{
        divElement.innerHTML = '';
        divElement.removeAttribute('class'); // remover a classe para que nao gere o loading como um item;
        divElement.setAttribute('id', 'container'); // terá as propriedades css de id container


        // tentar utilizar o método map para não utilizar for
        for( var i = 0; i<result.length; i++){
            // Create tags Div, P
            const createDiv = document.createElement('div');
            createDiv.style.cursor = 'pointer';
            createDiv.setAttribute('onclick', `window.open("${result[i].html_url}");`);
            const createParagraf = document.createElement('p');
            const headerItem = document.createElement('h1');

            // Add content do H1
            const contentHeader = document.createTextNode(result[i].name[0].toUpperCase());
            headerItem.appendChild(contentHeader);

            // Add content to P
            const contentParagraf = document.createTextNode(`App Name: ${result[i].name}`);
            createParagraf.appendChild(contentParagraf);

            // Description
            const descriptionElement = document.createElement('p');
            const contentDescription = document.createTextNode(`Description: ${result[i].description}`);
            descriptionElement.appendChild(contentDescription);

            // add header, p, description to div
            createDiv.appendChild(headerItem); 
            createDiv.appendChild(createParagraf); 
            createDiv.appendChild(descriptionElement); 
            createDiv.classList.add('item');


            // add div to principal div;
            divElement.appendChild(createDiv);
            }
    }
}

// utilizei uma função para manter o código limpo na promise
function error(err){
    divElement.innerHTML = '';
    divElement.removeAttribute('id'); //remover para que nao caia no style #container e gere o loading com width 1fr. ou seja, o loading ficaria com tamanho de 1fr
    divElement.classList.toggle('loading');

    // err === xhr.status
    if (err === 404){
        alert('User not found!');
    } else {
        alert('Server error!');
    }
}




