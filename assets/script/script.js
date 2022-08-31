let containerQuizzes = document.querySelector('.container-quizzes');
const main = document.querySelector('.main');
const mainCopy = main.innerHTML;
const quizzesurl = 'https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes';
let image, text, message;

quizzGet();


//Pega as informações sobre os quizzes na API
function quizzGet(){
    containerQuizzes = document.querySelector('.container-quizzes');
    const promise = axios.get(quizzesurl);
    promise.then(renderQuizzInfo);
    promise.catch();
}

//renderiza o quiz na tela principal;
function renderQuizzInfo(message){
    message=message.data;
    console.log(message);

    for (let cont = 0; cont < message.length; cont++){
        image=message[cont].image;
        text=message[cont].title;
        quizzShow(image, text);
    }
}

//cria a div que mostra o quiz na tela principal;
function quizzShow(image,text){
    const quizz = document.createElement('div');
    quizz.classList.add('quizz-show');
    
    const img = document.createElement('img');
    img.src=image;
    
    const gradient = document.createElement('div');
    gradient.classList.add('gradient');
    
    const p = document.createElement('p');
    p.innerText=text;
    
    quizz.appendChild(img);
    quizz.appendChild(gradient);
    quizz.appendChild(p);

    containerQuizzes.appendChild(quizz);
}

//apaga o html do elemento escolhido pelo parametro passado;
function eraseContent(main){
    main.innerHTML='';
}

//renderiza a página principal novamente (reiniciando);
function renderMainContent(){
    main.innerHTML=mainCopy;
    quizzGet();
}