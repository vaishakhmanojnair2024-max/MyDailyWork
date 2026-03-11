/* -----------------------------
   QUIZ CREATION
----------------------------- */

let quizQuestions = [];

function addQuestion(){

const question =
document.getElementById("question").value;

const option1 =
document.getElementById("option1").value;

const option2 =
document.getElementById("option2").value;

const option3 =
document.getElementById("option3").value;

const option4 =
document.getElementById("option4").value;

const correct =
document.getElementById("correct").value;

quizQuestions.push({
question:question,
options:[option1,option2,option3,option4],
correct:correct
});

alert("Question added");

document.getElementById("question").value="";
document.getElementById("option1").value="";
document.getElementById("option2").value="";
document.getElementById("option3").value="";
document.getElementById("option4").value="";
}

/* -----------------------------
   SAVE QUIZ
----------------------------- */

async function saveQuiz(){

const title =
document.getElementById("quizTitle").value;

await fetch("http://localhost:5000/quizzes",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
title:title,
questions:quizQuestions
})
});

alert("Quiz saved successfully!");

window.location = "quizList.html";

}

/* -----------------------------
   LOAD QUIZ LIST
----------------------------- */

async function loadQuizzes(){

const res =
await fetch("http://localhost:5000/quizzes");

const quizzes =
await res.json();

const list =
document.getElementById("quizList");

list.innerHTML="";

quizzes.forEach(q=>{

const div =
document.createElement("div");

div.className="quiz-card";

div.innerHTML=`
<h3>${q.title}</h3>

<button onclick="startQuiz('${q._id}')">
Take Quiz
</button>

<button onclick="deleteQuiz('${q._id}')">
Delete
</button>
`;

list.appendChild(div);

});

}

/* -----------------------------
   DELETE QUIZ
----------------------------- */

async function deleteQuiz(id){

if(!confirm("Delete this quiz?")) return;

await fetch(
`http://localhost:5000/quizzes/${id}`,
{method:"DELETE"}
);

alert("Quiz deleted");

loadQuizzes();

}

/* -----------------------------
   START QUIZ
----------------------------- */

let currentQuiz;
let currentQuestionIndex = 0;
let score = 0;

async function startQuiz(id){

const res =
await fetch("http://localhost:5000/quizzes");

const quizzes =
await res.json();

currentQuiz =
quizzes.find(q=>q._id===id);

currentQuestionIndex = 0;
score = 0;

document.getElementById("quizSection")
.style.display="block";

showQuestion();

}

/* -----------------------------
   SHOW QUESTION
----------------------------- */

function showQuestion(){

const q =
currentQuiz.questions[currentQuestionIndex];

document.getElementById("questionText")
.innerText = q.question;

const optionsDiv =
document.getElementById("options");

optionsDiv.innerHTML="";

q.options.forEach((opt,index)=>{

const btn =
document.createElement("button");

btn.className="option-btn";

btn.innerText = opt;

btn.onclick = ()=>selectAnswer(btn,index);

optionsDiv.appendChild(btn);

});

}

/* -----------------------------
   ANSWER SELECTION
----------------------------- */

function selectAnswer(button,index){

const correct =
currentQuiz.questions[currentQuestionIndex].correct;

const buttons =
document.querySelectorAll(".option-btn");

buttons.forEach(btn=>{
btn.disabled = true;
});

if(index == correct){

button.style.background="green";
score++;

}else{

button.style.background="red";

buttons[correct].style.background="green";

}

}

/* -----------------------------
   NEXT QUESTION
----------------------------- */

function nextQuestion(){

currentQuestionIndex++;

if(currentQuestionIndex < currentQuiz.questions.length){

showQuestion();

}else{

showResult();

}

}

/* -----------------------------
   SHOW RESULT
----------------------------- */

function showResult(){

document.getElementById("quizSection")
.innerHTML=`
<h2>Quiz Completed</h2>
<p>Your Score: ${score} / ${currentQuiz.questions.length}</p>
`;

}

/* -----------------------------
   SIGNUP
----------------------------- */

async function signup(){

const username =
document.getElementById("signupUser").value;

const password =
document.getElementById("signupPass").value;

const res =
await fetch("http://localhost:5000/signup",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
username,
password
})
});

const data =
await res.json();

alert(data.message);

if(data.message === "Signup successful"){

window.location="login.html";

}

}

/* -----------------------------
   LOGIN
----------------------------- */

async function login(){

const username =
document.getElementById("loginUser").value;

const password =
document.getElementById("loginPass").value;

const res =
await fetch("http://localhost:5000/login",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
username,
password
})
});

const data =
await res.json();

alert(data.message);

if(data.message === "Login successful"){

localStorage.setItem("user",data.username);

window.location="index.html";

}

}

/* -----------------------------
   LOGOUT
----------------------------- */

function logout(){

localStorage.removeItem("user");

alert("Logged out");

window.location="index.html";

}

/* -----------------------------
   NAVBAR LOGIN / LOGOUT
----------------------------- */

function checkAuth(){

const user =
localStorage.getItem("user");

const authLink =
document.getElementById("authLink");

if(!authLink) return;

if(user){

authLink.innerText="Logout";
authLink.onclick = logout;

}else{

authLink.innerText="Login";
authLink.href="login.html";

}

}

checkAuth();