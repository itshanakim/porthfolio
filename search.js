(function () {
    const input = document.getElementById("mk-search-input");
    const results = document.getElementById("mk-search-results");
    const status = document.getElementById("mk-search-status");

    if (!input || !results || !status || typeof practiceBookItems === "undefined") {
        return;
    }

    function normalize(text) {
        return text.toLowerCase().trim();
    }

    function matchesQuery(item, query) {
        if (!query) {
            return true;
        }

        const haystack = normalize(item.caption + " " + item.alt);
        const terms = query.split(/\s+/).filter(Boolean);

        return terms.every(function (term) {
            return haystack.includes(term);
        });
    }

    function renderItem(item) {
        const figure = document.createElement("figure");
        figure.className = "mk-work-item";

        const link = document.createElement("a");
        link.className = "mk-search-result-link";
        link.href = "products.html#" + item.id;

        const img = document.createElement("img");
        img.src = item.image;
        img.alt = item.alt;
        img.className = "mk-work-item__img";
        img.loading = "lazy";

        const caption = document.createElement("figcaption");
        caption.className = "mk-work-item__caption";
        caption.textContent = item.caption;

        link.appendChild(img);
        figure.appendChild(link);
        figure.appendChild(caption);

        return figure;
    }

    function updateStatus(query, count) {
        if (!query) {
            status.textContent = "Search by designer, collection, season, or any words from your notes below each design.";
            return;
        }

        if (count === 0) {
            status.textContent = 'No designs found for "' + query + '".';
            return;
        }

        status.textContent = count === 1
            ? "1 design found."
            : count + " designs found.";
    }

    function renderResults(query) {
        const normalizedQuery = normalize(query);
        const matches = practiceBookItems.filter(function (item) {
            return matchesQuery(item, normalizedQuery);
        });

        results.innerHTML = "";

        if (!normalizedQuery) {
            updateStatus("", 0);
            return;
        }

        matches.forEach(function (item) {
            results.appendChild(renderItem(item));
        });

        updateStatus(query.trim(), matches.length);
    }

    input.addEventListener("input", function () {
        renderResults(input.value);
    });

    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get("q");

    if (initialQuery) {
        input.value = initialQuery;
        renderResults(initialQuery);
    } else {
        updateStatus("", 0);
    }

    input.focus();
})();
