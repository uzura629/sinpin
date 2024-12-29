// カウントダウンタイマーの設定
function updateTimer() {
    // 現在の日時を取得
    const now = new Date().getTime();
    
    // ユーザーごとの開始時間を取得（ローカルストレージから）
    let startTime = localStorage.getItem('campaignStartTime');
    
    // 開始時間が設定されていない場合は現在時刻を設定
    if (!startTime) {
        startTime = now;
        localStorage.setItem('campaignStartTime', startTime);
    }
    
    // 72時間（3日）をミリ秒で計算
    const duration = 72 * 60 * 60 * 1000;
    
    // 終了時刻を計算
    const endTime = parseInt(startTime) + duration;
    
    // 残り時間を計算
    const timeLeft = endTime - now;
    
    if (timeLeft <= 0) {
        // 時間切れの場合
        document.getElementById('days').textContent = '0';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
        
        // ビデオセクションを非表示にする
        document.querySelector('.video-section').style.display = 'none';
        document.querySelector('.campaign-details').style.display = 'none';
        
        // メッセージを表示
        const message = document.createElement('div');
        message.className = 'expired-message';
        message.innerHTML = `
            <h2>キャンペーン期間が終了しました</h2>
            <p>申し訳ございませんが、このキャンペーンは終了いたしました。</p>
        `;
        document.querySelector('.countdown-section').appendChild(message);
        
        return;
    }
    
    // 残り時間を日、時、分、秒に変換
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
    // 表示を更新
    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
}

// 1秒ごとにタイマーを更新
setInterval(updateTimer, 1000);

// 初回実行
updateTimer();

// 期限切れ時のスタイル
const styles = `
.expired-message {
    text-align: center;
    padding: 2rem;
    margin: 2rem 0;
    background: #fff3f3;
    border-radius: 10px;
}

.expired-message h2 {
    color: #ff4444;
    margin-bottom: 1rem;
}

.expired-message p {
    color: #666;
}
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

// YouTube Player APIの読み込み
let tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// YouTubeプレーヤーの初期化
let player;
let videoWatched = false;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('youtube-player', {
        videoId: 'Ctkl9J-aH4E',
        height: '100%',
        width: '100%',
        playerVars: {
            'autoplay': 0,
            'controls': 1,
            'rel': 0,
            'fs': 1,
            'modestbranding': 1,
            'enablejsapi': 1
        },
        events: {
            'onStateChange': onPlayerStateChange,
            'onReady': onPlayerReady,
            'onError': onPlayerError
        }
    });
}

// プレーヤーの準備完了時
function onPlayerReady(event) {
    console.log('Player is ready');
    hideDownloadSection();
}

// エラー発生時の処理
function onPlayerError(event) {
    console.error('Player error:', event.data);
}

// 動画の状態が変更されたときの処理
function onPlayerStateChange(event) {
    console.log('Player state changed:', event.data);
    
    // 動画が終了したとき（YT.PlayerState.ENDED = 0）
    if (event.data === 0) {
        console.log('Video ended');
        showDownloadSection();
    }
}

// ダウンロードセクションを表示する関数
function showDownloadSection() {
    console.log('Showing download section');
    const downloadSection = document.getElementById('download-section');
    const watchNotice = document.getElementById('watch-notice');
    
    if (downloadSection && watchNotice) {
        watchNotice.style.display = 'none';
        downloadSection.style.display = 'block';
        downloadSection.style.opacity = '1';
        downloadSection.classList.add('visible');
    }
}

// ペウンロードセクションを非表示にする関数
function hideDownloadSection() {
    console.log('Hiding download section');
    const downloadSection = document.getElementById('download-section');
    const watchNotice = document.getElementById('watch-notice');
    
    if (downloadSection && watchNotice) {
        watchNotice.style.display = 'block';
        downloadSection.style.display = 'none';
        downloadSection.classList.remove('visible');
    }
}

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', function() {
    hideDownloadSection();
}); 