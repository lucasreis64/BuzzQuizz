let containerQuizzes = document.querySelector('.container-quizzes');
let addButtom = document.querySelector('.quizzes-user button');
let content = document.querySelector('.content');
const main = document.querySelector('.main');

const mainCopy = main.innerHTML;
const quizzesurl = 'https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes';
let image, text, id, message;

quizzGet();


//Pega as informações sobre os quizzes na API
function quizzGet(){
    containerQuizzes = document.querySelector('.container-quizzes');
    addButtom = document.querySelector('.quizzes-user button');
    
    const promise = axios.get(quizzesurl);
    promise.then(renderQuizzInfo);
    promise.catch();
    
    addButtom.addEventListener("click", quizzMaker);
}

//renderiza o quiz na tela principal;
function renderQuizzInfo(message){
    msg=message.data;
    console.log(msg);

    for (let cont = 0; cont < msg.length; cont++){
        image=msg[cont].image;
        text=msg[cont].title;
        id = msg[cont].id;
        quizzShow(image, text,id);
    }
}

//cria a div que mostra o quiz na tela principal;
function quizzShow(image,text, id){
    const quizz = document.createElement('div');
    quizz.classList.add('quizz-show');
    quizz.id = id;
    
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
    quizz.addEventListener('click', quizzDataGet);

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

//inicia a criação do quizz;
function quizzMaker(){
    eraseContent(main);
    content = document.querySelector('.content');
    
    
}

//pega as informações do quizz especifico;
function quizzDataGet(){
    const quizzId = this.id;
    const promise = axios.get(`${quizzesurl}/${quizzId}`);
    promise.then(quizzOpening);
}

//renderiza a página do quizz;
function quizzOpening(message){
    eraseContent(main);
    message = message.data;
    main.innerHTML = 'adsfasdfasdfasdfasdfasdfasdfasdfas';
}


