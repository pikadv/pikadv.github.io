"use strict";

// element toggle function
const elementToggleFunc = function (elem) {
	elem.classList.toggle("active");
};

// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () {
	elementToggleFunc(sidebar);
});

// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
	modalContainer.classList.toggle("active");
	overlay.classList.toggle("active");
};

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {
	testimonialsItem[i].addEventListener("click", function () {
		modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
		modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
		modalTitle.innerHTML = this.querySelector(
			"[data-testimonials-title]",
		).innerHTML;
		modalText.innerHTML = this.querySelector(
			"[data-testimonials-text]",
		).innerHTML;

		testimonialsModalFunc();
	});
}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);

// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

if (select) {
	select.addEventListener("click", function () {
		elementToggleFunc(this);
	});
}

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
	selectItems[i].addEventListener("click", function () {
		let selectedValue = this.innerText.toLowerCase();
		if (selectValue) {
			selectValue.innerText = this.innerText;
		}
		if (select) {
			elementToggleFunc(select);
		}
		filterFunc(selectedValue);
	});
}

// filter variables
let filterItems = [];

const filterFunc = function (selectedValue) {
	filterItems = document.querySelectorAll("[data-filter-item]");
	for (let i = 0; i < filterItems.length; i++) {
		if (selectedValue === "all") {
			filterItems[i].classList.add("active");
		} else if (selectedValue === filterItems[i].dataset.category) {
			filterItems[i].classList.add("active");
		} else {
			filterItems[i].classList.remove("active");
		}
	}
};

// portfolio github variables
const portfolioList = document.querySelector("[data-projects-list]");
const portfolioLoading = document.querySelector("[data-project-loading]");
const portfolioPrevBtn = document.querySelector("[data-project-prev]");
const portfolioNextBtn = document.querySelector("[data-project-next]");
const portfolioPageStatus = document.querySelector(
	"[data-project-page-status]",
);
const portfolioFilterBtns = document.querySelectorAll(
	"[data-portfolio-filter-btn]",
);

const githubReposUrl =
	"https://api.github.com/users/pikadv/repos?sort=pushed&per_page=100&type=owner";

const pinnedRepoNames = [
	"pikadv.github.io",
	"leaderboard-react",
	"jakeelwood-webproject",
	"simple-calculator",
	"basketball-scoreboard",
];

const portfolioState = {
	repos: [],
	currentPage: 0,
	pageSize: 6,
	activeFilter: "pinned",
};

const getRepoCategory = function (repo) {
	if (repo.language) {
		return repo.language.toLowerCase();
	}

	return "other";
};

const getRepoImage = function (repo) {
	return `https://opengraph.githubassets.com/1/${repo.full_name}`;
};

const getRepoLink = function (repo) {
	return repo.homepage && repo.homepage.trim()
		? repo.homepage
		: repo.html_url;
};

const getVisiblePortfolioRepos = function () {
	if (portfolioState.activeFilter === "pinned") {
		return portfolioState.repos.filter(function (repo) {
			return pinnedRepoNames.includes(repo.name);
		});
	}

	return portfolioState.repos;
};

const createRepoCard = function (repo) {
	const listItem = document.createElement("li");
	listItem.className = "project-item active";

	const link = document.createElement("a");
	link.href = getRepoLink(repo);
	link.target = "_blank";
	link.rel = "noopener noreferrer";
	link.title = repo.description || repo.name;

	const figure = document.createElement("figure");
	figure.className = "project-img";

	const iconBox = document.createElement("div");
	iconBox.className = "project-item-icon-box";
	iconBox.innerHTML = '<ion-icon name="eye-outline"></ion-icon>';

	const image = document.createElement("img");
	image.src = getRepoImage(repo);
	image.alt = `${repo.name} repository preview`;
	image.loading = "lazy";

	const title = document.createElement("h3");
	title.className = "project-title";
	title.textContent = repo.name;

	const category = document.createElement("p");
	category.className = "project-category";
	category.textContent = repo.language || "Other";

	figure.appendChild(iconBox);
	figure.appendChild(image);
	link.appendChild(figure);
	link.appendChild(title);
	link.appendChild(category);
	listItem.appendChild(link);

	return listItem;
};

const updatePortfolioPagination = function () {
	if (!portfolioPageStatus) {
		return;
	}

	const visibleRepos = getVisiblePortfolioRepos();
	const totalPages = Math.max(
		1,
		Math.ceil(visibleRepos.length / portfolioState.pageSize),
	);

	if (portfolioState.currentPage > totalPages - 1) {
		portfolioState.currentPage = totalPages - 1;
	}

	portfolioPageStatus.textContent = `Page ${portfolioState.currentPage + 1} of ${totalPages}`;

	if (portfolioPrevBtn) {
		portfolioPrevBtn.disabled = portfolioState.currentPage <= 0;
	}

	if (portfolioNextBtn) {
		portfolioNextBtn.disabled =
			portfolioState.currentPage >= totalPages - 1;
	}
};

const renderPortfolioRepos = function () {
	if (!portfolioList) {
		return;
	}

	portfolioList.innerHTML = "";

	const visibleRepos = getVisiblePortfolioRepos();
	const startIndex = portfolioState.currentPage * portfolioState.pageSize;
	const endIndex = startIndex + portfolioState.pageSize;
	const pageRepos = visibleRepos.slice(startIndex, endIndex);

	pageRepos.forEach(function (repo) {
		portfolioList.appendChild(createRepoCard(repo));
	});

	if (portfolioLoading) {
		portfolioLoading.remove();
	}

	updatePortfolioPagination();
};

const processAndRenderRepos = function (reposData) {
	portfolioState.repos = reposData
		.filter(function (repo) {
			return !repo.fork && !repo.archived;
		})
		.sort(function (leftRepo, rightRepo) {
			return new Date(rightRepo.pushed_at) - new Date(leftRepo.pushed_at);
		});

	if (portfolioState.repos.length === 0) {
		if (portfolioLoading) {
			portfolioLoading.innerHTML =
				'<p class="project-category">No public repositories were found.</p>';
		}
		return;
	}

	portfolioState.currentPage = 0;
	renderPortfolioRepos();
};

const loadPortfolioRepos = async function () {
	if (!portfolioList) {
		return;
	}

	const cacheKey = "github_portfolio_repos";
	const cacheTimeKey = "github_portfolio_time";
	const cacheDuration = 60 * 60 * 1000; // 1 hour in milliseconds

	// Check if we have valid cached data
	const cachedRepos = localStorage.getItem(cacheKey);
	const cachedTime = localStorage.getItem(cacheTimeKey);

	if (cachedRepos && cachedTime && Date.now() - cachedTime < cacheDuration) {
		processAndRenderRepos(JSON.parse(cachedRepos));
		return;
	}

	try {
		const response = await fetch(githubReposUrl, {
			headers: {
				Accept: "application/vnd.github+json",
			},
		});

		if (!response.ok) {
			throw new Error(`Failed to load GitHub repos: ${response.status}`);
		}

		const repos = await response.json();

		// Save the fresh data and timestamp to localStorage
		localStorage.setItem(cacheKey, JSON.stringify(repos));
		localStorage.setItem(cacheTimeKey, Date.now());

		processAndRenderRepos(repos);
	} catch (error) {
		// Fallback: If API fails but we have expired cache, use it anyway
		if (cachedRepos) {
			processAndRenderRepos(JSON.parse(cachedRepos));
		} else if (portfolioLoading) {
			portfolioLoading.innerHTML =
				'<p class="project-category">GitHub repositories could not be loaded right now.</p>';
		}
	}
};

for (let i = 0; i < portfolioFilterBtns.length; i++) {
	portfolioFilterBtns[i].addEventListener("click", function () {
		const selectedFilter = this.dataset.portfolioFilter || "pinned";
		portfolioState.activeFilter = selectedFilter;
		portfolioState.currentPage = 0;

		for (
			let buttonIndex = 0;
			buttonIndex < portfolioFilterBtns.length;
			buttonIndex++
		) {
			portfolioFilterBtns[buttonIndex].classList.remove("active");
		}

		this.classList.add("active");
		renderPortfolioRepos();
	});
}

if (portfolioPrevBtn) {
	portfolioPrevBtn.addEventListener("click", function () {
		if (portfolioState.currentPage > 0) {
			portfolioState.currentPage -= 1;
			renderPortfolioRepos();
		}
	});
}

if (portfolioNextBtn) {
	portfolioNextBtn.addEventListener("click", function () {
		const totalPages = Math.max(
			1,
			Math.ceil(
				getVisiblePortfolioRepos().length / portfolioState.pageSize,
			),
		);

		if (portfolioState.currentPage < totalPages - 1) {
			portfolioState.currentPage += 1;
			renderPortfolioRepos();
		}
	});
}

// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
	formInputs[i].addEventListener("input", function () {
		// check form validation
		if (form.checkValidity()) {
			formBtn.removeAttribute("disabled");
		} else {
			formBtn.setAttribute("disabled", "");
		}
	});
}

// blog feed variables
const blogPostsList = document.querySelector("[data-blog-posts-list]");
const blogLoading = document.querySelector("[data-blog-loading]");

const blogFeedUrl =
	"https://pikadv.blogspot.com/feeds/posts/default?alt=json-in-script&max-results=6&callback=handleBloggerFeed";
let blogFeedTimeoutId;

const stripHtml = function (html) {
	const tempElement = document.createElement("div");
	tempElement.innerHTML = html;
	return tempElement.textContent || tempElement.innerText || "";
};

const formatPostDate = function (dateString) {
	const date = new Date(dateString);
	if (Number.isNaN(date.getTime())) {
		return { datetime: "", display: "" };
	}

	return {
		datetime: date.toISOString().split("T")[0],
		display: date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		}),
	};
};

const getPostLink = function (links) {
	const alternateLink = links.find(function (link) {
		return link.rel === "alternate";
	});

	return alternateLink ? alternateLink.href : "#";
};

const getPostImage = function (entry) {
	const content = entry.content && entry.content.$t ? entry.content.$t : "";
	const imageMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);

	if (imageMatch) {
		return imageMatch[1];
	}

	if (entry["media$thumbnail"] && entry["media$thumbnail"].url) {
		return entry["media$thumbnail"].url;
	}

	return "./assets/images/blog-1.jpg";
};

const getPostSummary = function (entry) {
	const summarySource =
		(entry.summary && entry.summary.$t) ||
		(entry.content && entry.content.$t) ||
		"";
	const strippedText = stripHtml(summarySource).replace(/\s+/g, " ").trim();

	return strippedText.length > 140
		? `${strippedText.slice(0, 140).trim()}...`
		: strippedText;
};

const renderBlogPosts = function (entries) {
	if (!blogPostsList) {
		return;
	}

	blogPostsList.innerHTML = "";

	entries.forEach(function (entry) {
		const title =
			entry.title && entry.title.$t ? entry.title.$t : "Untitled post";
		const postLink = getPostLink(entry.link || []);
		const categories = entry.category || [];
		const postCategory =
			categories.length > 0 ? categories[0].term : "Blog";
		const postDate = formatPostDate(
			entry.published && entry.published.$t ? entry.published.$t : "",
		);
		const postImage = getPostImage(entry);
		const postSummary = getPostSummary(entry);

		const listItem = document.createElement("li");
		listItem.className = "blog-post-item";
		listItem.innerHTML = `
			<a href="${postLink}" target="_blank" rel="noopener noreferrer">
				<figure class="blog-banner-box">
					<img src="${postImage}" alt="${title}" loading="lazy" />
				</figure>

				<div class="blog-content">
					<div class="blog-meta">
						<p class="blog-category">${postCategory}</p>

						<span class="dot"></span>

						<time datetime="${postDate.datetime}">${postDate.display}</time>
					</div>

					<h3 class="h3 blog-item-title">${title}</h3>

					<p class="blog-text">${postSummary}</p>
				</div>
			</a>
		`;

		blogPostsList.appendChild(listItem);
	});

	if (blogLoading) {
		blogLoading.remove();
	}
};

window.handleBloggerFeed = function (feedData) {
	window.clearTimeout(blogFeedTimeoutId);

	const entries =
		feedData.feed && feedData.feed.entry ? feedData.feed.entry : [];

	if (entries.length === 0) {
		window.clearTimeout(blogFeedTimeoutId);
		if (blogLoading) {
			blogLoading.innerHTML =
				'<p class="blog-text">No blog posts were found.</p>';
		}
		return;
	}

	renderBlogPosts(entries);
};

const loadBlogPosts = function () {
	if (!blogPostsList) {
		return;
	}

	const script = document.createElement("script");
	script.src = blogFeedUrl;
	script.async = true;
	script.onerror = function () {
		window.clearTimeout(blogFeedTimeoutId);
		if (blogLoading) {
			blogLoading.innerHTML =
				'<p class="blog-text">Latest posts could not be loaded right now.</p>';
		}
	};

	blogFeedTimeoutId = window.setTimeout(function () {
		if (blogLoading) {
			blogLoading.innerHTML =
				'<p class="blog-text">Latest posts could not be loaded right now.</p>';
		}
	}, 10000);

	document.body.appendChild(script);
};

// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
	navigationLinks[i].addEventListener("click", function () {
		for (let i = 0; i < pages.length; i++) {
			if (this.innerText.trim().toLowerCase() === pages[i].dataset.page) {
				pages[i].classList.add("active");
				navigationLinks[i].classList.add("active");
				window.scrollTo(0, 0);
			} else {
				pages[i].classList.remove("active");
				navigationLinks[i].classList.remove("active");
			}
		}
	});
}

// Ensure elements are loaded before fetching data
document.addEventListener("DOMContentLoaded", function () {
	loadPortfolioRepos();
	loadBlogPosts();
});
