const loadBtn = document.getElementById('btn');
const loadingPopup = document.getElementById('popup');
const content = document.getElementById('main');

function handleClick(){
    loadingPopup.style.display = 'block';
    content.style.backgroundColor = 'rgb(194, 198, 197)';
    content.classList.add('blur-background');

    setTimeout(function() {
        loadingPopup.style.display = 'none';
        content.classList.remove('blur-background');
        content.style.backgroundColor = 'white';
        // Add code here to load your content or perform other tasks
        // ...
      }, 10000);
}

loadBtn.addEventListener('click', handleClick);