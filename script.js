function calculateTotal() {
    const price = 850;
    const q1 = parseInt(document.getElementById('qty_no_alcohol').value) || 0;
    const q2 = parseInt(document.getElementById('qty_strong').value) || 0;
    const q3 = parseInt(document.getElementById('qty_normal').value) || 0;
    
    const subtotal = (q1 + q2 + q3) * price;
    document.getElementById('subtotal').innerText = `$${subtotal}`;

    let ship = (subtotal === 0) ? 0 : (subtotal >= 1500 ? 0 : 129);
    let msg = (subtotal >= 1500) ? '🎉 已達 $1500 門檻，享免運優惠！' : (subtotal > 0 ? `再買 $${1500 - subtotal} 即可享冷凍免運。` : '');

    document.getElementById('shipping_fee').innerText = `$${ship}`;
    document.getElementById('free_shipping_msg').innerText = msg;
    document.getElementById('grand_total').innerText = `$${subtotal + ship}`;
}

function submitOrder() {
    const name = document.getElementById('cust_name').value.trim();
    const phone = document.getElementById('cust_phone').value.trim();
    const social = document.getElementById('cust_social').value.trim(); // 抓取 IG / 社群帳號
    const store = document.getElementById('shipping_store').value.trim();
    const q1 = parseInt(document.getElementById('qty_no_alcohol').value) || 0;
    const q2 = parseInt(document.getElementById('qty_strong').value) || 0;
    const q3 = parseInt(document.getElementById('qty_normal').value) || 0;

    if (q1 + q2 + q3 === 0) { alert('購物車是空的，請至少選擇一組喔！'); return; }
    if (!name || !phone || !social || !store) { alert('請填寫完整收件資料與社群名稱！'); return; }
    if (!/^09\d{8}$/.test(phone)) { alert('手機格式不正確！必須是 09 開頭 10 碼數字。'); return; }

    const total = document.getElementById('grand_total').innerText;
    
    // 產生專屬訂單編號
    const d = new Date();
    const yy = d.getFullYear().toString().slice(-2);
    const mm = ('0' + (d.getMonth() + 1)).slice(-2);
    const dd = ('0' + d.getDate()).slice(-2);
    const randomStr = Math.floor(1000 + Math.random() * 9000);
    const orderId = 'VD' + yy + mm + dd + randomStr;

    // 將資料打包 (包含新加入的 social)
    const orderData = {
        order_id: orderId, 
        name: name, 
        phone: phone, 
        social: social, 
        store: store,
        qty_no_alcohol: q1, 
        qty_strong: q2, 
        qty_normal: q3, 
        total: total
    };

    const btn = document.querySelector('button');
    btn.innerText = "訂單連線傳送中..."; 
    btn.disabled = true;

    // ★★★ 請把下方引號內的文字換成您的最新 GAS 部署網址 ★★★
    const scriptURL = '請貼上您的GAS網址';

    fetch(scriptURL, {
        method: 'POST',
        body: JSON.stringify(orderData),
        headers: { 'Content-Type': 'text/plain;charset=utf-8' }
    })
    .then(() => {
        document.getElementById('final_show_total').innerText = total;
        document.getElementById('final_order_id').innerText = orderId;
        document.getElementById('main_form').innerHTML = document.getElementById('success_template').innerHTML;
        window.scrollTo(0, 0); 
    })
    .catch(error => {
        console.error(error);
        alert('傳送失敗，請確認網址或檢查網路狀況！');
        btn.innerText = "確認結帳"; 
        btn.disabled = false;
    });
}

// 畫面載入時自動計算一次總金額
window.onload = calculateTotal;
