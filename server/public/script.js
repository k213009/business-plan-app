// HTMLの要素を取得
const evaluateButton = document.getElementById('evaluate-button');
const businessText = document.getElementById('business-text');
const resultDiv = document.getElementById('result');

// ボタンがクリックされた時の処理
evaluateButton.addEventListener('click', async () => {
    const text = businessText.value;
    if (!text) {
        alert('評価する文章を入力してください。');
        return;
    }

    resultDiv.textContent = 'AIが評価中です...';

    try {
        // 作成したサーバーに文章を送る
        const response = await fetch('https://hajime-server.onrender.com/evaluate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: text }),
        });

        const data = await response.json();

        // サーバーから返ってきた結果を表示
        resultDiv.textContent = data.result;

    } catch (error) {
        console.error('Error:', error);
        resultDiv.textContent = 'エラーが発生しました。サーバーが起動しているか確認してください。';
    }
});