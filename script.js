const passwordDisplay = document.querySelector("[data-password-display]");
const copyBtn = document.querySelector("[data-copy-btn]");
const copyMsg = document.querySelector("[data-copy-msg]");
const lengthDisplay = document.querySelector("[data-length-display]");
const lengthSlider = document.querySelector("[data-length-slider]");
const uppercaseCb = document.querySelector("#uppercaseCb");
const lowercaseCb = document.querySelector("#lowercaseCb");
const numberCb = document.querySelector("#numberCb");
const symbolCb = document.querySelector("#symbolCb");
const allCheckbox = document.querySelectorAll("input[type=checkbox]");
const indicator = document.querySelector("[data-indicator]");
const generateButton = document.querySelector("#generateButton");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';
let password = "";
let passwordLength = 10;
uppercaseCb.checked = true;
let checkCount = 1;
handleSlider();

// To handle the flunction of sider
function handleSlider() {
    lengthSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    const min = lengthSlider.min;
    const max = lengthSlider.max;
    lengthSlider.style.backgroundSize = ((passwordLength - min) * 100) / (max - min) + "% 100%";
}

//  length slider
lengthSlider.addEventListener('input', (e)=> {
    passwordLength = e.target.value;
    handleSlider();
}); 

// handle check-count and password-length
allCheckbox.forEach( (checkbox) => {
    checkbox.addEventListener('change', countCheckedCb);
});

function countCheckedCb(){
    checkCount = 0;

    allCheckbox.forEach((checkbox) => {
        if(checkbox.checked) checkCount++;
    });

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

// copy password
async function copyContent() {
    try {
        if(password === ""){
            alert('First Generate Password to copy');
            throw 'Failed'; 
        }
        await navigator.clipboard.writeText(password);
        copyMsg.innerText = "Copied";
    } 

    catch (error) {
      copyMsg.innerText = error;
    }

    copyMsg.classList.add("active");
    setTimeout(() => {
      copyMsg.classList.remove("active");
    }, 2000);
}
  
copyBtn.addEventListener("click", () => {
    copyContent();
});

//Function to generation random values
function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
function generateNumber(){
    return getRandomInteger(1, 10);
}
function generateLowercase(){
   return String.fromCharCode(getRandomInteger(97, 123));
}
function generateUppercase(){
    return String.fromCharCode(getRandomInteger(65, 91));
}
function generateSymbol(){
    const randomIndex = getRandomInteger(0, symbols.length);
    return symbols.charAt(randomIndex);
}

// calculate password strength
function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

setIndicator("#ccc");

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;

    if(uppercaseCb.checked) hasUpper = true;
    if(lowercaseCb.checked) hasLower = true;
    if(numberCb.checked) hasNumber = true;
    if(symbolCb.checked) hasSymbol = true;

    if(hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength >= 8){
        setIndicator("#0f0");
    }
    else if((hasUpper || hasLower) && (hasNumber || hasSymbol) && passwordLength >= 6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

// Shuffle the array randomly - Fisher Yates algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    let str = "";
    str = array.join("");
    return str;
}

// Handle generate password
function generatePassword(){
    if(checkCount <= 0){
        alert('Atleast check one checkbox');
        return;
    }
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
    if (password.length) password = "";
    let checkedCbArray = [];
    if(uppercaseCb.checked) checkedCbArray.push(generateUppercase);
    if(lowercaseCb.checked) checkedCbArray.push(generateLowercase);
    if(numberCb.checked) checkedCbArray.push(generateNumber);
    if(symbolCb.checked) checkedCbArray.push(generateSymbol);

    for(let i=0; i < checkedCbArray.length; i++){
        password += checkedCbArray[i]();
    }

    for(let i=0; i < (passwordLength - checkedCbArray.length); i++){
        let randomIndex = getRandomInteger(0, checkedCbArray.length);
        password += checkedCbArray[randomIndex]();
    }

    password = shuffleArray(Array.from(password));
    passwordDisplay.value = password;
    console.log('password :', password);
    calcStrength();
}

generateButton.addEventListener('click', generatePassword);