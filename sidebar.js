    // DOM Elements
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.content');
    const toggleBtn = document.querySelector('.toggle-btn');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const overlay = document.querySelector('.overlay');
    const menuItems = document.querySelectorAll('.menu-item');

    // Toggle sidebar on desktop
    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        content.classList.toggle('expanded');
    });

    // Toggle sidebar on mobile
    mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    });

    // Close sidebar when clicking overlay
    overlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    });

    // Menu item click handling
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            // Add active class to clicked item
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            // On mobile, close the sidebar after selecting an item
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
            }
        });
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            // Reset mobile-specific classes
            overlay.classList.remove('active');
            if (!sidebar.classList.contains('collapsed')) {
                sidebar.classList.remove('active');
            }
        }
    });