const main=document.querySelector(".main");
const songCover=document.querySelector(".imageArea img");
const songName=document.querySelector(".songDetails .songName");
const songArtist=document.querySelector(".songDetails .artistName");
const songFile=document.querySelector(".progressArea #audioFile");
const playPauseBtn=document.querySelector(".playPause");
const nextBtn=document.querySelector(".controls #nextTrack");
const prevBtn=document.querySelector(".controls #prevTrack");
const progressBar=document.querySelector(".progressBar");
const progressArea=document.querySelector(".progressArea");
const songList=document.querySelector(".musicList")
const showSongList=document.querySelector("#musicPlaylist");
const hideSongList=document.querySelector("#close");


let songIndex=Math.floor((Math.random()*MusicPlaylist.length)+1);

window.addEventListener("load",()=>{
    musicLoad(songIndex);
    playingSongNow();
})


const musicLoad = (idx) =>{
    songCover.src=MusicPlaylist[idx-1].cover;
    songName.innerText=MusicPlaylist[idx-1].name;
    songArtist.innerText=MusicPlaylist[idx-1].artist;
    songFile.src=MusicPlaylist[idx-1].src;
}

const playMusic = () =>{
    main.classList.add("paused");
    songCover.classList.add('rotate');
    playPauseBtn.querySelector("i").innerText="paused";
    songFile.play();
}

const pauseMusic = () =>{
    main.classList.remove("paused");
    songCover.classList.remove('rotate');
    playPauseBtn.querySelector("i").innerText="play_arrow";
    songFile.pause();
}

const nextSong = () =>{
    songIndex++;
    songIndex>MusicPlaylist.length?songIndex=1:songIndex=songIndex;
    musicLoad(songIndex);
    playMusic();
    playingSongNow();
}

const prevSong = () =>{
    songIndex--;
    songIndex<1?songIndex=MusicPlaylist.length:songIndex=songIndex;
    musicLoad(songIndex);
    playMusic();
    playingSongNow();
}

playPauseBtn.addEventListener("click",()=>{
    const isMusicPaused=main.classList.contains("paused");

    isMusicPaused?pauseMusic():playMusic();
    playingSongNow();
});


nextBtn.addEventListener("click",()=>{
    nextSong();
});

prevBtn.addEventListener("click",()=>{
    prevSong();
});

songFile.addEventListener("timeupdate",(e)=>{
    // get current time of particular song
    const currentTime=e.target.currentTime;
    // get total duration of song 
    const duration=e.target.duration;
    const progressWidth=(currentTime/duration)*100;
    progressBar.style.width=`${progressWidth}%`;

    const songCurrTime=document.querySelector(".currentTime");

    songFile.addEventListener("loadeddata",()=>{
        const songEndTime=document.querySelector(".endTime");
        // update the duration of particular song
        const songDuration=songFile.duration;
        // update the end min and sec of particular song
        let endMin=Math.floor(songDuration/60);
        let endSec=Math.floor(songDuration%60);
        if(endSec<10) endSec=`0${endSec}`;
        songEndTime.innerText=`${endMin}:${endSec}`;
    });
    // update the current timing of particular song
    let currMin=Math.floor(currentTime/60);
    let currSec=Math.floor(currentTime%60);
    if(currSec<10) currSec=`0${currSec}`;
    songCurrTime.innerText=`${currMin}:${currSec}`;
});

progressArea.addEventListener("click",(e)=>{
    const songDuration=songFile.duration;
    const progressWidthValue=progressArea.clientWidth;
    const clickedOffSetX=e.offsetX;

    songFile.currentTime=(clickedOffSetX/progressWidthValue)*songDuration;
    playMusic();
});

const repeatBtn=document.querySelector("#loopPlaylist");
repeatBtn.addEventListener("click",()=>{
    let getText=repeatBtn.innerText;
    switch(getText){
        case "repeat":
            repeatBtn.innerText="repeat_one";
            repeatBtn.setAttribute("title","Song looped");
            break;
        case "repeat_one":
            repeatBtn.innerText="shuffle";
            repeatBtn.setAttribute("title","Playback shuffle");
            break;
        case "shuffle":
            repeatBtn.innerText="repeat";
            repeatBtn.setAttribute("title","Playlist looped");
            break;
    }       
});

songFile.addEventListener("ended",()=>{
    let getText=repeatBtn.innerText;
    switch(getText){
        case "repeat":
            nextSong();
            break;
        case "repeat_one":
            songFile.currentTime=0;
            musicLoad(songIndex);
            playMusic();
            break;
        case "shuffle":
            let randomIdx=Math.floor((Math.random() * MusicPlaylist.length)+1);
            do{
                randomIdx=Math.floor((Math.random() * MusicPlaylist.length)+1);
            }while(songIndex===randomIdx);
            songIndex=randomIdx;
            musicLoad(songIndex);
            playMusic();
            playingSongNow();
            break;        
    }
});

showSongList.addEventListener("click",()=>{
    songList.classList.toggle("show");
});

hideSongList.addEventListener("click",()=>{
    showSongList.click();
});

const ulTag=document.querySelector("ul");

for(let i=0;i<MusicPlaylist.length;i++){
    // pass the song name and artist form the MusicPlaylist array to li 
    let liTag=`<li liIdx=${i+1}>
                    <div class="row">
                        <span>${MusicPlaylist[i].name}</span>
                        <p>${MusicPlaylist[i].artist}</p>
                    </div>
                    <audio class=${MusicPlaylist[i].songNum} src=${MusicPlaylist[i].src}></audio>
                    <span id=${MusicPlaylist[i].songNum} class="audioDuration">3:40</span>
                </li>`;
    ulTag.insertAdjacentHTML("beforeend",liTag);

    let liSongDuration=ulTag.querySelector(`#${MusicPlaylist[i].songNum}`);
    let liSongTag=ulTag.querySelector(`.${MusicPlaylist[i].songNum}`);

    liSongTag.addEventListener("loadeddata",()=>{
        let songDuration=liSongTag.duration;
        let endMin=Math.floor(songDuration/60);
        let endSec=Math.floor(songDuration%60);
        if(endSec<10) endSec=`0${endSec}`;
        liSongDuration.innerText=`${endMin}:${endSec}`;
        // adding tempeporary duration which we will use below
        liSongDuration.setAttribute("tempDuration",`${endMin}:${endSec}`);
    });
}

const allliItems=ulTag.querySelectorAll("li");

const playingSongNow=()=>{
    for(let j=0;j<allliItems.length;j++){
        let songTag=allliItems[j].querySelector(".audioDuration");
        if(allliItems[j].classList.contains("playing")){
            allliItems[j].classList.remove("playing");
            let addDuration=songTag.getAttribute("tempDuration");
            songTag.innerText=addDuration;
        }

        if(allliItems[j].getAttribute("liIdx")==songIndex){
            allliItems[j].classList.add("playing");
            songTag.innerText="Playing";
        }

        // add onclick attribute in all li tags
        
        allliItems[j].setAttribute("onClick","clicked(this)");
    }
}

const clicked=(element)=>{
    let getLiIdx=element.getAttribute("liIdx");
    songIndex=getLiIdx;
    musicLoad(songIndex);
    playMusic();
    playingSongNow();
}
