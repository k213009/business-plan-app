// 必要なツールを読み込む
require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');

// Expressアプリを作成
const app = express();
const port = 3001;

// Googleのクライアントを作成（APIキーを設定）
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// CORSとJSONの利用を設定
app.use(cors());
app.use(express.json());

// publicフォルダー内のファイルを提供する
app.use(express.static('public'));

// 「/evaluate」というURLへのリクエストを処理する部分
app.post('/evaluate', async (req, res) => {
    console.log('--- 目印1：リクエストを受け取りました ---'); // ★ログ追加
    try {
        const { text } = req.body;

        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

       // AIへの指示（プロンプト）を作成
        const prompt = `
        # 指示
        あなたは、数々のスタートアップを成功に導いてきた、非常に優秀な経営コンサルタント兼財務アナリストです。
        提供された以下の「評価対象の事業計画」を読み解き、成功の可能性とリスクを専門家の目線で評価し、具体的な改善点を説明してください。

        # 思考プロセス
        あなたは、以下の思考プロセスに従って評価を生成してください。
        1.  まず、「事業の業種」情報と「事業計画の文章」から、このビジネスがどの業界に属するかを正確に特定します。（例：カフェ経営、アパレルECサイト、Web制作受託など）
        2.  次に、その特定した業界で、事業の健全性を測るための**最も重要な財務指標（KPI）**を2〜3つ特定し、その業界における一般的な目標値や平均値を述べなさい。
            * 例：飲食店なら「FL比率（原価+人件費）は売上の60%以下が健全」、小売業なら「売上総利益率（粗利率）は30%〜50%が一般的」、ITサービスなら「顧客獲得単価（CAC）と顧客生涯価値（LTV）のバランスが重要」など。
        3.  提供された「事業計画の数値」を基に、あなたが特定した重要指標を計算しなさい。
        4.  計算結果と、あなたが述べた業界の目標値を比較し、計画の妥当性、リスク、改善点について、専門家として鋭い洞察を述べなさい。

        # 出力形式
        以下の形式を厳守して、Markdown形式で出力してください。

        ## 1. 事業計画の評価
        3つの観点から5段階評価（5が最高、1が最低）を行い、理由と改善点を説明してください。
        評価点数は「3/5 (★★★☆☆)」のように、数値と星の数の両方で表現してください。

        * **観点1：具体性**
        * **観点2：独自性・強み**
        * **観点3：将来性**

        ## 2. 財務的な実現可能性の評価
        あなたの思考プロセスに基づき、以下の構成で評価を記述してください。

        * **重要指標と業界平均:** （あなたが特定した、この事業で注目すべき財務指標とその目標値をここに記述）
        * **計画値の評価とアドバイス:** （数値を基にした計算結果と、目標値との比較、それに対する具体的なアドバイスをここに記述）

        # 評価対象の事業計画
        ${text}
        `;

        console.log('--- 目印2：これからGoogle AIに問い合わせます ---'); // ★ログ追加

        // Google Geminiに評価を依頼
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const aiText = response.text();

        console.log('--- 目印3：Google AIから返信を受け取りました ---'); // ★ログ追加

        res.json({ result: aiText });

    } catch (error) {
        console.error('★エラー発生！:', error); // ★エラーログを強調
        res.status(500).json({ error: 'AIの評価中にエラーが発生しました。' });
    }
});

// サーバーを起動
app.listen(port, () => {
    console.log(`サーバーが http://localhost:${port} で起動しました`);
});