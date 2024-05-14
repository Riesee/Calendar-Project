class Storage {
    // Verileri yerel depolama alanına kaydetme işlevi
    static saveToStorage(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }
    
    // Verileri yerel depolama alanından almak için işlev
    static getFromStorage(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }
    
    // Span içindeki saat ve etkinlikleri yerel depolama alanına kaydetme işlevi
    static saveSpanToStorage(spanId, date, newEvents = []) {
        // localStorage'dan mevcut veriyi alın
        const existingSpanData = this.getFromStorage(spanId) || {};
        
        // Yeni bir nesne oluşturun ve mevcut veriyi kopyalayın
        const spanData = Object.assign({}, existingSpanData);
        
        // Yeni verileri ekleyin veya güncelleyin
        spanData.date = date;
        // spanData.time = time;
        
        // Mevcut etkinlik listesini alın
        const existingEvents = spanData.events || [];
        
        // Yeni etkinlikleri mevcut etkinlik listesine ekleyin
        spanData.events = [...existingEvents, ...[newEvents]];

        
        // Değişiklikleri yerel depolama alanına kaydedin
        this.saveToStorage(spanId, spanData);
    }

    // Span içindeki saat ve etkinlikleri yerel depolama alanından almak için işlev
    static getSpanFromStorage(spanId) {
        return this.getFromStorage(spanId);
    }



    static saveEventToStorage(spanId, index, newValue) {
        // localStorage'dan mevcut veriyi alın
        const existingSpanData = this.getFromStorage(spanId) || {};
        
        // Yeni bir nesne oluşturun ve mevcut veriyi kopyalayın
        const spanData = Object.assign({}, existingSpanData);
        
        // Mevcut etkinlik listesini alın
        const existingEvents = spanData.events || [];
        
        // Verilen indeks ile var olan etkinliği güncelleyin
        existingEvents[index] = newValue;
    
        // Güncellenmiş etkinlik listesini spanData'ya ekle
        spanData.events = existingEvents;
    
        // Değişiklikleri yerel depolama alanına kaydedin
        this.saveToStorage(spanId, spanData);
    }



    static deleteEventFromStorage(spanId, spanData) {

    
        const keyParts = spanId.split('_').slice(1, 5);
        const key = spanId.split('_').slice(1, 4).join('_'); // Anahtar oluştur
        const index = parseInt(keyParts.pop()); // indeksi al
        

        const NewspanData = this.getFromStorage(key);
        const events = NewspanData.events

        console.log(keyParts,key,index,"keyparts","key","index");

        events.forEach(data => {
            if (spanData[0] === data[0] && spanData[1] === data[1]) {
                const dataIndex = events.indexOf(data)
                events.splice(dataIndex,1);
                NewspanData.events = events
                this.saveToStorage(key, NewspanData);
            }
        });

        const existingSpanData = localStorage.getItem(key);

        if (existingSpanData){
            const eventData = JSON.parse(existingSpanData);
            console.log(eventData.events,"eventdataevents");
            if (!eventData.events || eventData.events.length === 0) {
                localStorage.removeItem(key);
                return;
            }
        }


 
    }
    
    

}