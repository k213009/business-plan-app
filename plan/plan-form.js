// =================================================================
// 1. グローバル変数の定義
// =================================================================
let rowCount = 0;
const maxRows = 5;

let staffCount = 0;
const maxStaff = 5;

// =================================================================
// 2. 関数の定義
// =================================================================

function addHistoryRow() {
    const container = document.getElementById('history-container');
    if (!container || rowCount >= maxRows) return;
    const row = document.createElement('div');
    row.className = "history-row";
    row.innerHTML = `
      <label>勤務先名:</label><input type="text" name="company_${rowCount}">
      <label>役職:</label><input type="text" name="position_${rowCount}">
      <label>期間:</label>
      <select name="years_${rowCount}">
        ${Array.from({ length: 41 }, (_, i) => `<option value="${i}">${i}年</option>`).join('')}
      </select>
      <hr />
    `;
    container.appendChild(row);
    rowCount++;
}

function addStaffRow() {
    const staffContainer = document.getElementById('staff-container');
    if (!staffContainer || staffCount >= maxStaff) return;
    const row = document.createElement('div');
    row.className = "staff-row";
    row.innerHTML = `
      <label>職種:</label><input type="text" name="staff_role_${staffCount}">
      <label>人数:</label><input type="number" name="staff_count_${staffCount}" min="1" max="99">
      <label>主な業務内容:</label><input type="text" name="staff_duties_${staffCount}">
      <hr />
    `;
    staffContainer.appendChild(row);
    staffCount++;
}

function saveFormData() {
    const formData = {};
    const form = document.getElementById('business-plan-form');
    form.querySelectorAll('input, textarea, select').forEach(element => {
        if (!element.name || element.closest('.history-row') || element.closest('.staff-row')) {
            return;
        }
        formData[element.name] = element.value;
    });
    const historyData = [];
    document.querySelectorAll('.history-row').forEach((row, i) => {
        const company = row.querySelector(`input[name="company_${i}"]`)?.value || '';
        const position = row.querySelector(`input[name="position_${i}"]`)?.value || '';
        const years = row.querySelector(`select[name="years_${i}"]`)?.value || '';
        historyData.push({ company, position, years });
    });
    formData['history'] = historyData;
    const staffData = [];
    document.querySelectorAll('.staff-row').forEach((row, i) => {
        const role = row.querySelector(`input[name="staff_role_${i}"]`)?.value || '';
        const count = row.querySelector(`input[name="staff_count_${i}"]`)?.value || '';
        const duties = row.querySelector(`input[name="staff_duties_${i}"]`)?.value || '';
        staffData.push({ role, count, duties });
    });
    formData['staff'] = staffData;
    localStorage.setItem('businessPlanData', JSON.stringify(formData));
}

function updateFinancialTotals() {
    const num = (id) => Number(document.getElementById(id)?.value) || 0;
    const text = (id) => document.getElementById(id)?.value || '';
    const requiredTotal = num('equipment-cost') + num('operating-cost');
    document.getElementById('required_funds_total').value = requiredTotal.toLocaleString() + ' 円';
    const otherFundingValue = parseInt(text('other-funding').replace(/[^0-9]/g, ''), 10) || 0;
    const fundingTotal = num('self-funding') + num('family-loan') + num('jfc-loan') + num('bank-loan') + otherFundingValue;
    document.getElementById('funding_sources_total').value = fundingTotal.toLocaleString() + ' 円';
}

function updateCashFlowCalculations() {
    const num = (id) => Number(document.getElementById(id)?.value) || 0;
    const format = (val) => val.toLocaleString() + ' 円';
    const initialExpenses = num('personnel_initial') + num('rent_initial') + num('interest_initial') + num('other_exp_initial');
    const initialProfit = num('sales_initial') - num('cogs_initial') - initialExpenses;
    const initialCashFlow = initialProfit - num('repayment_initial');
    document.getElementById('profit_initial').value = format(initialProfit);
    document.getElementById('cashflow_initial').value = format(initialCashFlow);
    const onTrackExpenses = num('personnel_on_track') + num('rent_on_track') + num('interest_on_track') + num('other_exp_on_track');
    const onTrackProfit = num('sales_on_track') - num('cogs_on_track') - onTrackExpenses;
    const onTrackCashFlow = onTrackProfit - num('repayment_on_track');
    document.getElementById('profit_on_track').value = format(onTrackProfit);
    document.getElementById('cashflow_on_track').value = format(onTrackCashFlow);
}

function fillDummyData() {
    const setVal = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.value = value;
    };
    setVal('representative-name', '創楽 はじめ');
    setVal('industry-type', '飲食店・カフェ');
    setVal('motive', '長年のパン職人としての経験を活かし、地域に愛される店舗を作ります。');
    const historyContainer = document.getElementById('history-container');
    if (historyContainer) {
        historyContainer.innerHTML = '';
        rowCount = 0;
        for (let i = 0; i < 3; i++) {
            addHistoryRow();
            document.querySelector(`input[name="company_${i}"]`).value = `株式会社サンプル${i + 1}`;
            document.querySelector(`input[name="position_${i}"]`).value = `役職${i + 1}`;
            document.querySelector(`select[name="years_${i}"]`).value = `${i + 2}`;
        }
    }
    setVal('product_1', '国産小麦と天然酵母の食パン');
    setVal('product_2', '季節のフルーツを使ったデニッシュ');
    setVal('product_3', 'オーガニックコーヒー');
    setVal('sales_point', '無添加・手作りにこだわった健康志向の商品が強みです。また、カフェスペースを併設し、地域の憩いの場を提供することでリピーター獲得を目指します。');
    setVal('target', '主なターゲットは30代〜50代の健康志向の女性やファミリー層です。集客はInstagramや地域の情報誌を活用し、オープンセールや定期的なイベントで新規顧客を引きつけます。');
    setVal('competition', '近隣には大手スーパーやコンビニベーカリーが存在し、低価格帯が強みです。しかし、品質や体験価値で差別化が可能です。');
    setVal('partners', '〇〇製粉（仕入）、××農園（野菜）、△△コーヒー（カフェ用豆）');
    setVal('partners_conditions', '月末締め、翌月末払い');
    const staffContainer = document.getElementById('staff-container');
    if (staffContainer) {
        staffContainer.innerHTML = '';
        staffCount = 0;
        addStaffRow();
        document.querySelector(`input[name="staff_role_0"]`).value = `パン職人`;
        document.querySelector(`input[name="staff_count_0"]`).value = `1`;
        document.querySelector(`input[name="staff_duties_0"]`).value = `パンの製造全般`;
        addStaffRow();
        document.querySelector(`input[name="staff_role_1"]`).value = `販売・カフェスタッフ`;
        document.querySelector(`input[name="staff_count_1"]`).value = `2`;
        document.querySelector(`input[name="staff_duties_1"]`).value = `接客、レジ、カフェ業務`;
    }
    setVal('office-location', '沖縄県那覇市〇〇1-2-3');
    setVal('office-type', 'rented');
    setVal('equipment-cost', '3000000');
    setVal('operating-cost', '1000000');
    document.querySelector('input[name="equipment_detail1"]').value = '冷蔵ショーケース - 1,000,000円';
    document.querySelector('input[name="equipment_detail2"]').value = '店舗改装 - 2,000,000円';
    document.querySelector('input[name="operating_detail1"]').value = '仕入資金 - 500,000円';
    document.querySelector('input[name="operating_detail2"]').value = '広告宣伝費 - 500,000円';
    setVal('self-funding', '2000000');
    setVal('family-loan', '500000');
    setVal('jfc-loan', '1300000');
    setVal('bank-loan', '0');
    setVal('other-funding', '助成金 200000円');
    setVal('sales_initial', '800000');
    setVal('sales_on_track', '1200000');
    setVal('sales_basis', '客単価800円×40人×25日 → 軌道に乗ったら60人');
    setVal('cogs_initial', '240000');
    setVal('cogs_on_track', '360000');
    setVal('cogs_basis', '売上高の30%');
    setVal('personnel_initial', '200000');
    setVal('personnel_on_track', '400000');
    setVal('personnel_basis', '当初1名、軌道に乗ったら2名');
    setVal('rent_initial', '150000');
    setVal('rent_on_track', '150000');
    setVal('rent_basis', '店舗家賃');
    setVal('interest_initial', '20000');
    setVal('interest_on_track', '20000');
    setVal('interest_basis', '借入金に対する利息');
    setVal('other_exp_initial', '50000');
    setVal('other_exp_on_track', '50000');
    setVal('other_exp_basis', '水道光熱費・通信費など');
    setVal('repayment_initial', '30000');
    setVal('repayment_on_track', '30000');
    setVal('repayment_basis', '借入金の元本返済');
    setVal('future-vision', '初年度は店舗運営に集中し、地域での信頼を築きます。\n2年目以降はECサイトでの通信販売を開始し、全国に販路を拡大する計画です。');
    updateFinancialTotals();
    updateCashFlowCalculations();
}

async function generatePdf() {
    Swal.fire({
        title: 'PDFを生成中...',
        text: 'しばらくお待ちください',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
    });
    const val = (id) => document.getElementById(id)?.value || '';
    const qVal = (name) => document.querySelector(`input[name="${name}"]`)?.value || '';
    const loadImageAsDataURL = (src) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                resolve(canvas.toDataURL('image/png'));
            };
            img.onerror = () => reject(new Error(`ロゴ画像「${src}」の読み込みに失敗しました。パスが正しいか確認してください。`));
            img.src = src;
        });
    };
    try {
        const logoDataURL = await loadImageAsDataURL('../assets/images/icon-plan.png');
        const name = val('representative-name');
        const element = buildPdfHtml(logoDataURL);
        const options = {
            margin: [20, 15, 20, 15],
            filename: `創業計画書_${name}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().set(options).from(element)
        .toPdf().get('pdf').then(function (pdf) {
            const totalPages = pdf.internal.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) {
                pdf.setPage(i);
                pdf.setFontSize(8);
                pdf.setTextColor(150);
                const pageNumberText = `${i} / ${totalPages}`;
                pdf.text(pageNumberText, pdf.internal.pageSize.getWidth() / 2, pdf.internal.pageSize.getHeight() - 10, { align: 'center' });
                pdf.text('© 2025 Hajime. All rights reserved.', pdf.internal.pageSize.getWidth() / 2, pdf.internal.pageSize.getHeight() - 5, { align: 'center' });
            }
        })
        .save().then(() => {
            Swal.close();
        }).catch(err => {
            console.error("PDF生成エラー:", err);
            Swal.fire('エラー', 'PDFの生成に失敗しました。', 'error');
        });
    } catch (error) {
        Swal.close();
        Swal.fire('エラー', error.message, 'error');
    }
}

function buildPdfHtml(logoDataURL) {
    const val = (id) => document.getElementById(id)?.value || '';
    const qVal = (name) => document.querySelector(`input[name="${name}"]`)?.value || '';
    const formatCurrency = (numStr) => {
        if (typeof numStr === 'string' && numStr.includes('円')) return numStr;
        const num = Number(numStr);
        return isNaN(num) ? '' : `${num.toLocaleString()} 円`;
    };

    const name = val('representative-name');
    const industryType = val('industry-type');
    const motive = val('motive');
    const productsList = [val('product_1'), val('product_2'), val('product_3')]
        .filter(p => p.trim() !== '').map(p => `<p>${p}</p>`).join('');
    const sales_point = val('sales_point');
    const target = val('target');
    const competition = val('competition');
    const partners = val('partners');
    const partners_conditions = val('partners_conditions');
    const officeLocation = val('office-location');
    const officeTypeSelect = document.getElementById('office-type');
    const officeType = officeTypeSelect.options[officeTypeSelect.selectedIndex]?.text || '';
    const futureVision = val('future-vision');

    const historyData = Array.from(document.querySelectorAll('.history-row')).map((row, i) => {
        const company = row.querySelector(`input[name="company_${i}"]`)?.value || '';
        const position = row.querySelector(`input[name="position_${i}"]`)?.value || '';
        const years = row.querySelector(`select[name="years_${i}"]`)?.value || '';
        return `<tr><td>${company}</td><td>${position}</td><td>${years} 年</td></tr>`;
    }).join('');

    const staffRows = document.querySelectorAll('.staff-row');
    const staffDataRows = Array.from(staffRows).map((row, i) => {
        const role = row.querySelector(`input[name^="staff_role_"]`)?.value || '';
        const count = row.querySelector(`input[name^="staff_count_"]`)?.value || '';
        const duties = row.querySelector(`input[name^="staff_duties_"]`)?.value || '';
        const locationCell = (i === 0) ? `<td rowspan="${staffRows.length}">${officeLocation}</td>` : '';
        const typeCell = (i === 0) ? `<td rowspan="${staffRows.length}">${officeType}</td>` : '';
        return `<tr><td>${role}</td><td>${count}</td><td>${duties}</td>${locationCell}${typeCell}</tr>`;
    }).join('');

    return `
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body { font-family: 'Noto Sans JP', sans-serif, 'Helvetica', 'Arial', sans-serif; font-size: 10pt; counter-reset: page; }
            .page { page-break-after: always; }
            .page:last-child { page-break-after: auto; }
            .footer { text-align: center; font-size: 8pt; color: #666; margin-top: 20mm; }
            .footer .page-number::after { counter-increment: page; content: counter(page); }
            h1 { font-size: 16pt; text-align: center; margin-bottom: 10mm;}
            h2 { font-size: 12pt; text-align: left; padding-bottom: 3px; margin-top: 8mm; margin-bottom: 4mm; display: block; border-bottom: 2px solid #33aacc; }
            h3 { font-size: 10pt; font-weight: bold; margin-top: 6mm; margin-bottom: 2mm; }
            table { width: 100%; border-collapse: collapse; font-size: 9pt; page-break-inside: avoid; }
            th, td { border: 1px solid #ccc; padding: 5px; text-align: left; vertical-align: top; word-wrap: break-word; }
            .th-left { background-color: #f0f0f0; width: 30%; }
            .th-top { background-color: #f0f0f0; }
            .content-box { border: 1px solid #ccc; padding: 10px; min-height: 4em; page-break-inside: avoid; white-space: pre-wrap; word-wrap: break-word; }
            .th-center { text-align: center; background-color: #e0e0e0; }
            .td-right { text-align: right; }
            .profit-row { background-color: #e6f2ff; font-weight: bold; }
            .financial-table th, .financial-table td { padding: 6px; text-align: center; }
            .financial-table .basis { text-align: left; width: 40%; }
            .financial-table .item { text-align: left; }
        </style>
    </head>
    <body>
        <div class="page">
            <img src="${logoDataURL}" style="height: 12mm; width: auto; margin-bottom: 5mm;">
            <h1>創業計画書</h1>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 5px; border-bottom: 1px solid #ccc;">
                <span style="font-weight: bold;">代表者名: ${name}</span>
                <span style="text-align: right;"><strong>業種:</strong> ${industryType}</span>
            </div>
            <h2>1. 創業の動機</h2><div class="content-box">${motive.replace(/\n/g, '<br>')}</div>
            <h2>2. 経営者の略歴</h2><table><thead><tr><th class="th-top">勤務先名</th><th class="th-top">役職</th><th class="th-top">期間</th></tr></thead><tbody>${historyData}</tbody></table>
            <h2>3. 取扱商品・サービス</h2><div class="content-box">${productsList}</div>
        </div>
        <div class="page">
            <h2>4. セールスポイント（自社の強み）</h2><div class="content-box">${sales_point.replace(/\n/g, '<br>')}</div>
            <h2>5. 販売方法・戦略（集客方法）</h2><div class="content-box">${target.replace(/\n/g, '<br>')}</div>
            <h2>6. 競合・市場など自社をとりまく状況</h2><div class="content-box">${competition.replace(/\n/g, '<br>')}</div>
            <h2>7. 取引先と取引条件</h2><table><tr><th class="th-left">取引先</th><td>${partners.replace(/\n/g, '<br>')}</td></tr><tr><th class="th-left">取引条件</th><td>${partners_conditions.replace(/\n/g, '<br>')}</td></tr></table>
        </div>
        <div class="page">
            <h2>8. 人員計画と事業所情報</h2><table><thead><tr><th class="th-top">職種</th><th class="th-top">人数</th><th class="th-top">主な業務内容</th><th class="th-top">所在地</th><th class="th-top">事業所の形態</th></tr></thead><tbody>${staffDataRows}</tbody></table>
            <h2>9. 資金計画</h2><table>
                <tr><th colspan="2" class="th-center">必要な資金</th></tr>
                <tr><th class="th-left">設備資金</th><td class="td-right">${formatCurrency(val('equipment-cost'))}</td></tr>
                <tr><td style="padding-left: 20px;">└ 内訳1</td><td>${qVal('equipment_detail1')}</td></tr>
                <tr><td style="padding-left: 20px;">└ 内訳2</td><td>${qVal('equipment_detail2')}</td></tr>
                <tr><th class="th-left">運転資金</th><td class="td-right">${formatCurrency(val('operating-cost'))}</td></tr>
                <tr><td style="padding-left: 20px;">└ 内訳1</td><td>${qVal('operating_detail1')}</td></tr>
                <tr><td style="padding-left: 20px;">└ 内訳2</td><td>${qVal('operating_detail2')}</td></tr>
                <tr class="profit-row"><th class="th-left">合計</th><td class="td-right">${val('required_funds_total')}</td></tr>
                <tr><th colspan="2" class="th-center">資金の調達方法</th></tr>
                <tr><th class="th-left">自己資金</th><td class="td-right">${formatCurrency(val('self-funding'))}</td></tr>
                <tr><th class="th-left">親族からの借入</th><td class="td-right">${formatCurrency(val('family-loan'))}</td></tr>
                <tr><th class="th-left">日本政策金融公庫からの借入</th><td class="td-right">${formatCurrency(val('jfc-loan'))}</td></tr>
                <tr><th class="th-left">金融機関からの借入</th><td class="td-right">${formatCurrency(val('bank-loan'))}</td></tr>
                <tr><th class="th-left">その他</th><td>${val('other-funding')}</td></tr>
                <tr class="profit-row"><th class="th-left">合計</th><td class="td-right">${val('funding_sources_total')}</td></tr>
            </table>
        </div>
        <div class="page">
            <h2>10. 月次収支計画</h2><table class="financial-table">
                <thead><tr><th class="item">項目</th><th>創業当初</th><th>1年後</th><th class="basis">算出根拠</th></tr></thead>
                <tbody>
                    <tr><td class="item">売上高</td><td>${formatCurrency(val('sales_initial'))}</td><td>${formatCurrency(val('sales_on_track'))}</td><td class="basis">${val('sales_basis')}</td></tr>
                    <tr><td class="item">売上原価（仕入等）</td><td>${formatCurrency(val('cogs_initial'))}</td><td>${formatCurrency(val('cogs_on_track'))}</td><td class="basis">${val('cogs_basis')}</td></tr>
                    <tr><td class="item" style="padding-left:20px;">人件費</td><td>${formatCurrency(val('personnel_initial'))}</td><td>${formatCurrency(val('personnel_on_track'))}</td><td class="basis">${val('personnel_basis')}</td></tr>
                    <tr><td class="item" style="padding-left:20px;">家賃</td><td>${formatCurrency(val('rent_initial'))}</td><td>${formatCurrency(val('rent_on_track'))}</td><td class="basis">${val('rent_basis')}</td></tr>
                    <tr><td class="item" style="padding-left:20px;">支払利息</td><td>${formatCurrency(val('interest_initial'))}</td><td>${formatCurrency(val('interest_on_track'))}</td><td class="basis">${val('interest_basis')}</td></tr>
                    <tr><td class="item" style="padding-left:20px;">その他</td><td>${formatCurrency(val('other_exp_initial'))}</td><td>${formatCurrency(val('other_exp_on_track'))}</td><td class="basis">${val('other_exp_basis')}</td></tr>
                    <tr class="profit-row"><td class="item">利益</td><td>${val('profit_initial')}</td><td>${val('profit_on_track')}</td><td class="basis"></td></tr>
                    <tr><td class="item">返済金額（借入金）</td><td>${formatCurrency(val('repayment_initial'))}</td><td>${formatCurrency(val('repayment_on_track'))}</td><td class="basis">${val('repayment_basis')}</td></tr>
                    <tr class="profit-row"><td class="item">キャッシュフロー</td><td>${val('cashflow_initial')}</td><td>${val('cashflow_on_track')}</td><td class="basis"></td></tr>
                </tbody>
            </table>
            <h2>11. 事業の見通し</h2><div class="content-box">${futureVision.replace(/\n/g, '<br>')}</div>
        </div>
    </body>
    </html>
    `;
}

// =================================================================
// 3. ページ読み込み完了後のイベントリスナー
// =================================================================
document.addEventListener('DOMContentLoaded', () => {
    // アコーディオン機能
    document.querySelectorAll('.accordion-toggle').forEach(button => {
        button.addEventListener('click', () => {
            const content = button.nextElementSibling;
            const isContentVisible = content.style.display === 'block';
            content.style.display = isContentVisible ? 'none' : 'block';
            if (!isContentVisible && button.textContent.includes('経営者の略歴')) {
                if (document.querySelectorAll('#history-container .history-row').length === 0) addHistoryRow();
            }
        });
    });

    // 保存ボタン
    document.getElementById('save-button')?.addEventListener('click', () => {
        saveFormData();
        Swal.fire({ title: "保存しました", text: "入力内容をブラウザに保存しました。", icon: "success", showConfirmButton: false, timer: 1500 });
    });

    // 行追加ボタン
    document.getElementById('add-history')?.addEventListener('click', addHistoryRow);
    document.getElementById('add-staff')?.addEventListener('click', addStaffRow);
    
    // ダミー入力ボタン
    document.getElementById('dummy-fill')?.addEventListener('click', fillDummyData);
    
    // PDF確認モーダル
    document.getElementById('show-confirm')?.addEventListener('click', (e) => {
        e.preventDefault();
        let text = '以下の内容でPDFを作成します。よろしいですか？\n\n';
        const getVal = (id) => document.getElementById(id)?.value.trim() || '';
        text += `■ 1. 創業の動機\n${getVal('motive')}\n\n`;
        text += '■ 2. 経営者の略歴\n';
        document.querySelectorAll('.history-row').forEach((row, i) => {
            const company = row.querySelector(`input[name="company_${i}"]`)?.value || '';
            const position = row.querySelector(`input[name="position_${i}"]`)?.value || '';
            const years = row.querySelector(`select[name="years_${i}"]`)?.value || '';
            text += `・勤務先: ${company}, 役職: ${position}, 期間: ${years}年\n`;
        });
        text += '\n';
        text += `■ 3. 取扱商品・サービス\n`;
        text += `・${getVal('product_1')}\n`;
        text += `・${getVal('product_2')}\n`;
        text += `・${getVal('product_3')}\n\n`;
        text += `■ 4. セールスポイント\n${getVal('sales_point')}\n\n`;
        text += `■ 5. 販売方法・戦略\n${getVal('target')}\n\n`;
        text += `■ 6. 競合・市場など\n${getVal('competition')}\n\n`;
        text += `■ 7. 取引先\n${getVal('partners')}\n\n`;
        text += `■ 8. 取引条件\n${getVal('partners_conditions')}\n\n`;
        const confirmContent = document.getElementById('confirm-content');
        if (confirmContent) confirmContent.textContent = text;
        const confirmModal = document.getElementById('confirm-modal');
        if (confirmModal) confirmModal.style.display = 'block';
    });

    document.getElementById('close-confirm')?.addEventListener('click', () => {
        document.getElementById('confirm-modal').style.display = 'none';
    });

    document.querySelector('#confirm-modal #download-pdf-btn')?.addEventListener('click', generatePdf);

    // ▼▼ AI評価モーダル機能（完全版） ▼▼
    const evaluateAiButton = document.getElementById('evaluate-ai-button');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalContent = document.getElementById('modal-content');
    const aiResponseText = document.getElementById('ai-response-text');

    if (evaluateAiButton && modalOverlay && modalContent && aiResponseText) {
        
        const showModal = () => {
            modalOverlay.classList.remove('hidden');
            modalContent.classList.remove('hidden');
        };
        const hideModal = () => {
            modalOverlay.classList.add('hidden');
            modalContent.classList.add('hidden');
        };

        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        const dummyResponse = `
**評価結果**

**1. 独自性・強み：4/5 (★★★★☆)**
* **理由:** 無添加・手作りにこだわった健康志向の商品というコンセプトは、現代の消費者ニーズに合致しており、明確な強みです。
* **改善点:** 「健康志向」をさらに具体的に示すため、使用する食材の産地（例：沖縄県産〇〇小麦）などをアピールすると、より差別化が図れます。

**2. 将来性：3/5 (★★★☆☆)**
* **理由:** ECサイトでの通販展開は、地域に縛られない販路拡大の可能性を秘めており、将来性を感じさせます。
* **改善点:** ECサイトで主力となる商品は何か、具体的な計画を追記すると、事業の解像度が上がります。

---
*(これはAIサーバーが応答しない場合に表示されるサンプル評価です)*
`;
        evaluateAiButton.addEventListener('click', async () => {
            const textSections = [
                { id: 'motive', title: '創業の動機' },
                { id: 'sales_point', title: 'セールスポイント（自社の強み）' },
                { id: 'target', title: '販売方法・戦略（集客方法）' },
                { id: 'competition', title: '競合・市場など自社をとりまく状況' },
                { id: 'future-vision', title: '事業の見通し' }
            ];
            const financialSections = [
                { id: 'sales_initial', title: '創業当初の売上高' },
                { id: 'cogs_initial', title: '創業当初の売上原価' },
                { id: 'personnel_initial', title: '創業当初の人件費' },
                { id: 'rent_initial', title: '創業当初の家賃' },
                { id: 'repayment_initial', title: '創業当初の借入金返済額' }
            ];
            const industryElement = document.getElementById('industry-type');
            const industryText = industryElement ? `【事業の業種】\n${industryElement.value}\n\n` : '';
            
            let fullText = '## 事業計画の文章\n';
            fullText += industryText;
            textSections.forEach(section => {
                const element = document.getElementById(section.id);
                if (element && element.value.trim() !== '') {
                    fullText += `【${section.title}】\n${element.value}\n\n`;
                }
            });
            fullText += '\n## 事業計画の数値（月次・円）\n';
            financialSections.forEach(section => {
                const element = document.getElementById(section.id);
                if (element && element.value.trim() !== '') {
                    fullText += `【${section.title}】\n${element.value} 円\n`;
                }
            });

            if (fullText.length < 100) { 
                alert('評価する文章が入力されていません。');
                return;
            }
            
            aiResponseText.innerHTML = 'AIが評価を生成中です。しばらくお待ちください...';
            modalContent.classList.add('loading');
            showModal();

            const maxRetries = 3;
            let success = false;
            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                try {
                    const response = await fetch('https://hajime-server.onrender.com/evaluate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ text: fullText }),
                    });
                    if (!response.ok) {
                        throw new Error(`サーバーエラー (ステータス: ${response.status})`);
                    }
                    const data = await response.json();
                    aiResponseText.innerHTML = marked.parse(data.result);
                    success = true;
                    break;
                } catch (error) {
                    console.error(`Attempt ${attempt} failed:`, error);
                    if (attempt < maxRetries) {
                        const waitTime = attempt * 2;
                        aiResponseText.innerHTML = `サーバーが混み合っています。${waitTime}秒後にもう一度試します... (${attempt}/${maxRetries})`;
                        await sleep(waitTime * 1000);
                    }
                }
            }
            if (!success) {
                aiResponseText.innerHTML = marked.parse(dummyResponse);
            }
            modalContent.classList.remove('loading');
        });

        modalOverlay.addEventListener('click', hideModal);
    }
    // ▲▲ AI評価モーダル機能 ▲▲

    // ▼▼ リセットボタン機能（改善版） ▼▼
    document.getElementById("reset")?.addEventListener("click", function () {
        Swal.fire({
            title: '本当にリセットしますか？',
            text: "入力内容はすべて消去され、元に戻せません。",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'はい、リセットします',
            cancelButtonText: 'いいえ'
        }).then((result) => {
            if (result.isConfirmed) {
                const form = document.getElementById("business-plan-form");
                if (form) {
                    form.querySelectorAll('input, textarea').forEach(input => {
                        if(input.type !== 'button' && input.type !== 'submit' && input.type !== 'reset') {
                            input.value = '';
                        }
                    });
                     form.querySelectorAll('select').forEach(select => {
                         select.selectedIndex = 0;
                     });
                }
                document.getElementById("history-container").innerHTML = "";
                document.getElementById("staff-container").innerHTML = "";
                rowCount = 0;
                staffCount = 0;
                addHistoryRow();
                addStaffRow();
                updateFinancialTotals();
                updateCashFlowCalculations();
                localStorage.removeItem('businessPlanData');
                Swal.fire('リセット完了', '入力内容がリセットされました。', 'success')
            }
        });
    });
    // ▲▲ リセットボタン機能 ▲▲

    // --- 自動計算イベントリスナー ---
    const financialTotalInputs = [
        'equipment-cost', 'operating-cost', 'self-funding', 
        'family-loan', 'jfc-loan', 'bank-loan', 'other-funding'
    ];
    financialTotalInputs.forEach(id => {
        document.getElementById(id)?.addEventListener('input', updateFinancialTotals);
    });

    document.querySelectorAll('.financial-input').forEach(input => {
        input.addEventListener('input', updateCashFlowCalculations);
    });
    
   // --- 保存データ復元 ---
    const savedData = localStorage.getItem('businessPlanData');
    const urlParams = new URLSearchParams(window.location.search);
    const isDummyFill = urlParams.get('action') === 'dummy-fill';

    if (savedData) {
        const data = JSON.parse(savedData);
        Object.keys(data).forEach(key => {
            if (key === 'history' || key === 'staff') return;
            const element = document.querySelector(`[name="${key}"]`);
            if (element) {
                element.value = data[key];
            }
        });
        if (data.history) {
            const historyContainer = document.getElementById('history-container');
            historyContainer.innerHTML = '';
            rowCount = 0; 
            data.history.forEach(item => {
                addHistoryRow(); 
                const lastRow = historyContainer.querySelector(`.history-row:last-child`);
                if(lastRow) {
                    lastRow.querySelector('input[name^="company_"]').value = item.company;
                    lastRow.querySelector('input[name^="position_"]').value = item.position;
                    lastRow.querySelector('select[name^="years_"]').value = item.years;
                }
            });
        }
        if (data.staff) {
            const staffContainer = document.getElementById('staff-container');
            staffContainer.innerHTML = '';
            staffCount = 0;
            data.staff.forEach(item => {
                addStaffRow();
                const lastRow = staffContainer.querySelector(`.staff-row:last-child`);
                if(lastRow) {
                    lastRow.querySelector('input[name^="staff_role_"]').value = item.role;
                    lastRow.querySelector('input[name^="staff_count_"]').value = item.count;
                    lastRow.querySelector('input[name^="staff_duties_"]').value = item.duties;
                }
            });
        }
        updateFinancialTotals();
        updateCashFlowCalculations();

        // ダミーデータ入力時以外にメッセージを表示
        if (!isDummyFill) {
            Swal.fire({
                title: "読み込みました",
                text: "保存された入力内容を読み込みました。",
                icon: "info",
                showConfirmButton: false,
                timer: 1500
            });
        }
    } else {
        addHistoryRow();
        addStaffRow();
    }   

    // ページ読み込み時に計算を実行
    updateFinancialTotals();
    updateCashFlowCalculations();
    });