// Mobile menu toggle
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

// Simulator State
let selectedBookData = null;
let logEntries = [];

function selectBook(id, title, uid, rak) {
    selectedBookData = { id, title, uid, rak };
    
    const resultBox = document.getElementById('scanner-result');
    const statusBadge = document.getElementById('status-badge');
    const actionButtons = document.getElementById('action-buttons');

    if (statusBadge) {
        statusBadge.className = "bg-blue-500/20 text-blue-300 text-xs px-2.5 py-1 rounded-full border border-blue-500/30";
        statusBadge.innerText = "Tag Dipilih (Belum Ditap)";
    }

    if (resultBox) {
        resultBox.innerHTML = `
            <div class="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-2">
                <div class="flex justify-between text-xs text-slate-400 font-mono">
                    <span>ID: ${id}</span>
                    <span class="text-accent font-semibold">${rak}</span>
                </div>
                <h5 class="text-white font-semibold text-base">${title}</h5>
                <p class="text-xs text-blue-400 font-mono">RFID Tag UID: ${uid}</p>
            </div>
        `;
    }

    if (actionButtons) {
        actionButtons.classList.add('hidden');
    }
}

function simulateScan() {
    if (!selectedBookData) {
        // Default select first book if none chosen
        selectBook('B001', 'Pemrograman Web Modern', 'UID: A4-89-2B-10', 'Rak A-1');
    }

    const statusBadge = document.getElementById('status-badge');
    const resultBox = document.getElementById('scanner-result');
    const actionButtons = document.getElementById('action-buttons');

    if (statusBadge) {
        statusBadge.className = "bg-green-500/20 text-green-300 text-xs px-2.5 py-1 rounded-full border border-green-500/30 animate-pulse";
        statusBadge.innerText = "Tag Terbaca (Reader OK)";
    }

    if (resultBox) {
        resultBox.innerHTML = `
            <div class="bg-emerald-950/40 p-4 rounded-xl border border-emerald-500/30 space-y-2">
                <div class="flex items-center justify-between">
                    <span class="text-xs text-emerald-400 font-mono font-bold flex items-center gap-1.5">
                        <i class="fa-solid fa-circle-check"></i> Sinyal 13.56 MHz Berhasil Menangkap Tag
                    </span>
                    <span class="text-xs text-slate-400 font-mono">${selectedBookData.rak}</span>
                </div>
                <h5 class="text-white font-bold text-base">${selectedBookData.title}</h5>
                <p class="text-xs text-emerald-300 font-mono">UID: ${selectedBookData.uid} | Status: Tersedia di Sistem</p>
            </div>
        `;
    }

    if (actionButtons) {
        actionButtons.classList.remove('hidden');
    }

    // Add to log
    addLog(selectedBookData.uid, selectedBookData.title, 'Scan Berhasil (Reader)');
}

function processCirculation(type) {
    if (!selectedBookData) return;

    const timeNow = new Date().toLocaleTimeString();
    const actionText = type === 'pinjam' ? 'Peminjaman Disetujui' : 'Pengembalian Diterima';
    const badgeColor = type === 'pinjam' ? 'text-amber-400' : 'text-emerald-400';

    const statusBadge = document.getElementById('status-badge');
    if (statusBadge) {
        statusBadge.className = "bg-primary/20 text-blue-300 text-xs px-2.5 py-1 rounded-full border border-primary/30";
        statusBadge.innerText = actionText;
    }

    const resultBox = document.getElementById('scanner-result');
    if (resultBox) {
        resultBox.innerHTML += `
            <div class="bg-blue-950/40 p-3 rounded-xl border border-blue-500/30 text-xs text-blue-200 flex items-center justify-between">
                <span><i class="fa-solid fa-circle-info"></i> Buku <strong>${selectedBookData.title}</strong> berhasil diproses (${actionText}).</span>
                <span class="font-mono text-slate-400">${timeNow}</span>
            </div>
        `;
    }

    addLog(selectedBookData.uid, selectedBookData.title, `<span class="${badgeColor} font-bold">${actionText}</span>`);
}

function addLog(uid, title, status) {
    const timeNow = new Date().toLocaleTimeString();
    logEntries.unshift({ time: timeNow, uid, title, status });
    if (logEntries.length > 5) logEntries.pop();

    const tbody = document.getElementById('log-table-body');
    if (!tbody) return;

    tbody.innerHTML = '';

    logEntries.forEach(entry => {
        const row = document.createElement('tr');
        row.className = "border-b border-slate-800/60 hover:bg-slate-800/30";
        row.innerHTML = `
            <td class="py-2.5 text-slate-400">${entry.time}</td>
            <td class="py-2.5 font-mono text-blue-400">${entry.uid}</td>
            <td class="py-2.5 text-white font-medium">${entry.title}</td>
            <td class="py-2.5">${entry.status}</td>
        `;
        tbody.appendChild(row);
    });
}