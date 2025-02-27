console.log("Hello Javascript")


let currentsong = new Audio();
let songs;
let currFolder;

function SecondsToMinutesSeconds(Seconds) {
    if (isNaN(Seconds) || Seconds < 0) {
        return "00 : 00";
    }

    const minutes = Math.floor(Seconds / 60);
    const seconds = Math.floor(Seconds % 60);

    // Format minutes and seconds to always show two digits
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

function convertSecondsToMMSS(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    // Pad minutes and seconds with leading zeros if needed
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
}
async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`)
    let response = await a.text();

    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")

    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }

    }

    

    // show all the songs in the playlist
    let songUl = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUl.innerHTML = ""
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + `<li><img class="invert" src="music.svg" alt="">
                          <div class="info">
                              <div>${song.replaceAll("%20", " ")} </div>
                              <div>Yash</div>
                          </div>
                          <div class="playnow">
                              <span>Play Now</span>
                              
                          </div> </li>`;
    }

    // Attach an event listner to each song

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
            //  This is for removing the space in the songs
        })

    })

    return songs
}

const playMusic = (track, pause = false) => {

    // let audio = new Audio("/songs/" + track)
    currentsong.src = `/${currFolder}/` + track
    if (!pause) {

        currentsong.play()
        play.src = "img/pause.svg"
    }

    document.querySelector(".songinfo").innerHTML = track
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:3000/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];

        if (e.href.includes("/songs")) {
            let folder = e.href.split("/").slice(-2)[0]

            // Get the metadata of the folder
            let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`)
            let response = await a.json();
            cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${folder}" class="card">
                        <div class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"
                                fill="none">
                                <!-- Background Circle with Green Fill -->
                                <circle cx="12" cy="12" r="10" fill="#00FF00" /> <!-- Green background -->
                                <!-- Icon Path with Black Fill -->
                                <path
                                    d="M9.5 11.1998V12.8002C9.5 14.3195 9.5 15.0791 9.95576 15.3862C10.4115 15.6932 11.0348 15.3535 12.2815 14.6741L13.7497 13.8738C15.2499 13.0562 16 12.6474 16 12C16 11.3526 15.2499 10.9438 13.7497 10.1262L12.2815 9.32594C11.0348 8.6465 10.4115 8.30678 9.95576 8.61382C9.5 8.92086 9.5 9.6805 9.5 11.1998Z"
                                    fill="#000000" /> <!-- Black icon -->
                            </svg>

                        </div>
                        <img src="/songs/${folder}/cover.jpg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.Description}</p>
                    </div>`

            //  Load the playlist whenever card is clicked
            Array.from(document.getElementsByClassName("card")).forEach(e => {
                e.addEventListener("click", async item => {
                    songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
                    playMusic(songs[0])

                })
            })
        }
    }


}

async function main() {

    await getSongs("songs/ncs")
    playMusic(songs[0], true)


    //  Display all albums on the page

    await displayAlbums()


    //  Attach an event listner to play,  previous and next
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "img/pause.svg"
        }
        else {
            currentsong.pause()
            play.src = "img/play.svg"
        }
    })

    //  Listen for time timeupdate Event

    currentsong.addEventListener("timeupdate", () => {
        console.log(currentsong.currentTime, currentsong.duration);
        document.querySelector(".songtime").innerHTML = `${SecondsToMinutesSeconds(currentsong.currentTime)}/${SecondsToMinutesSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    })


    //  Add an event listener to seekbar

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration) * percent) / 100
    })

    // Add event listner for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })

    // Add event listner for close button

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-110%";
    })

    // Add event listner for previous and next

    previous.addEventListener("click", () => {
        console.log("Privious clicked.")
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {

            playMusic(songs[index - 1])
        }

    })

    next.addEventListener("click", () => {
        currentsong.pause()
        console.log("next clicked.")
        // let index = songs.indexof(currentsong.src.split("/").slice(-1) [0])
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length - 1) {

            playMusic(songs[index + 1])
        }
    })

    // Add event listner for volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log(e.target, e.target.value)
        currentsong.volume = parseInt(e.target.value) / 100;
    })

    //  Add Event listner to mute track

    document.querySelector(".volume>img").addEventListener("click", e => {
        if (e.target.src == ("img/volume.svg")) {
            e.target.src = e.target.src.replace = ("img/volume.svg", "img/mute.svg")
            currentsong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else {
            e.target.src = e.target.src.replace = ("img/mute.svg", "img/volume.svg")
            currentsong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }
    })

}

main()