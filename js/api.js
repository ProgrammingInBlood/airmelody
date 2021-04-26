const sent = document.querySelector(".note");

// ----------KEY INPUT START -------------
var searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');

searchInput.addEventListener('keyup', function(e) {
    let inputValue = searchInput.value;

    if (e.which === 13) {
        pushValue(inputValue);
        sent.style.display = "none";
        document.getElementById("youtube-list").innerHTML = ""
    }


    window.search = inputValue;
});

searchButton.addEventListener('click', function() {
    var inputValue = searchInput.value;
    pushValue(inputValue);
    window.search = inputValue;
    sent.style.display = "none";
    document.getElementById("youtube-list").innerHTML = ""
});
// ----------KEY INPUT END -------------

// ------------API START----------------


function truncateText(str, no_words) {
    return str.split(' ').splice(0, no_words).join(' ');
}

function pushValue(value) {
    const url = `https://youtube-v31.p.rapidapi.com/search?q=${value}&part=snippet%2Cid&regionCode=IN&maxResults=50&order=relevance&type=video`;

    fetch(url, {
        headers: {
            'x-rapidapi-key': '894c0f3ef0mshd47452f66102afep1fbcd2jsna1d559034924',
            'x-rapidapi-host': 'youtube-v31.p.rapidapi.com'
        }
    }).then(response => {
        if (response.ok) {
            return response.json();
        }

        throw new Error('Request Error');
    }).then(jsonResponse => {
        pushToDom(jsonResponse);
        console.log(jsonResponse);
    }).catch((e) => {
        console.log(e); // try ok
        console.error('Request failed!');
    });

}

function videoItemClick(videoId) {
    // do stuff with this okkk
}

let parent = document.getElementById("lists");
let preList = document.querySelectorAll(".box-item");

preList.forEach(item => {
    item.addEventListener('click', event => {
        let id = item.dataset.videoid;
        videoItemClick(id);
    })
})


function pushToDom(rawData) { // variable named data is not recommended oh
    let jsonData = rawData.items; // now try again!!!
    let result = document.querySelector("#results");
    let youtubeVideoList = document.querySelector("#youtube-list");

    const generateChildElement = (imgUrl, channelName, videoTitle, videoId) => {
        const base = document.createElement('div');
        const imgContainer = document.createElement('div');
        const channel = document.createElement('h4');
        const title = document.createElement('p');

        base.classList.add('box-item');
        base.dataset.videoid = videoId;

        imgContainer.classList.add('box-item__image');
        imgContainer.innerHTML = `<img src="${imgUrl}" />`; // try again, its case sensitive error

        channel.innerText = channelName;
        title.innerText = videoTitle;

        // bootstrapping
        base.append(imgContainer);
        base.append(channel);
        base.append(title);

        base.addEventListener('click', () => {
            videoItemClick(base.dataset.videoid);
            console.log(base.dataset.videoid);
        });

        return base;
    };

    result.innerHTML = `<h3>Showing results for ${window.search}</h3>`;

    // ------------API END----------------

    for (const videoItem of jsonData) {
        let imgUrl = videoItem.snippet.thumbnails.high.url;
        let vID = videoItem.id.videoId;
        let channel = videoItem.snippet.channelTitle;
        let title = videoItem.snippet.title;

        // raw structure:
        // <div class="box-item" data-videoid="${vID}"> -> base
        //     <div class="box-item__image"> -> imgContainer
        //         <img src="${imgurl}" />
        //     </div>
        //     <h4>${channel}</h4> -> channel ok
        //     <p>${title}</p> -> title
        // </div>

        // MAKING TITLE SHORTER
        title = truncateText(title, 5);

        // generate html element
        youtubeVideoList.append(
            generateChildElement(imgUrl, channel, title, vID)
        );
    }
}

//---------------SECOND API  START----------------- 


var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player;


// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.

function onYouTubeIframeAPIReady() {

    player = new YT.Player('player', {
        height: '10px',
        width: '10px',
        videoId: window.ytid,
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}


// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {

    event.target.playVideo();
    event.target.setPlaybackQuality('small');


}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;

function onPlayerStateChange(event) {

    if (event.data == YT.PlayerState.PLAYING && !done) {
        done = false;
    }
}

//---------------SECOND API  END----------------- 

//-----BASIC FUNCTIONS------
function stopVideo() {
    player.stopVideo();
}

function playVideo() {
    player.playVideo();
}

function pauseVideo() {
    player.pauseVideo();
}


function videoItemClick(videoId) {
    player.loadVideoById(videoId, 0, "small");
}

//-----------SEEK FUNCTION (FORWARD)---------------
document.getElementById("forward").addEventListener('click', function() {
    var dur = player.playerInfo.currentTime;
    player.seekTo(dur + 10, true);
})

//-----------SEEK FUNCTION (BACKWARD)------------------

document.getElementById("backward").addEventListener('click', function() {
    var dur = player.playerInfo.currentTime;
    player.seekTo(dur - 10, true);
})

//-------------PLAY PAUSE FUNCTION---------------------

const play = document.getElementById("play");
const pause = document.getElementById("pause");
const button = document.getElementById("button");

button.addEventListener('click', function() {

    if (play.style.display === 'block') {
        playVideo();
        pause.style.display = "block";
        play.style.display = "none";


    } else {

        pauseVideo();

        play.style.display = "block"
        pause.style.display = "none";
    }

})

//---------CALCULATING DURATION DATA--------





function currentS() {
    const currentDuration = player.playerInfo.currentTime;
    const totalDuration = player.playerInfo.duration;
    let percentage = (currentDuration / totalDuration) * 100;
    let widthstyle = document.getElementById("songduration");

    if (currentDuration < totalDuration) {;
        widthstyle.style.width = percentage + "%";
    }
    //-------------CALCULATING TOTAL DURATION------------------
    let finalTime = document.getElementById("total-duration")
    let minutes = Math.floor(totalDuration / 60);
    let seconds = Math.floor(totalDuration) % 60;

    if (totalDuration < 10) {
        seconds = `0${seconds}`;
    }


    finalTime.innerHTML = `${minutes}:${seconds}`;
    //-------------CALCULATING CURRENT DURATION------------------
    const currentTime = document.getElementById("current-duration");
    let minutes2 = Math.floor(currentDuration / 60);
    let seconds2 = Math.floor(currentDuration) % 60;

    if (currentDuration < 10) {
        seconds2 = `0${seconds2}`;
    }
    currentTime.innerHTML = `${minutes2}:${seconds2}`;



}
setInterval(currentS, 500);

//---------------SEEK BY PROGRESS BAR-------------
document.getElementById("duration").addEventListener('click', function(event) {
    const currentDuration = player.playerInfo.currentTime;
    const totalDuration = player.playerInfo.duration;
    let elementwidth = event.srcElement.clientWidth;

    let myclick = event.offsetX;
    let moveProgress = (myclick / elementwidth) * totalDuration;


    player.seekTo(moveProgress);
})