// js/footer.js
// Injects the site-wide footer into <div id="footer-placeholder"></div>

document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("footer-placeholder");
  if (!el) return;

  el.innerHTML = `
    <footer class="relative bg-jaggery text-cream/80 overflow-hidden" style="font-family:'Poppins', sans-serif;">

      <!-- subtle rangoli watermark -->
      <svg class="pointer-events-none absolute -right-16 -top-16 w-64 h-64 opacity-[0.06]" viewBox="0 0 200 200" fill="none">
        <g stroke="#F2C14E" stroke-width="1.2">
          <circle cx="100" cy="100" r="90"/><circle cx="100" cy="100" r="65"/>
          <path d="M100 10 L100 190 M10 100 L190 100"/>
        </g>    
      </svg>

      <div class="relative max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        <!-- About -->
        <div>
          <img src="data:image/png;base64,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" alt="NicyFoods Logo" class="w-16 h-16 object-contain mb-3" width="64" height="64">
          <h3 class="text-marigold font-bold text-lg mb-4" style="font-family:'Rozha One', serif;">About NicyFoods</h3>
          <p class="text-sm leading-relaxed text-cream/60">
            NicyFoods is a trusted brand of handmade healthy food products established in 2017.
            We create premium ladoos with pure ghee, natural jaggery, and no harmful additives.
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-marigold font-bold text-lg mb-4" style="font-family:'Rozha One', serif;">Quick Links</h3>
          <ul class="space-y-2 text-sm">
            <li><a href="index.html" class="footer-link text-marigold hover:text-turmeric transition-colors">Home</a></li>
            <li><a href="about.html" class="footer-link text-cream/70 hover:text-marigold transition-colors">About Us</a></li>
            <li><a href="products.html" class="footer-link text-cream/70 hover:text-marigold transition-colors">Products</a></li>
            <li><a href="contact.html" class="footer-link text-cream/70 hover:text-marigold transition-colors">Contact</a></li>
          </ul>
        </div>

        <!-- Popular Products -->
        <div>
          <h3 class="text-marigold font-bold text-lg mb-4" style="font-family:'Rozha One', serif;">Popular Products</h3>
          <ul class="space-y-2 text-sm">
            <li><a href="product-detail.html?id=peanut-laddu" class="footer-link text-cream/70 hover:text-marigold transition-colors">Peanut Laddu</a></li>
            <li><a href="product-detail.html?id=khajur-laddu" class="footer-link text-cream/70 hover:text-marigold transition-colors">Khajur Laddu</a></li>
            <li><a href="product-detail.html?id=ashwagandha-laddu" class="footer-link text-cream/70 hover:text-marigold transition-colors">Ashwagandha Laddu</a></li>
            <li><a href="product-detail.html?id=moringa-laddu" class="footer-link text-cream/70 hover:text-marigold transition-colors">Moringa Laddu</a></li>
          </ul>
        </div>

        <!-- Get in Touch + Social -->
        <div>
          <h3 class="text-marigold font-bold text-lg mb-4" style="font-family:'Rozha One', serif;">Get in Touch</h3>
          <ul class="space-y-3 text-sm">
            <li class="footer-contact-item flex items-start gap-2">
              <svg class="footer-icon w-4 h-4 mt-0.5 flex-shrink-0 text-turmeric" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              <span><span class="text-cream font-semibold">Phone:</span> +91 8263001410</span>
            </li>
            <li class="footer-contact-item flex items-start gap-2">
              <svg class="footer-icon w-4 h-4 mt-0.5 flex-shrink-0 text-turmeric" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 6l-10 7L2 6"/>
                <path d="M2 6h20v12H2z"/>
              </svg>
              <span><span class="text-cream font-semibold">Email:</span> nicyfoods5@gmail.com</span>
            </li>
            <li class="footer-contact-item flex items-start gap-2">
              <svg class="footer-icon w-4 h-4 mt-0.5 flex-shrink-0 text-turmeric" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span><span class="text-cream font-semibold">Address:</span> Plot No 20, Saikrupa Society, Ingale Nagar, Warje Jakat Naka, Warje, Pune – 411052</span>
            </li>
          </ul>

          <!-- Social Icons -->
          <div class="mt-6 pt-5 border-t border-cream/10">
            <h4 class="text-cream/60 text-xs tracking-[0.2em] uppercase font-semibold mb-3">Follow Us</h4>
            <div class="flex items-center gap-4">
              <a href="https://www.instagram.com/nicyfoods" target="_blank" rel="noopener noreferrer"
                 class="footer-social-link group w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center transition-all duration-300 hover:bg-gradient-to-br hover:from-[#833AB4] hover:via-[#E1306C] hover:to-[#FCAF45] hover:scale-110 hover:shadow-lg hover:shadow-[#E1306C]/30">
                <svg class="w-5 h-5 text-cream/70 group-hover:text-white transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="3" y="3" width="18" height="18" rx="5"/>
                  <circle cx="12" cy="12" r="4.5"/>
                  <circle cx="17.2" cy="6.8" r="1.2" fill="#fff" stroke="none"/>
                </svg>
              </a>
              <a href="https://www.facebook.com/share/1DkK7iqTGC/" target="_blank" rel="noopener noreferrer"
                 class="footer-social-link group w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center transition-all duration-300 hover:bg-[#1877F2] hover:scale-110 hover:shadow-lg hover:shadow-[#1877F2]/30">
                <svg class="w-5 h-5 text-cream/70 group-hover:text-white transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.5 9H15V6.5h-1.7c-2 0-3.3 1.3-3.3 3.4V12H8v2.5h2v6.5h2.6v-6.5h2l.4-2.5h-2.4v-1.8c0-.7.3-1.2 1-1.2z"/>
                </svg>
              </a>
              <a href="https://wa.me/918263001410" target="_blank" rel="noopener noreferrer"
                 class="footer-social-link group w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center transition-all duration-300 hover:bg-[#25D366] hover:scale-110 hover:shadow-lg hover:shadow-[#25D366]/30">
                <svg class="w-5 h-5 text-cream/70 group-hover:text-white transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.5 14.4c-.3-.1-1.7-.8-1.9-.9-.3-.1-.4-.1-.6.1s-.7.9-.9 1-.3.2-.6.1c-.3-.1-1.2-.5-2.3-1.5-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.3-.4.1-.2 0-.4 0-.5C10.3 9 9.8 7.7 9.6 7.2c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.3-.1-.1-.3-.2-.6-.3z"/>
                  <path d="M12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.6 1.5 5.2L2 22l4.9-1.3c1.5.8 3.2 1.3 5.1 1.3 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18.3c-1.7 0-3.4-.5-4.8-1.3l-.3-.2-3.5.9.9-3.4-.2-.4C3.4 14.5 3 13.3 3 12c0-5 4-9 9-9s9 4 9 9-4 9-9 9z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

      </div>

      <!-- Bottom bar -->
      <div class="relative border-t border-cream/10">
        <div class="max-w-7xl mx-auto px-6 py-6 text-center text-sm text-cream/50 flex items-center justify-center gap-1.5 flex-wrap">
          <span>© 2017-2024 NicyFoods. All Rights Reserved. | Handcrafted with</span>
          <svg class="footer-heart w-4 h-4 text-kumkum" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <path d="M12 21s-6.7-4.35-9.33-8.2C1 10.4 1.4 6.9 4.1 5.1c2.2-1.5 5-.9 6.6 1 .4.5.9 1.1 1.3 1.7.4-.6.9-1.2 1.3-1.7 1.6-1.9 4.4-2.5 6.6-1 2.7 1.8 3.1 5.3 1.43 7.7C18.7 16.65 12 21 12 21z"/>
          </svg>
          <span>| Premium Healthy Ladoos</span>
        </div>
      </div>

      <style>
        #footer-placeholder .footer-link{ position:relative; display:inline-block; }
        #footer-placeholder .footer-link::after{
          content:''; position:absolute; left:0; bottom:-2px; width:0; height:1px;
          background:currentColor; transition:width .3s ease;
        }
        #footer-placeholder .footer-link:hover::after{ width:100%; }

        #footer-placeholder .footer-contact-item{ transition: transform .3s ease; }
        #footer-placeholder .footer-contact-item:hover{ transform: translateX(3px); }
        #footer-placeholder .footer-icon{ transition: transform .4s cubic-bezier(.34,1.56,.64,1); }
        #footer-placeholder .footer-contact-item:hover .footer-icon{ transform: scale(1.15) rotate(-6deg); }

        #footer-placeholder .footer-social-link{ transition: all .3s cubic-bezier(.34,1.56,.64,1); }
        #footer-placeholder .footer-social-link:hover{ transform: scale(1.12) translateY(-2px); }

        #footer-placeholder .footer-heart{ animation: footerHeartBeat 1.8s ease-in-out infinite; transform-origin:center; }
        @keyframes footerHeartBeat{
          0%, 100% { transform: scale(1); }
          15%      { transform: scale(1.18); }
          30%      { transform: scale(1); }
          45%      { transform: scale(1.1); }
          60%      { transform: scale(1); }
        }

        @media (prefers-reduced-motion: reduce){
          #footer-placeholder *{ animation:none !important; transition:none !important; }
        }
      </style>
    </footer>
  `;
});