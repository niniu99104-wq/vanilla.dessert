function calculateTotal() {
    const price = 850;
    const q1 = parseInt(document.getElementById('qty_no_alcohol').value) || 0;
    const q2 = parseInt(document.getElementById('qty_strong').value) || 0;
    const q3 = parseInt(document.getElementById('qty_normal').value) || 0;
    
    const subtotal = (q1 + q2 + q3) * price;
    document.getElementById('subtotal').innerText = `$${subtotal}`;

    let ship = subtotal === 0 ? 0 : (subtotal >= 1500 ? 0 : 129);
    let msg = subtotal >= 1500 ? '🎉 已達 $1500 享免運！' : (subtotal > 0 ? `再買 $${1500-subtotal} 享免運。` : '');

    document.getElementById('shipping_fee').innerText = `$${ship}`;
    document.getElementById('free_shipping_msg').innerText = msg;
    document.getElementById('grand_total').innerText = `$${subtotal + ship}`;
}

function submitOrder() {
    const name = document.getElementById('cust_name').value.trim();
    const phone = document.getElementById('cust_phone').value.trim();
    const store = document.getElementById('shipping_store').value.trim();
    const q1 = parseInt(document.getElementById('qty_no_alcohol').value) || 0;
    const q2 = parseInt(document.getElementById('qty_strong').value) || 0;
    const q3 = parseInt(document.getElementById('qty_normal').value) || 0;

    if (q1+q2+q3 === 0) return alert('請選擇數量！');
    if (!name || !phone || !store) return alert('請填齊資料！');
    if (!/^09\d{8}$/.test(phone)) return alert('手機格式錯誤！');

    const total = document.getElementById('grand_total').innerText;
    const orderId = 'VD' + new Date().toISOString().slice(2,10).replace(/-/g,'') + Math.floor(1000+Math.random()*9000);

    const data = { order_id: orderId, name, phone, store, qty_no_alcohol: q1, qty_strong: q2, qty_normal: q3, total };

    const btn = document.querySelector('button');
    btn.innerText = "傳送中..."; btn.disabled = true;

    // ★★★ 務必替換為您最新的 GAS 部署網址 ★★★
    const scriptURL = 'https://script.google.com/macros/s/AKfycby461uY8_a7ni2s2w2KscvbBgcqGEFWKF2FVm7mDpBbINXBLEa-0s-SbeHOw4oP-qis4g/exec';

    fetch(scriptURL, { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'text/plain;charset=utf-8' } })
    .then(() => {
        document.getElementById('final_show_total').innerText = total;
        document.getElementById('final_order_id').innerText = orderId;
        document.getElementById('main_form').innerHTML = document.getElementById('success_template').innerHTML;
        window.scrollTo(0, 0);
    })
    .catch(() => { alert('連線失敗，請再試一次！'); btn.innerText = "確認結帳"; btn.disabled = false; });
}
window.onload = calculateTotal;
