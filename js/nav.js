const header = document.querySelector(".site-header");
        const toggle = document.querySelector(".menu-toggle");
        toggle.addEventListener("click", () => {
          const isOpen = header.classList.toggle("nav-open");
          document.body.classList.toggle("menu-open", isOpen);
        });