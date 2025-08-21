// ▼▼▼ この行を追加 ▼▼▼
// HTMLドキュメントの読み込みが完了したら、中のコードを実行する
document.addEventListener('DOMContentLoaded', function() {

    // --- 金額入力欄にカンマを自動挿入 ---
    const amountInput = document.getElementById('amount');

    // amountInputがページに存在する場合のみ、イベントリスナーを追加
    if (amountInput) {
        amountInput.addEventListener('input', function (e) {
            const rawValue = e.target.value.replace(/[^\d]/g, '');
            const formattedValue = Number(rawValue).toLocaleString();
            e.target.value = formattedValue;
        });
    }

    // --- 返済シミュレーション処理 ---
    const repaymentForm = document.querySelector('.repayment-form');

    // repaymentFormがページに存在する場合のみ、イベントリスナーを追加
    if (repaymentForm) {
        repaymentForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // 入力値取得（カンマを除去して数値化）
            const amount = Number(document.getElementById('amount').value.replace(/,/g, ''));
            const annualInterest = Number(document.getElementById('interest').value) / 100;
            const totalMonths = Number(document.getElementById('period').value);
            const graceMonths = Number(document.getElementById('grace').value) || 0;
            const method = document.querySelector('input[name="method"]:checked').value;

            // 入力チェック
            if(amount <= 0 || annualInterest < 0 || totalMonths <= 0 || graceMonths < 0 || graceMonths >= totalMonths) {
                // alertの代わりに、よりモダンなUIを推奨しますが、一旦このままにします
                alert('入力値を正しく設定してください。');
                return;
            }

            const monthlyInterest = annualInterest / 12;
            let schedule = [];
            let remainingPrincipal = amount;

            function calcPrincipalEqual() {
                const repaymentMonths = totalMonths - graceMonths;
                // 返済月数が0以下になるケースを考慮
                if (repaymentMonths <= 0) return;
                const principalPerMonth = amount / repaymentMonths;

                for(let i = 1; i <= totalMonths; i++) {
                    let principalPayment = 0;
                    let interestPayment = 0;

                    if(i <= graceMonths) {
                        interestPayment = remainingPrincipal * monthlyInterest;
                    } else {
                        principalPayment = principalPerMonth;
                        interestPayment = remainingPrincipal * monthlyInterest;
                        remainingPrincipal -= principalPayment;
                    }
                    schedule.push({
                        month: i,
                        principal: principalPayment,
                        interest: interestPayment,
                        total: principalPayment + interestPayment,
                        balance: remainingPrincipal < 0 ? 0 : remainingPrincipal,
                    });
                }
            }

            function calcAnnuity() {
                const repaymentMonths = totalMonths - graceMonths;
                // 返済月数が0以下になるケースを考慮
                if (repaymentMonths <= 0) return;
                
                // 金利が0の場合の計算を追加
                if (monthlyInterest === 0) {
                    const annuityPayment = amount / repaymentMonths;
                    for(let i = 1; i <= totalMonths; i++) {
                        let principalPayment = 0;
                        let interestPayment = 0;
                        if (i > graceMonths) {
                            principalPayment = annuityPayment;
                            remainingPrincipal -= principalPayment;
                        }
                        schedule.push({
                            month: i, principal: principalPayment, interest: interestPayment, total: principalPayment, balance: remainingPrincipal < 0 ? 0 : remainingPrincipal
                        });
                    }
                    return;
                }

                const pow = Math.pow(1 + monthlyInterest, repaymentMonths);
                const annuityPayment = (amount * monthlyInterest * pow) / (pow - 1);

                for(let i = 1; i <= totalMonths; i++) {
                    let principalPayment = 0;
                    let interestPayment = 0;

                    if(i <= graceMonths) {
                        interestPayment = remainingPrincipal * monthlyInterest;
                    } else {
                        interestPayment = remainingPrincipal * monthlyInterest;
                        principalPayment = annuityPayment - interestPayment;
                        remainingPrincipal -= principalPayment;
                    }
                    schedule.push({
                        month: i,
                        principal: principalPayment,
                        interest: interestPayment,
                        total: (i <= graceMonths) ? interestPayment : annuityPayment, // 据置期間中は利息のみ、以降は一定額
                        balance: remainingPrincipal < 0 ? 0 : remainingPrincipal,
                    });
                }
            }

            schedule = [];
            remainingPrincipal = amount;

            if(method === 'principal_equal') {
                calcPrincipalEqual();
            } else if(method === 'annuity') {
                calcAnnuity();
            } else {
                alert('返済方式が不正です');
                return;
            }

            const totalPrincipal = schedule.reduce((sum, p) => sum + p.principal, 0);
            const totalInterest = schedule.reduce((sum, p) => sum + p.interest, 0);
            const totalPayment = totalPrincipal + totalInterest;

            const resultBox = document.querySelector('.result-box');
            resultBox.innerHTML = '';

            const table = document.createElement('table');

            const header = table.insertRow();
            ['月', '返済元金 (円)', '利息 (円)', '合計返済額 (円)', '残高 (円)'].forEach(text => {
                const th = document.createElement('th');
                th.textContent = text;
                header.appendChild(th);
            });

            schedule.forEach(row => {
                const tr = table.insertRow();
                tr.insertCell().textContent = row.month;
                tr.insertCell().textContent = Math.round(row.principal).toLocaleString();
                tr.insertCell().textContent = Math.round(row.interest).toLocaleString();
                tr.insertCell().textContent = Math.round(row.total).toLocaleString();
                tr.insertCell().textContent = Math.round(row.balance).toLocaleString();
            });

            const totalRow = table.insertRow();
            totalRow.classList.add('total-row');
            totalRow.insertCell().textContent = '合計';
            totalRow.insertCell().textContent = Math.round(totalPrincipal).toLocaleString();
            totalRow.insertCell().textContent = Math.round(totalInterest).toLocaleString();
            totalRow.insertCell().textContent = Math.round(totalPayment).toLocaleString();
            totalRow.insertCell().textContent = '-';

            resultBox.appendChild(table);
            resultBox.style.display = 'block';
            const headerOffset = 80;
            const elementPosition = resultBox.getBoundingClientRect().top;
            const offsetPosition = window.scrollY + elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    }

// ▼▼▼ この行を追加 ▼▼▼
});
