class LoveCounter {
    constructor() {
        this.inputEl = document.getElementById('start-date-input');
        this.yearsEl = document.getElementById('counter-years');
        this.monthsEl = document.getElementById('counter-months');
        this.daysEl = document.getElementById('counter-days');
        this.totalDaysBadge = document.getElementById('total-days-badge');

        this.init();
    }

    init() {
        const savedDate = localStorage.getItem('love_start_date') || LOVE_CONFIG.defaultStartDate;
        this.inputEl.value = savedDate.slice(0, 10);

        this.updateCounter();

        this.inputEl.addEventListener('change', (e) => {
            if (e.target.value) {
                localStorage.setItem('love_start_date', e.target.value);
                this.updateCounter();
            }
        });

        // Cập nhật định kỳ
        setInterval(() => this.updateCounter(), 60000);
    }

    updateCounter() {
        const startVal = this.inputEl.value;
        if (!startVal) return;

        const startDate = new Date(startVal);
        const today = new Date();

        // Chuẩn hóa thời gian về 00:00:00 để tính theo ngày
        startDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        if (startDate > today) {
            this.yearsEl.innerText = "00";
            this.monthsEl.innerText = "00";
            this.daysEl.innerText = "00";
            this.totalDaysBadge.innerText = "Ngày chọn ở tương lai!";
            return;
        }

        // Tính Năm, Tháng, Ngày lẻ
        let years = today.getFullYear() - startDate.getFullYear();
        let months = today.getMonth() - startDate.getMonth();
        let days = today.getDate() - startDate.getDate();

        if (days < 0) {
            months -= 1;
            const prevMonthLastDay = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
            days += prevMonthLastDay;
        }

        if (months < 0) {
            years -= 1;
            months += 12;
        }

        // Tính tổng số ngày thực tế
        const totalDiffTime = Math.abs(today - startDate);
        const totalDays = Math.floor(totalDiffTime / (1000 * 60 * 60 * 24));

        this.yearsEl.innerText = String(years).padStart(2, '0');
        this.monthsEl.innerText = String(months).padStart(2, '0');
        this.daysEl.innerText = String(days).padStart(2, '0');

        this.totalDaysBadge.innerText = `Đã đồng hành cùng nhau hơn ${totalDays} ngày ngọt ngào! ✨`;
    }
}