document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionButton = item.querySelector('.faq-question');

        questionButton.addEventListener('click', () => {
            const answer = item.querySelector('.faq-answer');
            const isActive = questionButton.classList.contains('active');

            // 一旦、すべてのアコーディオンを閉じる
            faqItems.forEach(otherItem => {
                otherItem.querySelector('.faq-question').classList.remove('active');
                otherItem.querySelector('.faq-answer').classList.remove('active');
                otherItem.querySelector('.icon').style.transform = 'rotate(0deg)';
            });

            // クリックされたものが非アクティブだった場合、開く
            if (!isActive) {
                questionButton.classList.add('active');
                answer.classList.add('active');
                questionButton.querySelector('.icon').style.transform = 'rotate(45deg)';
            }
        });
    });
});