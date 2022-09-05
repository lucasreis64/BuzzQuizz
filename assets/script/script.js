let containerQuizzes = document.querySelector('.container-quizzes');
let addButtom = document.querySelector('.quizzes-user button');
let content = document.querySelector('.content');
let main = document.querySelector('.main');
let questionsQuizz, levelsQuizz, quizzUser = {},
    personalQuizzId = [];
const contentCopy = content.innerHTML;
const quizzesurl = 'https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes';
let image, text, id, message, returned;
let containUserQuizzes = []
let quizzId;
let  cover,title,questions,levels,header,child = 0,question,backgroundQuestion,answers;
let quizzCover,quizzCoverImg, quizzTitle; 
let  quizzQuestions, questionContainer, questionTitle, answersDiv;
let answersChildDiv, answerDiv,answerImage, answerP;
let correctAnswer = 0;
let quest,matte,correct,incorrect;
let scrollToQuestion,contScroll;
let percentage = 0;
let userLevel;
let levelContainer,allFinishedQuestions;
let levelTitle, levelImage, levelText;
let  buttons;
let quizzPage;
let contador = 0;

//----- loading até carregar as informações
quizzLoading();
// --- pegando id do local storage--- 
let storageID = localStorage.getItem ("id"); // pegar o que tem no storage ""
storageID = JSON.parse(storageID); 
let arrayUserQuizzID;
if (storageID == null){
    arrayUserQuizzID = [];
}else{
    arrayUserQuizzID = storageID;
    changeUserArea()
}
//Pega as informações sobre os quizzes na API

quizzGet();


function quizzGet() {
    
    containerQuizzes = document.querySelector('.container-quizzes')

    containerQuizzes = document.querySelector('.container-quizzes');
    addButtom = document.querySelector('.quizzes-user button');
    const promise = axios.get(quizzesurl);
    promise.then(renderQuizzInfo);
    promise.catch();
    addButtom.addEventListener("click", quizzMaker);
}

//renderiza o quiz na tela principal;
function renderQuizzInfo(message) {
    const loading = document.querySelector(".quizz-loading")
    loading.style.display="none";
    msg = message.data;
    console.log(arrayUserQuizzID)
    for (let i = 0; i < arrayUserQuizzID.length; i++) {
        msg = msg.filter(function(el) { return el.id != arrayUserQuizzID[i]; });
    }            

    console.log(msg);

    for (let cont = 0; cont < msg.length; cont++) {
        image = msg[cont].image;
        text = msg[cont].title;
        id = msg[cont].id;
        quizzShow(image, text, id, containerQuizzes);
    }


}

//cria a div que mostra o quiz na tela principal;
function quizzShow(image, text, id, local) {
  
    const quizz = document.createElement('div');
    quizz.classList.add('quizz-show');
    quizz.id = id;

    const img = document.createElement('img');
    img.src = image;

    const gradient = document.createElement('div');
    gradient.classList.add('gradient');

    const p = document.createElement('p');
    p.innerText = text;

    quizz.appendChild(img);
    quizz.appendChild(gradient);
    quizz.appendChild(p);

    local.appendChild(quizz);
    quizz.addEventListener('click', quizzDataGet);
}


//apaga o html do elemento escolhido pelo parametro passado;
function eraseContent(mainn) {
        mainn.remove();
}

//renderiza a página principal novamente (reiniciando);
function renderMainContent() {
    eraseContent(main);
    content.innerHTML = contentCopy;
    quizzGet();
    location.reload()
}

//inicia a criação do quizz;
function quizzMaker() {
    eraseContent(main);
    content = document.querySelector('.content');
    quizzMakerOne();
}

//renderiza página 1
function quizzMakerOne() {
    content.innerHTML = `
    <div class=".main">
    <div class="quizz-maker-container">
        <div class="quizz-maker1">
            <h2>Comece pelo começo</h2>
            <form action="#" onsubmit="quizzMakerTwo()">
                <div class="info">
                    <input type="text" placeholder="Título do seu quizz" oninput="setCustomValidity('');"
                        maxlength="65" pattern=".{20,}" required
                        oninvalid="this.setCustomValidity('Insira entre 20 e 65 caracteres!');">
                    <input type="url" placeholder="URL da imagem do seu quizz" oninput="setCustomValidity('');"
                        required oninvalid="this.setCustomValidity('Formato inválido');">
                    <input type="number" placeholder="Quantidade de perguntas do quizz"
                        oninput="setCustomValidity('');" min="3" required
                        oninvalid="this.setCustomValidity('Valor mínimo= 3, apenas números inteiros.');">
                    <input type="number" placeholder="Quantidade de níveis do quizz"
                        oninput="setCustomValidity('');" min="2" required
                        oninvalid="this.setCustomValidity('Valor mínimo= 2, apenas números inteiros.');">
                </div>
                <input type="submit" value="Prosseguir para criar perguntas">
            </form>
    </div>
    </div>`
}

//renderiza página 2
function quizzMakerTwo() {
    quizzUser.title = document.querySelector('.info input:first-child').value;
    quizzUser.image = document.querySelector('.info input:nth-child(2)').value;
    questionsQuizz = document.querySelector('.info input:nth-child(3)').value;
    levelsQuizz = document.querySelector('.info input:nth-child(4)').value;
    eraseContent(main);

    const questionStructure = `
    <div class="main">
    <div class="quizz-maker-container">
            <div class="quizz-maker2">
                <h2>Crie suas perguntas</h2>
                <form action="#" onsubmit="quizzMakerThree()">
                </form>
            </div>
    </div>
    </div>
    `

    content.innerHTML = questionStructure;
    const form = document.querySelector('.quizz-maker2 form');

    for (let cont = 0; cont < questionsQuizz; cont++) {
        const questionNumber = document.createElement('div');
        const h3 = document.createElement('h3');
        h3.innerText = `Pergunta ${cont+1}`;
        const img = document.createElement('img');
        img.src = `./assets/images/Vector.svg`;
        questionNumber.classList.add('question-number');
        questionNumber.appendChild(h3);
        questionNumber.appendChild(img);
        addHTML(questionNumber);
        form.appendChild(questionNumber);
        if (cont == 0) {
            rewriteQuestionDivCopy(questionNumber);
        } else {
            img.addEventListener('click', rewriteQuestionDiv);
        }
    }
    const input = document.createElement('button');
    input.innerHTML = 'Prosseguir para criar níveis'
    form.appendChild(input);
    input.addEventListener('click', hiddenChecker);
}

function addAnotherAnswer() {
    const buttonCopy = this;
    const parent = this.parentNode;
    const answersArray = parent.querySelectorAll('.answer');
    this.remove();
    const inputAnswer = document.createElement('input');
    const inputImage = document.createElement('input');

    inputAnswer.classList.add('answer');
    inputAnswer.setAttribute("type", "text");
    inputAnswer.setAttribute("oninput", "setCustomValidity('');");
    inputAnswer.setAttribute("placeholder", `Resposta incorreta ${answersArray.length}`);
    inputAnswer.setAttribute("oninvalid", "this.setCustomValidity('Formato inválido')");

    inputImage.classList.add('image');
    inputImage.setAttribute("type", "text");
    inputImage.setAttribute("oninput", "setCustomValidity('');");
    inputImage.setAttribute("placeholder", `Resposta incorreta ${answersArray.length}`);
    inputImage.setAttribute("oninvalid", "this.setCustomValidity('Formato inválido')");

    /*     const incorrectAnswerElement = `
        <input class = "answer" type="text" placeholder="Resposta incorreta ${answersArray.length}" oninput="setCustomValidity('');" required
        oninvalid="this.setCustomValidity('Texto não pode estar vazio!')">
        <input class = "image" type="url" placeholder="URL da imagem ${answersArray.length}" oninput="setCustomValidity('');" required
        oninvalid="this.setCustomValidity('Formato inválido')">` */

    parent.appendChild(inputAnswer);
    parent.appendChild(inputImage);
    parent.appendChild(buttonCopy);

    if (answersArray.length === 3) {
        this.remove();
    }
}

function hiddenChecker() {
    if (document.querySelector('.hidden') !== null) {
        alert('Clique nas outras perguntas para prosseguir!');
    }
}

//adiciona elementos HTML à div da pergunta
function addHTML(param) {
    const h3 = param.querySelector('h3').innerText;
    const infoHidden = document.createElement('div');
    infoHidden.classList.add('info', 'hidden');
    infoHidden.innerHTML += `
        <h3>${h3}</h3>
        <input type="text" placeholder="Texto da pergunta" oninput="setCustomValidity('');"
            pattern=".{20,}" required
            oninvalid="this.setCustomValidity('Insira no mínimo 20 caracteres!')">
        <input type="text" placeholder="Cor de fundo da pergunta" pattern="#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?" oninput="setCustomValidity('');"
            required oninvalid="this.setCustomValidity('Formato inválido')">
        <h3>Resposta correta</h3>
        <input type="text" class="answer" placeholder="Resposta correta" oninput="setCustomValidity('');" required
            oninvalid="this.setCustomValidity('Texto não pode estar vazio')">
        <input type="url" class="image" placeholder="URL da imagem" oninput="setCustomValidity('');" required
            oninvalid="this.setCustomValidity('Formato inválido')">
        <h3>Respostas incorretas</h3>
        <input type="text" class="answer" placeholder="Resposta incorreta 1" oninput="setCustomValidity('');" required
            oninvalid="this.setCustomValidity('Texto não pode estar vazio!')">
        <input type="url" class="image" placeholder="URL da imagem 1" oninput="setCustomValidity('');" required
            oninvalid="this.setCustomValidity('Formato inválido')">`
    param.appendChild(infoHidden);
    const addAnswerButton = document.createElement('div');
    addAnswerButton.innerHTML = 'Adicione uma nova resposta';
    addAnswerButton.classList.add('add-answer')
    infoHidden.appendChild(addAnswerButton);
    addAnswerButton.addEventListener('click', addAnotherAnswer);
}

//reescreve a div da pergunta
function rewriteQuestionDiv() {
    const box = this.parentNode;
    console.log(box.querySelector('.hidden'));
    const information = box.querySelector('.hidden');
    box.removeChild(box.firstElementChild);
    box.removeChild(box.firstElementChild);
    box.classList.remove('question-number');
    information.classList.remove('hidden');
}
//faz a msm coisa que a original
function rewriteQuestionDivCopy(esse) {
    const box = esse.parentNode;
    console.log(esse.querySelector('.hidden'));
    const information = esse.querySelector('.hidden');
    esse.removeChild(esse.firstElementChild);
    esse.removeChild(esse.firstElementChild);
    esse.classList.remove('question-number');
    information.classList.remove('hidden');
}

function getValues() {
    let infoArray = document.querySelectorAll('.info');
    quizzUser.questions = [{
        title: '',
        color: '',
        answers: [{
            text: '',
            image: '',
            isCorrectAnswer: true
        }]
    }];
    let answersArray, imagesArray, inputArray;
    for (let cont = 0; cont < questionsQuizz; cont++) {
        const disgusting = infoArray[cont];
        console.log('okok0');

        answersArray = disgusting.querySelectorAll('.answer');
        console.log('okok1');
        imagesArray = disgusting.querySelectorAll('.image');
        console.log('okok2');
        inputArray = disgusting.querySelectorAll('input');

        console.log('inputArray[0]', inputArray[0].value);
        quizzUser.questions[cont].title = inputArray[0].value;
        quizzUser.questions[cont].color = inputArray[1].value;

        for (let cont1 = 0; cont1 < answersArray.length; cont1++) {
            if (cont1 > 0) {
                quizzUser.questions[cont].answers[cont1].isCorrectAnswer = false;
            }
            quizzUser.questions[cont].answers[cont1].text = answersArray[cont1].value;
            quizzUser.questions[cont].answers[cont1].image = imagesArray[cont1].value;

            if (cont1 < answersArray.length - 1) {
                quizzUser.questions[cont].answers.push({
                    text: '',
                    image: ''
                });
            }
        }
        if (cont < questionsQuizz - 1) {
            quizzUser.questions[cont + 1] = {
                answers: [{
                    text: '',
                    image: '',
                    isCorrectAnswer: true
                }]
            };
        }
    }

}

//renderiza página 3 do quizz
function quizzMakerThree() {
    getValues();
    console.log('Hello, World');
    eraseContent(main);
    const questionStructure = `
    <div class="main">
    <div class="quizz-maker-container">
            <div class="quizz-maker3">
                <h2>Agora, decida os níveis</h2>
                <form action="#" onsubmit="getLevelValue(); setTimeout(quizzUserPost, 1000);">
                </form>
            </div>
    </div>
    </div>
    `

    content.innerHTML = questionStructure;
    const form = document.querySelector('.quizz-maker3 form');

    for (let cont = 0; cont < levelsQuizz; cont++) {
        const questionNumber = document.createElement('div');
        const h3 = document.createElement('h3');
        h3.innerText = `Nível ${cont+1}`;
        const img = document.createElement('img');
        img.src = `./assets/images/Vector.svg`;
        questionNumber.classList.add('question-number');
        questionNumber.appendChild(h3);
        questionNumber.appendChild(img);
        addHTMLlevel(questionNumber);
        form.appendChild(questionNumber);
        if (cont == 0) {
            rewriteQuestionDivCopy(questionNumber);
        } else {
            img.addEventListener('click', rewriteQuestionDiv);
        }
    }
    const input = document.createElement('button');
    input.innerHTML = 'Prosseguir para criar níveis'
    form.appendChild(input);
    input.addEventListener('click', hiddenChecker);
}

function getLevelValue() {
    let infoArray = document.querySelectorAll('.info');
    quizzUser.levels = [{
        title: "Título do nível 1",
        image: "https://http.cat/411.jpg",
        text: "Descrição do nível 1",
        minValue: 0
    }]


    for (let cont = 0; cont < levelsQuizz; cont++) {
        const disgusting = infoArray[cont];
        console.log('okok0');

        answersArray = disgusting.querySelectorAll('.answer');
        console.log('okok1');
        imagesArray = disgusting.querySelectorAll('.image');
        console.log('okok2');
        inputArray = disgusting.querySelectorAll('input');

        console.log('inputArray[0]', inputArray[0].value);
        quizzUser.levels[cont].title = inputArray[0].value;
        quizzUser.levels[cont].minValue = Number(inputArray[1].value);
        quizzUser.levels[cont].image = inputArray[2].value;
        quizzUser.levels[cont].text = inputArray[3].value;


        if (cont < levelsQuizz - 1) {
            quizzUser.levels[cont + 1] = {
                title: "Título do nível 1",
                image: "https://http.cat/411.jpg",
                text: "Descrição do nível 1",
                minValue: 0
            };
        }
    }
}


function addHTMLlevel(param) {
    const h3 = param.querySelector('h3').innerText;
    const infoHidden = document.createElement('div');
    infoHidden.classList.add('info', 'hidden');
    infoHidden.innerHTML += `
        <h3>${h3}</h3>
        <input type="text" placeholder="Título do nível" oninput="setCustomValidity('');"
            pattern=".{10,}" required
            oninvalid="this.setCustomValidity('Insira no mínimo 10 caracteres!')">
        <input type="number" placeholder="% de acerto mínima" oninput="setCustomValidity('');" max="100"
            min="0" required oninvalid="this.setCustomValidity('Formato inválido')">
        <input type="url" placeholder="URL da imagem do nível" oninput="setCustomValidity('');" required
            oninvalid="this.setCustomValidity('Formato inválido')">
        <input type="text" placeholder="Descrição do nível" oninput="setCustomValidity('');" 
        pattern=".{30,}" required
            oninvalid="this.setCustomValidity('Insira pelo menos caracteres!')">
        </div>`
    param.appendChild(infoHidden);
}

function quizzUserPost() {
    const promise = axios.post("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes", quizzUser);
    promise.then(quizzMakerEnd);
}


function quizzMakerEnd(response) {
    contador++;
    console.log("Resposta: ", response);
    personalQuizzId[contador] = response.data.id;
    const promise = axios.get(`${quizzesurl}/${personalQuizzId[contador]}`);
    main = document.querySelector('.main');
    eraseContent(main);
    const endStructure = `
    <div class="main"
    <div class="quizz-maker-container">
            <div class="quizz-end">
                <h2>Seu quizz está pronto</h2>
            </div>
    </div>
    `
    content.innerHTML += endStructure;
    promise.then(quizzGetbyId);

}

function quizzGetbyId(response) {
    response = response.data;
    image = response.image;
    text = response.title;
    id = response.id


    quizzShowUser(image, text, id);
    
}

function quizzShowUser(image, text, id) {
    const end = document.querySelector(".quizz-end");
    const quizz = document.createElement('div');
    quizz.classList.add('quizz-show');
    quizz.id = id;

    const img = document.createElement('img');
    img.src = image;

    const gradient = document.createElement('div');
    gradient.classList.add('gradient','tam');

    const p = document.createElement('p');
    p.innerText = text;

    quizz.appendChild(img);
    quizz.appendChild(gradient);
    quizz.appendChild(p);

    end.appendChild(quizz);
    const button = document.createElement('button');
    button.innerHTML = 'Acessar Quizz'
    button.id = id;
    console.log(button.id)
    end.appendChild(button);
    button.addEventListener('click', quizzDataGet);
    const h4 = document.createElement('h4');
    h4.innerText = 'Voltar para home'
    end.appendChild(h4);
    h4.addEventListener('click', location.reload);

    getUserQuizz (id);

}

function getUserQuizz (id) {

    console.log("idddddd",id)

    arrayUserQuizzID.push(id);

    let stringIDs = JSON.stringify(arrayUserQuizzID); // tranformar o array em string 
    localStorage.setItem("id",stringIDs); // atualizar o storage
    console.log ("storage", localStorage) 
}

//Rearrange da area do User
function changeUserArea(){
    document.querySelector(".user-wrapper").innerHTML = `
    <div class="user-title">
        <h2>Seus Quizzes</h2>
        <img src="./assets/images/add.png">
    </div>
    <div class="user-experience"></div>
    `
    document.querySelector(".user-title img").addEventListener("click", quizzMaker);
    const userArea = document.querySelector(".user-experience")
    
    for (let i = 0; i < arrayUserQuizzID.length; i++) {
        const promise = axios.get(`${quizzesurl}/${arrayUserQuizzID[i]}`);
        promise.then(printQuizzes)
    }
    
    function printQuizzes(resp){
        let data = resp.data;
        containUserQuizzes.push(data)
        image = data.image;
        text = data.title;
        id = data.id;
        quizzShow(image, text, id, userArea);
    }
}


// ------------------------ QUIZZ SELECIONADO --------------------------
//pega as informações do quizz especifico pelo ID;
function quizzDataGet() {
    quizzId = this.id;
    main = document.querySelector('.main');
    eraseContent(main); // ao abrir o quizz apaga todo layout da pagina inicial para renderizar a nova pagina
    quizzLoading();
    const promise = axios.get(`${quizzesurl}/${quizzId}`);
    promise.then(quizzOpening); //se for sucesso abre o quizz
}

//função de loading até o servidor mandar os dados 
function quizzLoading() {
    content.innerHTML+=`
    <div class="quizz-loading">
           <img src="./assets/images/Spinner.gif">
           <p> Carregando página ... </p>
        </div>
    `
    
}


//renderiza a página do quizz;

function quizzOpening(message) { // ao abrir o quizz recebe o array com todas as informações do quizz
    console.log("sucesso");
    content.innerHTML =`
    <div class="quizz-page">
            <div class="quizz-cover">
            </div>
            <div class="quizz-questions">
            </div>
            <div class="level-container">
                <div class="quizz-level">
                    <!--   <p class = "level-title "> </p>
                    <div class = "level-content"> 
                        <img class="level-img">
                        <p class="level-text"></p>
                    </div> -->
                </div>

                <div class="quizz-buttons">
                    <p class="restart" onclick="restartQuizz()">Reiniciar Quizz</p>
                    <p class="home" onclick="backHomePage()">Voltar pra home</p>
                </div>
            </div>
        </div>
    `
    
    message = message.data;
    cover = message.image;
    title = message.title;
    questions = message.questions;
    levels = message.levels;

    header = document.querySelector(".header")
    header.scrollIntoView();
    openedQuizzShowCover(cover, title); // função criar a capa do quizz


    for (let i = 0; i < questions.length; i++) {
        answers = questions[i].answers;
        question = questions[i].title;
        backgroundQuestion = questions[i].color;
        child++;
        openedQuizzShowQuestions(question, backgroundQuestion, child) //função criar perguntas quizz
        openedQuizzShowAnswers(answers, child);
    }

    contScroll = 1
}




//criação da capa do quizz
function openedQuizzShowCover(cover, title) {
    quizzCover = document.querySelector('.quizz-cover');
    quizzCoverImg = document.createElement('img');
    quizzCoverImg.src = cover;
    quizzTitle = document.createElement('p');
    quizzTitle.innerText = title;

    quizzCover.appendChild(quizzCoverImg);
    quizzCover.appendChild(quizzTitle);
    console.log('capa')
}




//criação das perguntas do quizz
function openedQuizzShowQuestions(question, backgroundQuestion, child) {
    quizzQuestions = document.querySelector('.quizz-questions');
    questionContainer = document.createElement('div');
    questionContainer.classList.add('question-container');
    questionContainer.classList.add(`number${child}`)

    questionTitle = document.createElement('p');
    questionTitle.classList.add('question')
    questionTitle.innerText = question;
    questionTitle.style.backgroundColor = backgroundQuestion;

    answersDiv = document.createElement('div');
    answersDiv.classList.add('answers');

    questionContainer.appendChild(questionTitle);
    quizzQuestions.appendChild(questionContainer);
    questionContainer.appendChild(answersDiv);

}


//criação das respostas do quizz
function openedQuizzShowAnswers(answers, child) {
    answersChildDiv = document.querySelector(`.question-container:nth-child(${child}) .answers`);
    console.log("answersDiv", answersDiv)
    answers.sort(() => Math.random() - 0.5);

    for (let i = 0; i < answers.length; i++) {
       answerDiv = document.createElement('div');
        answerDiv.classList.add('answer');
        answerDiv.classList.add('matte');
        answerDiv.classList.add(`${answers[i].isCorrectAnswer}`)

        answerImage = document.createElement('img');
        answerImage.src = answers[i].image;

        answerP = document.createElement('p');
        answerP.innerText = answers[i].text;

        answersChildDiv.appendChild(answerDiv);
        answerDiv.appendChild(answerImage);
        answerDiv.appendChild(answerP);
        answerDiv.addEventListener('click', playQuizz);
    }
}
//------------ JOGAR O QUIZZ---------------------//

function playQuizz() {

    //verificar se a pergunta já foi respondida 
    quest = this.parentNode; // questão que o usuário clicou

    if (quest.classList.contains("answered-question") === false) {
        quest.classList.add("answered-question")
        //ao clicar na resposta será referente a pergunta 
        console.log(this)
        this.classList.remove("matte")
        this.classList.add("clicked")

        // ao clicar em um elemento answer todos ficar foscos menos o elemento clicado

        console.log("questão", quest)

       matte = quest.querySelectorAll(` .matte`);
        console.log("elementos matte", matte)
        console.log("child", child)

        matte.forEach((matte) => matte.style.opacity = "0.3");

        correct = quest.querySelectorAll(`.true p`);
        correct.forEach((correct) => correct.style.color = "#009C22")

        incorrect = quest.querySelectorAll(`.false p`);
        incorrect.forEach((incorrect) => incorrect.style.color = "#FF4B4B")

        if (this.classList.contains("true")) {
            correctAnswer++;
        }


        console.log("corretas", correctAnswer)
        if (this.classList.contains("clicked") == true) {
            contScroll++;
        }
        setTimeout(scrollNextQuestion, 2000);
    }
    setTimeout(finishedQuizz, 2000);
}

// Função de scrollar para a próxima questão 
function scrollNextQuestion() {
    scrollToQuestion = document.querySelector(`.number${contScroll}`)
    console.log("scrolllll", scrollToQuestion)
    if (contScroll > 1 && contScroll <= questions.length) {
        scrollToQuestion.scrollIntoView({
            behavior: "smooth",
            block: "center"
        })
    }
}


// ----------------------- FIM DO QUIZZ----------------------------
//Função para determianr a porcentagem de acertos

function correctPercentage() {
    percentage = (correctAnswer / child) * 100;
    percentage = Math.round(percentage);
}


//fUNÇÃO PARA FINALIZAR O QUIZZ

function finishedQuizz() {
    allFinishedQuestions = document.querySelectorAll(".answered-question")
    levelContainer = document.querySelector(".quizz-level");
    if (allFinishedQuestions.length === child) {
        //calcular a porcentagem
        correctPercentage()
        //condiçaõ para ver onde se enquadra nos levels
        selectLevel()
        levelContainer.scrollIntoView({
            behavior: "smooth",
            block: "center"
        })

    }
}

// Função para determinar o level  de acordo com os acertos
function selectLevel() {
    for (i = 0; i < levels.length; i++) {
        if (percentage >= levels[i].minValue) {
            userLevel = levels[i];
        }
    }

    renderLevel()
}

//Função para renderizar a mensagem, iamgem e titulo do lvl


function renderLevel() {

    console.log("user level", userLevel)
    levelTitle = userLevel.title
    levelImage = userLevel.image
    levelText = userLevel.text

    showLevel(levelTitle, levelImage, levelText)
}

// função para exibir a porcentagem e acertos e lvl

function showLevel(levelTitle, levelImage, levelText) {
    levelContainer.style.display = "flex";
    buttons = document.querySelector(".quizz-buttons")
    buttons.style.display = "flex";

    levelContainer.innerHTML = `<p class = "level-title "> Você acertou ${percentage}%! ${levelTitle} </p>
    <div class = "level-content"> 
        <img class="level-img"  src="${levelImage}">
        <p class="level-text">  ${levelText} </p>
    </div>`


}

// resetar todas váriaveis para reeinicar quizz

function reset(){
    quizzPage= document.querySelector(".content")
    quizzPage.innerHTML = ``;
     child = 0;
    correctAnswer = 0;
    percentage = 0;
    i = 0;
    contScroll = 0;
}

//REEINICIAR QUIZZ
function restartQuizz() {
    reset()
    quizzLoading();
    const promise = axios.get(`${quizzesurl}/${quizzId}`);
    promise.then(quizzOpening);
} 
// VOLTAR PARA TELA PRINCIPAL
function backHomePage() {
    location.reload()
}

