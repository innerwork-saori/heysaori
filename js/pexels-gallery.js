
        let API_KEY = '';
        let isLoading = false;

        function saveApiKey() {
            const apiKeyInput = document.getElementById('apiKey');
            const apiStatus = document.getElementById('apiStatus');
            API_KEY = apiKeyInput.value.trim();
            
            if (API_KEY) {
                apiStatus.classList.add('show');
                apiKeyInput.value = ''; // 清空輸入框以增加安全性
            } else {
                alert('⚠️ 請輸入 API 金鑰');
            }
        }

        async function getRandomImages() {
            if (!API_KEY) {
                alert('⚠️ 請先輸入並儲存 API 金鑰');
                return;
            }
            
            if (isLoading) return;
            
            const searchTerm = document.getElementById('searchTerm').value.trim();
            const gallery = document.getElementById('gallery');
            const errorDiv = document.getElementById('error');
            const btn = document.getElementById('randomBtn');
            
            isLoading = true;
            btn.disabled = true;
            errorDiv.classList.remove('show');
            
            gallery.innerHTML = '<div class="loading-container"><div class="spinner"></div><p>正在載入圖片...</p></div>';

            try {
                const query = searchTerm || 'random';
                const perPage = 80;
                const randomPage = Math.floor(Math.random() * 10) + 1;
                
                const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}&page=${randomPage}`;
                
                const response = await fetch(url, {
                    headers: {
                        'Authorization': API_KEY
                    }
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        throw new Error('API 金鑰無效，請檢查你的 Pexels API 金鑰是否正確');
                    }
                    throw new Error('API 請求失敗');
                }

                const data = await response.json();
                
                if (data.photos && data.photos.length > 0) {
                    // 隨機選擇 8 張不重複的圖片
                    const selectedPhotos = [];
                    const availablePhotos = [...data.photos];
                    const count = Math.min(8, availablePhotos.length);
                    
                    for (let i = 0; i < count; i++) {
                        const randomIndex = Math.floor(Math.random() * availablePhotos.length);
                        selectedPhotos.push(availablePhotos[randomIndex]);
                        availablePhotos.splice(randomIndex, 1);
                    }
                    
                    gallery.innerHTML = '';
                    
                    selectedPhotos.forEach((photo, index) => {
                        const card = document.createElement('div');
                        card.className = 'image-card';
                        card.style.animationDelay = `${index * 0.1}s`;
                        
                        card.innerHTML = `
                            <img src="${photo.src.large}" alt="${photo.alt || '隨機圖片'}" loading="lazy">
                            <div class="image-info">
                                <p class="photographer">📸 ${photo.photographer}</p>
                                <a href="${photo.url}" target="_blank" class="view-link">在 Pexels 上查看 →</a>
                            </div>
                        `;
                        
                        gallery.appendChild(card);
                    });
                    
                    isLoading = false;
                    btn.disabled = false;
                } else {
                    throw new Error('找不到符合的圖片，請嘗試其他關鍵字');
                }
            } catch (error) {
                gallery.innerHTML = '<div class="placeholder">載入失敗 😕</div>';
                errorDiv.textContent = error.message || '發生錯誤，請稍後再試';
                errorDiv.classList.add('show');
                isLoading = false;
                btn.disabled = false;
            }
        }

        document.getElementById('searchTerm').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                getRandomImages();
            }
        });
    