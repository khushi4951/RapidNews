
       const API_KEY = "9de9a128a20260e512de8c2501124ee2"; 
         const url = "https://gnews.io/api/v4/search?q=";

        window.addEventListener("load", () => fetchNews("business"));

           async function fetchNews(query) {
    const res = await fetch(`${url}${encodeURIComponent(query)}&lang=en&max=10&token=${9de9a128a20260e512de8c2501124ee2}`);
    const data = await res.json();
    bindData(data.articles);
}


        function bindData(articles) {
            const cardsContainer = document.getElementById("cardscontainer");
            const newsCardTemplate = document.getElementById("template-news-card");

            cardsContainer.innerHTML = "";

            articles.forEach((article) => {
                if (!article.urlToImage) return;

                const cardClone = newsCardTemplate.content.cloneNode(true);
                fillDataInCard(cardClone, article);
                cardsContainer.appendChild(cardClone);
            });
        }

        function fillDataInCard(cardClone, article) {
            const newsImg = cardClone.querySelector("#news-img");
            const newsTitle = cardClone.querySelector("#news-title");
            const newsSource = cardClone.querySelector("#news-source");
            const newsDesc = cardClone.querySelector("#news-desc");
            const bookmarkBtn = cardClone.querySelector(".bookmark-btn");

           newsImg.src = article.urlToImage || article.image;
            newsTitle.innerHTML = article.title;
            newsDesc.innerHTML = article.description;

            const date = new Date(article.publishedAt).toLocaleString("en-US", {
                timeZone: "Asia/Jakarta",
            });

            newsSource.innerHTML = `${article.source.name} · ${date}`;


            cardClone.firstElementChild.addEventListener("click", () => {
                window.open(article.url, "_blank");
            });

            bookmarkBtn.addEventListener("click", () => {
                addBookmark(article);
            });
        }

        function addBookmark(article) {
            let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
            const isAlreadyBookmarked = bookmarks.some((item) => item.title === article.title);

            if (isAlreadyBookmarked) {
                alert("This article is already bookmarked!");
                return;
            }

            bookmarks.push({
                title: article.title,
                urlToImage: article.image,
                description: article.description,
                source: article.source.name,
                url: article.url,
                publishedAt: article.publishedAt,
            });

            localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
            alert("Article bookmarked!");
        }

        function loadBookmarks() {
            const cardsContainer = document.getElementById("cardscontainer");
            const newsCardTemplate = document.getElementById("template-news-card");

            cardsContainer.innerHTML = "";

            const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

            if (bookmarks.length === 0) {
                cardsContainer.innerHTML = "<p>No bookmarks yet!</p>";
                return;
            }

            bookmarks.forEach((bookmark) => {
                const cardClone = newsCardTemplate.content.cloneNode(true);
                fillDataInCard(cardClone, bookmark);

                const bookmarkBtn = cardClone.querySelector(".bookmark-btn");
                bookmarkBtn.textContent = "Remove Bookmark";
                bookmarkBtn.addEventListener("click", () => removeBookmark(bookmark.title));

                cardsContainer.appendChild(cardClone);
            });
        }

        function removeBookmark(title) {
            let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
            bookmarks = bookmarks.filter((item) => item.title !== title);
            localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
            alert("Bookmark removed!");
            loadBookmarks();
        }
        let curSelectedNav = null;

        function onNavItemClick(id) {
            fetchNews(id);
            const navItem = document.getElementById(id);
            curSelectedNav?.classList.remove("active");
            curSelectedNav = navItem;
            curSelectedNav.classList.add("active");
        }

        const searchButton = document.getElementById("search-button");
        const searchText = document.getElementById("search-text");

        searchButton.addEventListener("click", () => {
            const query = searchText.value;
            if (!query) return;
            fetchNews(query);
        });

        const darkModeToggle = document.getElementById("dark-mode-toggle");

        if (localStorage.getItem("dark-mode") === "enabled") {
            document.body.classList.add("dark-mode");
            darkModeToggle.checked = true;
        }

        darkModeToggle.addEventListener("change", () => {
            if (darkModeToggle.checked) {
                document.body.classList.add("dark-mode");
                localStorage.setItem("dark-mode", "enabled");
            } else {
                document.body.classList.remove("dark-mode");
                localStorage.setItem("dark-mode", "disabled");
            }
        });
        
