/* =====================================================================
   NicyFoods – SEO meta data (title, description, keywords, OG, canonical)
   Source: "Nicy Food - meta data" sheet.
   Usage:
     - Static pages : <script src="js/seo-meta.js" data-seo-page="home"></script>
     - Product page : product-detail.html calls SeoMeta.applyProduct(product.id)
     - Category view: product.html?category=herbal / kids-special (auto)
   ===================================================================== */
(function () {
  var SITE = "https://nicyfoods.com";

  var KEYWORDS =
    "healthy Handmade Ladoos in Pune, Handmade ladoos in Pune, Healthy food brand in Pune, " +
    "Homemade healthy food, healthy homemade dishes, pure ghee ladoos near me, " +
    "Handmade food products in Pune, Handmade sweets near me";

  function entry(title, description, primary) {
    return { title: title, description: description, primary: primary, keywords: KEYWORDS };
  }

  /* ---------- Static pages ---------- */
  var PAGES = {
    home: entry(
      "healthy Handmade Ladoos in Pune | Healthy Ladoos | NicyFoods",
      "Buy healthy handmade ladoos in Pune made with pure ghee and natural jaggery. Explore healthy, traditional, herbal and millet ladoos from NicyFoods.",
      "healthy Handmade Ladoos in Pune"
    ),
    about: entry(
      "Healthy food Brand in Pune | About NicyFoods",
      "Learn about NicyFoods, a healthy food brand in pune offering handmade ladoos made with pure ghee, natural jaggery and traditional recipes since 2017.",
      "Healthy food Brand in Pune"
    ),
    products: entry(
      "Handmade Food Products in Pune | NicyFoods",
      "Discover handmade food products in Pune from NicyFoods, crafted with quality ingredients, traditional recipes and natural goodness for everyday wellness.",
      "Handmade Food Products in Pune"
    )
  };

  /* ---------- Product pages (product-detail.html?id=<id>) ---------- */
  var PRODUCTS = {
    "peanut-laddu": entry(
      "Peanut Laddu in Pune | Healthy Handmade Ladoo | NicyFoods",
      "Buy handmade peanut laddu in Pune made with quality ingredients and traditional recipes. Enjoy a delicious, wholesome and naturally prepared sweet from NicyFoods.",
      "Peanut Laddu"
    ),
    "khajur-laddu": entry(
      "Khajur Laddu in Pune | Healthy Date Ladoo | NicyFoods",
      "Enjoy handmade Khajur Laddu in Pune, prepared with quality ingredients and traditional methods. Discover naturally delicious date-based ladoos from NicyFoods.",
      "Khajur Laddu"
    ),
    "ashwagandha-shatavari-laddu": entry(
      "Ashwagandha Laddu in Pune | NicyFoods",
      "Discover handmade Ashwagandha Laddu in Pune, crafted with quality ingredients and traditional recipes for a wholesome and delicious everyday treat.",
      "Ashwagandha Laddu"
    ),
    "moringa-laddu": entry(
      "Moringa Laddu in Pune | Healthy Handmade Ladoo | NicyFoods",
      "Discover handmade Moringa Laddu in Pune, prepared with quality ingredients and traditional recipes. Enjoy a wholesome and naturally crafted ladoo from NicyFoods.",
      "Moringa Laddu"
    ),
    "til-laddu": entry(
      "Sesame Laddu in Pune | Traditional Handmade Ladoo",
      "Buy handmade Sesame Laddu in Pune, prepared using traditional recipes and quality ingredients. Enjoy the authentic taste of a classic Indian sweet from NicyFoods.",
      "Sesame Laddu"
    ),
    "coconut-laddu": entry(
      "Coconut Laddu in Pune | Handmade Ladoo | NicyFoods",
      "Enjoy handmade Coconut Laddu in Pune, made using quality ingredients and traditional recipes. Discover delicious, naturally prepared coconut ladoos from NicyFoods.",
      "Coconut Laddu"
    ),
    "nachni-ragi-laddu": entry(
      "Ragi Laddu in Pune | Healthy Handmade Ladoo | NicyFoods",
      "Discover handmade Ragi Laddu in Pune, prepared with quality ingredients and traditional recipes. Enjoy a wholesome and delicious ladoo from NicyFoods.",
      "Ragi Laddu"
    ),
    "millet-laddu": entry(
      "Millet Laddu in Pune | Healthy Handmade Ladoo",
      "Explore handmade Millet Laddu in Pune, crafted with quality ingredients and traditional recipes. Enjoy a wholesome, delicious and naturally prepared ladoo from NicyFoods.",
      "Millet Laddu"
    )
  };

  /* ---------- Category views (product.html?category=<cat>) ---------- */
  var CATEGORIES = {
    "herbal": entry(
      "Herbal Ladoos in Pune | Handmade Healthy Ladoos | NicyFoods",
      "Discover handmade herbal ladoos in Pune, prepared with selected ingredients and traditional recipes. Explore wholesome and delicious ladoo varieties from NicyFoods.",
      "Herbal Ladoos"
    ),
    "kids-special": entry(
      "Baby Friendly Ladoos in Pune | NicyFoods",
      "Explore baby-friendly ladoos in Pune from NicyFoods, made with carefully selected ingredients and traditional recipes for a delicious and wholesome option.",
      "Baby Friendly Ladoos"
    )
  };

  /* ---------- helpers ---------- */
  function setMeta(attr, key, value) {
    var el = document.head.querySelector("meta[" + attr + '="' + key + '"]');
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute("content", value);
  }

  function setCanonical(url) {
    var el = document.head.querySelector('link[rel="canonical"]');
    if (!el) {
      el = document.createElement("link");
      el.setAttribute("rel", "canonical");
      document.head.appendChild(el);
    }
    el.setAttribute("href", url);
  }

  function apply(data, canonicalPath) {
    if (!data) return false;
    var url = SITE + "/" + (canonicalPath || "");
    document.title = data.title;
    setMeta("name", "description", data.description);
    setMeta("name", "keywords", data.keywords);
    setMeta("name", "primary-keyword", data.primary);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:site_name", "NicyFoods");
    setMeta("property", "og:title", data.title);
    setMeta("property", "og:description", data.description);
    setMeta("property", "og:url", url);
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", data.title);
    setMeta("name", "twitter:description", data.description);
    setCanonical(url);
    return true;
  }

  var SeoMeta = {
    pages: PAGES,
    products: PRODUCTS,
    categories: CATEGORIES,
    applyPage: function (key) {
      var path = { home: "", about: "about.html", products: "product.html" }[key];
      return apply(PAGES[key], path);
    },
    applyProduct: function (id) {
      return apply(PRODUCTS[id], "product-detail.html?id=" + encodeURIComponent(id));
    },
    applyCategory: function (cat) {
      return apply(CATEGORIES[cat], "product.html?category=" + encodeURIComponent(cat));
    }
  };
  window.SeoMeta = SeoMeta;

  /* Auto-run for static pages */
  var script = document.currentScript;
  var pageKey = script && script.getAttribute("data-seo-page");
  if (pageKey) {
    if (pageKey === "products") {
      var cat = new URLSearchParams(window.location.search).get("category");
      if (!(cat && SeoMeta.applyCategory(cat))) SeoMeta.applyPage("products");
    } else {
      SeoMeta.applyPage(pageKey);
    }
  }
})();
