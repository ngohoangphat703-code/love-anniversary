class LoveCounter {
    constructor() {
        this.inputEl = document.getElementById('start-date-input');
        this.yearsEl = document.getElementById('counter-years');
        this.monthsEl = document.getElementById('counter-months');
        this.daysEl = document.getElementById('counter-days');
        this.totalDaysBadge = document.getElementById('total-days-badge');

        this.initRealtimeSync();
    }

    async initRealtimeSync() {
        const { doc, getDoc, setDoc, onSnapshot } = window.firebaseModules;
        const db = window.db;
        const docRef = doc(db, "love_config", "settings");

        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            await setDoc(docRef, { startDate: LOVE_CONFIG.defaultStartDate });
        }

        // Lắng nghe thay đổi dữ liệu thời gian thực từ Cloud Firebase
        onSnapshot(docRef, (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                if (data.startDate) {
                    this.inputEl.value = data.startDate.slice(0, 10);
                    this.updateCounter(data.startDate);
                }
            }
        });

        this.inputEl.addEventListener('change', async (e) => {
            const newDate = e.target.value;
            if (newDate) {
                await setDoc(docRef, { startDate: newDate }, { merge: true });
            }
        });

        setInterval(() => {
            if (this.inputEl.value) this.updateCounter(this.inputEl.value);
        }, 60000);
    }

    updateCounter(startVal) {
        if (!startVal) return;

        const startDate = new Date(startVal);
        const today = new Date();

        startDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        if (startDate > today) {
            this.yearsEl.innerText = "00";
            this.monthsEl.innerText = "00";
            this.daysEl.innerText = "00";
            this.totalDaysBadge.innerText = "Ngày chọn ở tương lai!";
            return;
        }

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

        const totalDiffTime = Math.abs(today - startDate);
        const totalDays = Math.floor(totalDiffTime / (1000 * 60 * 60 * 24));

        this.yearsEl.innerText = String(years).padStart(2, '0');
        this.monthsEl.innerText = String(months).padStart(2, '0');
        this.daysEl.innerText = String(days).padStart(2, '0');

        this.totalDaysBadge.innerText = `Đã đồng hành cùng nhau hơn ${totalDays} ngày ngọt ngào! ✨`;
    }
}