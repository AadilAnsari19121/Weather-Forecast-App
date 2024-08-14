const themeToggle = document.getElementById('theme-toggle-checkbox');

// Check if theme is already saved in local storage
if (localStorage.getItem('theme') === 'dark-theme') {
    document.body.classList.add('dark-theme');
    themeToggle.checked = true;
} else {
    document.body.classList.remove('dark-theme');
    themeToggle.checked = false;
}

themeToggle.addEventListener('click', function () {
    if (themeToggle.checked) {
        document.body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
        localStorage.removeItem('theme');
    }
});


const modal = document.getElementById('validation-modal');
const closeButton = document.getElementById('close-button');

function showModal(message) {
  modal.style.display = 'block';
  document.getElementById('validation-message').textContent = message;
  document.getElementById("header").classList.add('blur-effect');
  document.getElementById('forecast-container').classList.add('blur-effect');
}

function hideModal() {
  modal.style.display = 'none';
  document.getElementById("header").classList.remove('blur-effect');
  document.getElementById('forecast-container').classList.remove('blur-effect');

}

closeButton.addEventListener('click', (e)=>{
    e.preventDefault();
    hideModal();
    location.reload();
});

const loadingElement = document.getElementById('loading');

function showLoading() {
  loadingElement.classList.add('show');
  document.getElementById("header").classList.add('blur-effect');
  document.getElementById('forecast-container').classList.add('blur-effect');
}

function hideLoading() {
  loadingElement.classList.remove('show');
  document.getElementById("header").classList.remove('blur-effect');
  document.getElementById('forecast-container').classList.remove('blur-effect');
}

showLoading();

let searchbar=document.getElementById('searchBar');
let searchBtn=document.getElementById('search_btn');
let sel_city=document.getElementById('selected_city');
let sel_stt=document.getElementById('selected_state');
let cur_temp=document.getElementById('temperature');
let Precipitation=document.getElementById('Precipitation');
let Humidity=document.getElementById('Humidity');
let Wind=document.getElementById('Wind');
let times_now=document.getElementById('times_now');
const forecastContainer = document.getElementById('forecast-container');

const date = new Date();
const dayOfWeek = date.toLocaleString('en-US', { weekday: 'long' });
const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit'});

times_now.innerText=`${dayOfWeek}, ${time}`;
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const today = new Date();

function formatDate(date3) {
    const weekday = days[date3.getDay()];
    const month = date3.getMonth() + 1; // getMonth() returns 0-11
    const day = date3.getDate();
    return `${weekday}, ${day}/${month}`;
  }

let cityname=`vadodara`;
const capitalizedCity = cityname.charAt(0).toUpperCase() + cityname.slice(1);
let apikey=`d2c443623fa9d295839d788b9daaaac8`;

let fetching_data=`https://api.openweathermap.org/data/2.5/weather?q=${cityname}&units=metric&appid=${apikey}`;
let fetching_data2=`https://api.openweathermap.org/data/2.5/forecast?q=${cityname}&cnt=&appid=d2c443623fa9d295839d788b9daaaac8`;

try {
    showLoading();
    fetch(fetching_data)
    .then(response=> response.json())
    .then(data =>{
        
        cur_temp.innerText=data.main.temp.toFixed(1);
        sel_city.innerText=capitalizedCity;
        sel_stt.innerText=data.sys.country;
        Precipitation.innerText=data.main.feels_like.toFixed(1);
        Humidity.innerText=data.main.humidity;
        Wind.innerText=data.wind.speed;
        times_now.innerText=`${dayOfWeek}, ${time}`;
        });

    fetch(fetching_data2)
    .then(res=>res.json())
    .then(data2=>{
        const forecastContainer = document.getElementById('forecast-container');
        forecastContainer.innerHTML = '';

        const weathericon2=data2.list[0].weather[0].icon;
        document.getElementById('weather_cur_img').src=`https://openweathermap.org/img/wn/${weathericon2}.png`;
    
        for (let i = 0; i < 10; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            const dayName = days[date.getDay()];
            const dayMonth = `${date.getDate()}/${date.getMonth() + 1}`;
            const forecastData = data2.list[i];
            const temperature = forecastData.main.temp;
            const weather = forecastData.weather[0].main;
            const weathericon = forecastData.weather[0].icon;
            const highLowTemp = `${(forecastData.main.temp_max-273.15).toFixed(1)}°C  ${(forecastData.main.temp_min-273.15).toFixed(1)}°C`;
            const forecastHTML = `
                <div class="day">
                <p class="upcoming_date">${dayName}\n${dayMonth}</p>
                <img src="https://openweathermap.org/img/wn/${weathericon}.png" alt="${weather}" style="width: 50px; height: 50px;">
                <p>${weather}</p>
                <p>${highLowTemp}</p>
                </div>
            `;
            forecastContainer.innerHTML += forecastHTML;
            }
            hideLoading();
    });
}
catch (error){
    console.error(error);
}

searchBtn.addEventListener('click',()=>{
    cityname=searchbar.value.trim();

    if(cityname===''){
        showModal('Please Enter The City Name');
    }
    else{
    const capitalizedCity = cityname.charAt(0).toUpperCase() + cityname.slice(1);
    let fetching_data=`https://api.openweathermap.org/data/2.5/weather?q=${cityname}&units=metric&appid=${apikey}`;
    let fetching_data2=`https://api.openweathermap.org/data/2.5/forecast?q=${cityname}&cnt=&appid=d2c443623fa9d295839d788b9daaaac8`;

    try {
        showLoading();
        fetch(fetching_data)
        .then(response=> response.json())
        .then(data =>{
        try{
            cur_temp.innerText=data.main.temp.toFixed(1);
            sel_city.innerText=capitalizedCity;
            sel_stt.innerText=data.sys.country;
            Precipitation.innerText=data.main.feels_like.toFixed(1);
            Humidity.innerText=data.main.humidity;
            Wind.innerText=data.wind.speed;
            times_now.innerText=`${dayOfWeek}, ${time}`;
            console.log("its try city fetch"); 
        }
        catch{
            hideLoading();
            showModal('Sorry, city not found');
            console.log("failed");
        }
        });

        fetch(fetching_data2)
        .then(res=>res.json())
        .then(data2=>{
        try{
            console.log("try data2 fech");
            forecastContainer.innerHTML = '';
            hideModal();
            const weathericon2=data2.list[0].weather[0].icon;
            document.getElementById('weather_cur_img').src=`https://openweathermap.org/img/wn/${weathericon2}.png`;
        
            for (let i = 0; i < 10; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() + i);        
                const dayName = days[date.getDay()];
                const dayMonth = `${date.getDate()}/${date.getMonth() + 1}`;
                const forecastData = data2.list[i];
                const temperature = forecastData.main.temp;
                const weather = forecastData.weather[0].main;
                const weathericon = forecastData.weather[0].icon;
                const highLowTemp = `${(forecastData.main.temp_max-273.15).toFixed(1)}° to ${(forecastData.main.temp_min-273.15).toFixed(1)}°`;
                const forecastHTML = `
                    <div class="day">
                    <p class="upcoming_date">${dayName}\n${dayMonth}</p>
                    <img src="https://openweathermap.org/img/wn/${weathericon}.png" alt="${weather}" style="width: 70px; height: 70px;">
                    <p>${weather}</p>
                    <p>${highLowTemp}C</p>
                    </div>
                `;
                forecastContainer.innerHTML += forecastHTML;
                hideModal();
                console.log("data2 fetch finish");
            }
            hideLoading();
        }
        catch(error){
            console.log(error);
            showModal('Sorry, city not found');
            forecastContainer.innerHTML = `
                <div class="day">
        <p>Sun</p>
        <p class="upcoming_date">13/08</p>
        <p>🌧️</p>
        <p>Rain</p>
        <p>32.6°C</p>
        <p>30.7°C</p>
    </div>
    <div class="day">
        <p>Sun</p>
        <p class="upcoming_date">13/08</p>
        <p>🌧️</p>
        <p>Rain</p>
        <p>32.6°C</p>
        <p>30.7°C</p>
    </div>
    <div class="day">
        <p>Sun</p>
        <p class="upcoming_date">13/08</p>
        <p>🌧️</p>
        <p>Rain</p>
        <p>32.6°C</p>
        <p>30.7°C</p>
    </div>
    <div class="day">
        <p>Sun</p>
        <p class="upcoming_date">13/08</p>
        <p>🌧️</p>
        <p>Rain</p>
        <p>32.6°C</p>
        <p>30.7°C</p>
    </div>
    <div class="day">
        <p>Sun</p>
        <p class="upcoming_date">13/08</p>
        <p>🌧️</p>
        <p>Rain</p>
        <p>32.6°C</p>
        <p>30.7°C</p>
    </div>
    <div class="day">
        <p>Sun</p>
        <p class="upcoming_date">13/08</p>
        <p>🌧️</p>
        <p>Rain</p>
        <p>32.6°C</p>
        <p>30.7°C</p>
    </div>
    <div class="day">
        <p>Sun</p>
        <p class="upcoming_date">13/08</p>
        <p>🌧️</p>
        <p>Rain</p>
        <p>32.6°C</p>
        <p>30.7°C</p>
    </div>
    <div class="day">
        <p>Sun</p>
        <p class="upcoming_date">13/08</p>
        <p>🌧️</p>
        <p>Rain</p>
        <p>32.6°C</p>
        <p>30.7°C</p>
    </div>
    <div class="day">
        <p>Sun</p>
        <p class="upcoming_date">13/08</p>
        <p>🌧️</p>
        <p>Rain</p>
        <p>32.6°C</p>
        <p>30.7°C</p>
    </div>
    <div class="day">
        <p>Sun</p>
        <p class="upcoming_date">13/08</p>
        <p>🌧️</p>
        <p>Rain</p>
        <p>32.6°C</p>
        <p>30.7°C</p>
    </div>
    <div class="day">
        <p>Sun</p>
        <p class="upcoming_date">13/08</p>
        <p>🌧️</p>
        <p>Rain</p>
        <p>32.6°C</p>
        <p>30.7°C</p>
    </div>
            `;
            hideLoading();
        }
        });
    }
    catch (error){
        hideLoading();
        showModal('Sorry, city was not found');
    }
    searchbar.value='';
}
});