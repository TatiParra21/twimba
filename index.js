import { tweetsData0 } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

let tweetsData = JSON.parse(localStorage.getItem("tweetData"))
console.log(tweetsData)
if(tweetsData.length ==0){
    
    localStorage.setItem("tweetData",JSON.stringify(tweetsData0)) //still unsure if its still needed
    updateTweetsData()

}


//part that handles all clicks
document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }else if(e.target.id==="reply-button"){
      
        handleYourReply(e.target.dataset.num)
       
    }else if(e.target.dataset.option){
        handleTweetOption(e.target.dataset.option)
    }
    else if(e.target.dataset.deletebtn){
        deleteTweet(e.target.dataset.deletebtn)
    }
})

function deleteTweet(tweetdelete){
    let chosenDelete= ""
    tweetsData.forEach(function(tweet,index){
        if(tweet.uuid== tweetdelete){
            chosenDelete = index
            console.log(tweetsData[chosenDelete])
            
        }
    })
    console.log(tweetsData[chosenDelete])
    tweetsData.splice(chosenDelete,1)
    render()
}
function handleTweetOption(option){
    document.getElementById(`option-${option}`).classList.toggle("hidden")
   
   
   
}


 //LIKE CLICK PART
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
        
    render()
    tweetInput.value = ''
    }

}

function handleYourReply(datanum){
    const yourReplyInput = document.getElementById(`reply-area-${datanum}`)
    const targetSpecific = tweetsData.filter(function(tweet){
        return tweet.uuid == datanum
    })[0]
    if(yourReplyInput.value){
        targetSpecific.replies.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            tweetText: yourReplyInput.value,
            
        })
    }
    
   
    render()
    yourReplyInput.value =''
}

function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }   
     

        
        
        let repliesHtml = ` 
    <div class="your-reply">
            <div class="tweet-input-area">
                <img src="images/scrimbalogo.png" class="profile-pic">
                <textarea id="reply-area-${tweet.uuid}" placeholder="Post Your Reply"></textarea>
            </div>
        <button id="reply-button" data-num="${tweet.uuid}">Reply</button>
    </div>`
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`
            })
        }
        
          
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
                <div class="tweet-detail tweet-option">
                
                <i class="fa-solid fa-ellipsis" data-option="${tweet.uuid}"></i>
                <div class="hidden" id="option-${tweet.uuid}">
                <button class="delete-tweet-btn"data-deletebtn="delete-${tweet.uuid}">delete tweet</button>
            </div>
                </div>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">

        ${repliesHtml}
    </div>   
</div>
`
   })
   return feedHtml 
}

function render(){
    localStorage.setItem("tweetData",JSON.stringify(tweetsData))
    updateTweetsData()
    document.getElementById('feed').innerHTML = getFeedHtml()
    
    
}

function updateTweetsData(){
    tweetsData = JSON.parse(localStorage.getItem("tweetData"))
}



render()


