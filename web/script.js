// VLSM Tree Visualization - Interactive JavaScript

document.addEventListener('DOMContentLoaded', () => {
    initializeAnimations();
    addInteractiveFeatures();
    addSearchFunctionality();
    addFilterFunctionality();
    createNetworkConnections();
});

// Initialize entrance animations
function initializeAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.network-card, .link-card, .lan-card').forEach(card => {
        observer.observe(card);
    });
}

// Add interactive features to cards
function addInteractiveFeatures() {
    // Network cards click to expand
    document.querySelectorAll('.network-card').forEach(card => {
        card.addEventListener('click', function () {
            this.classList.toggle('expanded');

            // Add ripple effect
            const ripple = document.createElement('div');
            ripple.className = 'ripple';
            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add tooltips on hover
    document.querySelectorAll('.network-card, .link-card, .lan-card').forEach(card => {
        card.addEventListener('mouseenter', function (e) {
            showTooltip(this, e);
        });

        card.addEventListener('mouseleave', function () {
            hideTooltip();
        });
    });

    // Add copy to clipboard functionality
    document.querySelectorAll('.value, .link-info, .lan-subnet').forEach(element => {
        element.addEventListener('click', function (e) {
            e.stopPropagation();
            copyToClipboard(this.textContent);
            showCopyNotification(this);
        });
    });
}

// Search functionality
function addSearchFunctionality() {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
        <input type="text" id="networkSearch" placeholder="Search networks, IPs, or subnets..." />
        <span class="search-icon">🔍</span>
    `;

    const header = document.querySelector('.header');
    header.appendChild(searchContainer);

    const searchInput = document.getElementById('networkSearch');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        filterNetworks(searchTerm);
    });
}

// Filter networks based on search
function filterNetworks(searchTerm) {
    const allCards = document.querySelectorAll('.network-card, .link-card, .lan-card');

    allCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            card.style.display = '';
            card.style.animation = 'fadeIn 0.3s ease-out';
        } else {
            card.style.display = 'none';
        }
    });
}

// Filter functionality by network type
function addFilterFunctionality() {
    const filterContainer = document.createElement('div');
    filterContainer.className = 'filter-container';
    filterContainer.innerHTML = `
        <button class="filter-btn active" data-filter="all">All Networks</button>
        <button class="filter-btn" data-filter="primary">Primary (A-N)</button>
        <button class="filter-btn" data-filter="links">P2P Links</button>
        <button class="filter-btn" data-filter="lans">LAN Segments</button>
    `;

    const header = document.querySelector('.header');
    header.appendChild(filterContainer);

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filter = this.dataset.filter;
            applyFilter(filter);
        });
    });
}

// Apply filter to show/hide sections
function applyFilter(filter) {
    const sections = {
        primary: document.querySelector('.networks-grid').parentElement,
        links: document.querySelector('.links-grid').parentElement,
        lans: document.querySelector('.lan-grid').parentElement
    };

    if (filter === 'all') {
        Object.values(sections).forEach(section => {
            section.style.display = '';
        });
    } else {
        Object.keys(sections).forEach(key => {
            sections[key].style.display = key === filter ? '' : 'none';
        });
    }
}

// Create visual connections between networks
function createNetworkConnections() {
    // Add connection lines between root and networks
    const rootNode = document.querySelector('.root-node');
    const networkCards = document.querySelectorAll('.network-card');

    // This would require SVG overlay for proper implementation
    // For now, we'll add visual indicators
    networkCards.forEach((card, index) => {
        card.style.setProperty('--connection-delay', `${index * 0.1}s`);
    });
}

// Tooltip functions
let tooltipElement = null;

function showTooltip(element, event) {
    const networkName = element.dataset.network || element.dataset.link || element.dataset.lan;
    if (!networkName) return;

    tooltipElement = document.createElement('div');
    tooltipElement.className = 'custom-tooltip';
    tooltipElement.textContent = `Click to view details`;
    document.body.appendChild(tooltipElement);

    updateTooltipPosition(event);
}

function updateTooltipPosition(event) {
    if (!tooltipElement) return;

    tooltipElement.style.left = event.pageX + 15 + 'px';
    tooltipElement.style.top = event.pageY + 15 + 'px';
}

function hideTooltip() {
    if (tooltipElement) {
        tooltipElement.remove();
        tooltipElement = null;
    }
}

// Copy to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        console.log('Copied to clipboard:', text);
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

function showCopyNotification(element) {
    const notification = document.createElement('div');
    notification.className = 'copy-notification';
    notification.textContent = 'Copied!';

    const rect = element.getBoundingClientRect();
    notification.style.left = rect.left + 'px';
    notification.style.top = rect.top - 30 + 'px';

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 1500);
}

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + F to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        const searchInput = document.getElementById('networkSearch');
        if (searchInput) searchInput.focus();
    }

    // Escape to clear search
    if (e.key === 'Escape') {
        const searchInput = document.getElementById('networkSearch');
        if (searchInput) {
            searchInput.value = '';
            filterNetworks('');
        }
    }
});

// Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Performance optimization: Lazy load animations
const lazyAnimationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            lazyAnimationObserver.unobserve(entry.target);
        }
    });
}, {
    rootMargin: '50px'
});

document.querySelectorAll('.network-card, .link-card, .lan-card').forEach(card => {
    lazyAnimationObserver.observe(card);
});

// Add dynamic stats counter animation
function animateCounters() {
    const counters = document.querySelectorAll('.stat-value');

    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/,/g, ''));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };

        updateCounter();
    });
}

// Initialize counter animation when stats come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsGrid = document.querySelector('.stats-grid');
if (statsGrid) {
    statsObserver.observe(statsGrid);
}

// Add particle effect on hover (optional enhancement)
function createParticles(element) {
    const particleCount = 5;
    const rect = element.getBoundingClientRect();

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = rect.left + Math.random() * rect.width + 'px';
        particle.style.top = rect.top + Math.random() * rect.height + 'px';
        document.body.appendChild(particle);

        setTimeout(() => particle.remove(), 1000);
    }
}

// Add network statistics calculation
function calculateNetworkStats() {
    const stats = {
        totalNetworks: document.querySelectorAll('.network-card').length,
        totalLinks: document.querySelectorAll('.link-card').length,
        totalLANs: document.querySelectorAll('.lan-card').length,
        totalHosts: 150978
    };

    console.log('Network Statistics:', stats);
    return stats;
}

// Initialize
calculateNetworkStats();

console.log('VLSM Tree Visualization loaded successfully!');

// ============================================
// CHART.JS INITIALIZATION - DYNAMIC STATISTICS
// ============================================

// Chart.js default configuration
Chart.defaults.color = '#cbd5e1';
Chart.defaults.borderColor = 'rgba(148, 163, 184, 0.1)';
Chart.defaults.font.family = "'Inter', sans-serif";

// Network data from documentation
const networkData = {
    primary: [
        { name: 'F', hosts: 83492, prefix: 15, usable: 131070 },
        { name: 'B', hosts: 14068, prefix: 18, usable: 16382 },
        { name: 'C', hosts: 11243, prefix: 18, usable: 16382 },
        { name: 'A', hosts: 10921, prefix: 18, usable: 16382 },
        { name: 'L', hosts: 8644, prefix: 18, usable: 16382 },
        { name: 'E', hosts: 7579, prefix: 19, usable: 8190 },
        { name: 'M', hosts: 6021, prefix: 19, usable: 8190 },
        { name: 'G', hosts: 3447, prefix: 20, usable: 4094 },
        { name: 'D', hosts: 2154, prefix: 20, usable: 4094 },
        { name: 'J', hosts: 874, prefix: 22, usable: 1022 },
        { name: 'H', hosts: 851, prefix: 22, usable: 1022 },
        { name: 'N', hosts: 849, prefix: 22, usable: 1022 },
        { name: 'I', hosts: 835, prefix: 22, usable: 1022 }
    ],
    links: 29,
    lans: 15
};

// Color schemes
const colors = {
    purple: 'rgba(167, 139, 250, 0.8)',
    blue: 'rgba(96, 165, 250, 0.8)',
    cyan: 'rgba(34, 211, 238, 0.8)',
    pink: 'rgba(244, 114, 182, 0.8)',
    green: 'rgba(52, 211, 153, 0.8)',
    orange: 'rgba(251, 146, 60, 0.8)',
    red: 'rgba(248, 113, 113, 0.8)',
    yellow: 'rgba(250, 204, 21, 0.8)'
};

// Initialize all charts when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait for Chart.js to load
    if (typeof Chart !== 'undefined') {
        initializeCharts();
    } else {
        setTimeout(initializeCharts, 500);
    }
});

function initializeCharts() {
    createNetworkDistributionChart();
    createAddressUtilizationChart();
    createSubnetSizeChart();
    createHostRequirementsChart();
    createEfficiencyChart();
    createGrowthTimelineChart();
}

// 1. Network Distribution Pie Chart
function createNetworkDistributionChart() {
    const ctx = document.getElementById('networkDistributionChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Primary Networks (A-N)', 'P2P Links', 'LAN Segments'],
            datasets: [{
                data: [13, 29, 15],
                backgroundColor: [colors.purple, colors.cyan, colors.green],
                borderColor: ['rgba(167, 139, 250, 1)', 'rgba(34, 211, 238, 1)', 'rgba(52, 211, 153, 1)'],
                borderWidth: 2,
                hoverOffset: 15
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: { size: 12 },
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const label = context.label || '';
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ${value} networks (${percentage}%)`;
                        }
                    }
                }
            },
            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 1500,
                easing: 'easeInOutQuart'
            }
        }
    });
}

// 2. Address Utilization Bar Chart
function createAddressUtilizationChart() {
    const ctx = document.getElementById('addressUtilizationChart');
    if (!ctx) return;

    const totalSupernet = 262144; // 2^18 addresses in /14
    const allocated = 199680;
    const used = 150978;
    const waste = allocated - used;
    const remaining = totalSupernet - allocated;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Address Space'],
            datasets: [
                {
                    label: 'Used (Hosts)',
                    data: [used],
                    backgroundColor: colors.green,
                    borderColor: 'rgba(52, 211, 153, 1)',
                    borderWidth: 2
                },
                {
                    label: 'Waste',
                    data: [waste],
                    backgroundColor: colors.orange,
                    borderColor: 'rgba(251, 146, 60, 1)',
                    borderWidth: 2
                },
                {
                    label: 'Remaining',
                    data: [remaining],
                    backgroundColor: colors.blue,
                    borderColor: 'rgba(96, 165, 250, 1)',
                    borderWidth: 2
                }
            ]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    stacked: true,
                    grid: { color: 'rgba(148, 163, 184, 0.1)' },
                    ticks: {
                        callback: function (value) {
                            return (value / 1000).toFixed(0) + 'K';
                        }
                    }
                },
                y: {
                    stacked: true,
                    grid: { display: false }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: { size: 12 },
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `${context.dataset.label}: ${context.parsed.x.toLocaleString()} addresses`;
                        }
                    }
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeInOutQuart'
            }
        }
    });
}

// 3. Subnet Size Distribution Chart
function createSubnetSizeChart() {
    const ctx = document.getElementById('subnetSizeChart');
    if (!ctx) return;

    const prefixCounts = {};
    networkData.primary.forEach(net => {
        prefixCounts[`/${net.prefix}`] = (prefixCounts[`/${net.prefix}`] || 0) + 1;
    });
    prefixCounts['/30'] = 29; // P2P links
    prefixCounts['/29'] = 15; // LANs

    new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: Object.keys(prefixCounts),
            datasets: [{
                data: Object.values(prefixCounts),
                backgroundColor: [
                    colors.red,
                    colors.orange,
                    colors.cyan,
                    colors.blue,
                    colors.green,
                    colors.purple
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: { size: 12 },
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `${context.label}: ${context.parsed} networks`;
                        }
                    }
                }
            },
            scales: {
                r: {
                    grid: { color: 'rgba(148, 163, 184, 0.1)' },
                    ticks: { backdropColor: 'transparent' }
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeInOutQuart'
            }
        }
    });
}

// 4. Host Requirements Horizontal Bar Chart
function createHostRequirementsChart() {
    const ctx = document.getElementById('hostRequirementsChart');
    if (!ctx) return;

    const sortedNetworks = [...networkData.primary].sort((a, b) => b.hosts - a.hosts);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sortedNetworks.map(n => `Network ${n.name}`),
            datasets: [{
                label: 'Required Hosts',
                data: sortedNetworks.map(n => n.hosts),
                backgroundColor: sortedNetworks.map((_, i) => {
                    const colorKeys = Object.keys(colors);
                    return colors[colorKeys[i % colorKeys.length]];
                }),
                borderWidth: 2,
                borderRadius: 6
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: { color: 'rgba(148, 163, 184, 0.1)' },
                    ticks: {
                        callback: function (value) {
                            return value >= 1000 ? (value / 1000).toFixed(0) + 'K' : value;
                        }
                    }
                },
                y: {
                    grid: { display: false }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `Required: ${context.parsed.x.toLocaleString()} hosts`;
                        }
                    }
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeInOutQuart'
            }
        }
    });
}

// 5. Efficiency Metrics Doughnut Chart
function createEfficiencyChart() {
    const ctx = document.getElementById('efficiencyChart');
    if (!ctx) return;

    const totalAllocated = 199680;
    const totalUsed = 150978;
    const efficiency = ((totalUsed / totalAllocated) * 100).toFixed(1);

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Utilized', 'Waste'],
            datasets: [{
                data: [totalUsed, totalAllocated - totalUsed],
                backgroundColor: [colors.green, colors.red],
                borderColor: ['rgba(52, 211, 153, 1)', 'rgba(248, 113, 113, 1)'],
                borderWidth: 2,
                circumference: 180,
                rotation: 270
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: { size: 12 },
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const value = context.parsed;
                            const percentage = ((value / totalAllocated) * 100).toFixed(1);
                            return `${context.label}: ${value.toLocaleString()} (${percentage}%)`;
                        }
                    }
                }
            },
            animation: {
                animateRotate: true,
                duration: 1500,
                easing: 'easeInOutQuart'
            }
        }
    });
}

// 6. Address Space Usage Line Chart (Cumulative)
function createGrowthTimelineChart() {
    const ctx = document.getElementById('growthTimelineChart');
    if (!ctx) return;

    const sortedNetworks = [...networkData.primary].sort((a, b) => b.usable - a.usable);
    let cumulative = 0;
    const cumulativeData = sortedNetworks.map(net => {
        cumulative += net.usable;
        return cumulative;
    });

    // Add P2P and LAN allocations
    cumulative += 116; // P2P links
    cumulativeData.push(cumulative);
    cumulative += 120; // LANs
    cumulativeData.push(cumulative);

    const labels = [...sortedNetworks.map(n => `Net ${n.name}`), 'P2P Links', 'LANs'];

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Cumulative Addresses',
                data: cumulativeData,
                borderColor: colors.purple,
                backgroundColor: 'rgba(167, 139, 250, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointHoverRadius: 8,
                pointBackgroundColor: colors.purple,
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(148, 163, 184, 0.1)' },
                    ticks: {
                        callback: function (value) {
                            return (value / 1000).toFixed(0) + 'K';
                        }
                    }
                },
                x: {
                    grid: { display: false }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `Total: ${context.parsed.y.toLocaleString()} addresses`;
                        }
                    }
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeInOutQuart'
            }
        }
    });
}

console.log('Charts initialized successfully!');

// ============================================
// IMAGE GALLERY FUNCTIONALITY
// ============================================

// Initialize image gallery features
document.addEventListener('DOMContentLoaded', () => {
    initializeImageGallery();
    setupImageModal();
    setupImageAnimations();
});

// Initialize image gallery interactions
function initializeImageGallery() {
    const imageCards = document.querySelectorAll('.image-card');
    
    imageCards.forEach((card, index) => {
        // Add click handler for modal
        card.addEventListener('click', function() {
            const img = this.querySelector('img');
            if (img) {
                openImageModal(img.src, img.alt);
            }
        });

        // Add keyboard navigation
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const img = this.querySelector('img');
                if (img) {
                    openImageModal(img.src, img.alt);
                }
            }
        });
    });
}

// Setup image modal
function setupImageModal() {
    // Create modal element
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="image-modal-content">
            <span class="image-modal-close">&times;</span>
            <img src="" alt="">
        </div>
    `;
    document.body.appendChild(modal);

    // Close modal handlers
    const closeBtn = modal.querySelector('.image-modal-close');
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeImageModal();
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeImageModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeImageModal();
        }
    });
}

// Open image modal
function openImageModal(src, alt) {
    const modal = document.querySelector('.image-modal');
    const img = modal.querySelector('img');
    img.src = src;
    img.alt = alt;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close image modal
function closeImageModal() {
    const modal = document.querySelector('.image-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Setup image animations with Intersection Observer
function setupImageAnimations() {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                imageObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });

    // Observe all image cards
    document.querySelectorAll('.image-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = `opacity 0.6s ease-out ${index * 0.1}s, transform 0.6s ease-out ${index * 0.1}s`;
        imageObserver.observe(card);
    });

    // Observe category sections for sliding animations
    const categoryObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
                categoryObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '100px'
    });

    document.querySelectorAll('.gallery-category').forEach((category, index) => {
        category.style.opacity = '0';
        if (index % 2 === 0) {
            category.style.transform = 'translateX(-100px)';
        } else {
            category.style.transform = 'translateX(100px)';
        }
        category.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        categoryObserver.observe(category);
    });
}

// Lazy loading enhancement for images
function setupLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.addEventListener('load', function() {
                this.style.opacity = '1';
            });
        });
    }
}

// Initialize lazy loading
setupLazyLoading();

console.log('Image gallery initialized successfully!');

// ============================================
// MERMAID VLSM TREE VISUALIZATION
// ============================================

// Initialize Mermaid with custom dark theme
document.addEventListener('DOMContentLoaded', () => {
    // Set up controls immediately so buttons work even if clicked before diagram loads
    setupMermaidControls();
    
    // Wait for Mermaid library to be available
    if (typeof mermaid !== 'undefined') {
        initializeMermaid();
        // Controls are already set up, but will work better after diagram renders
    } else {
        // Retry after a short delay if Mermaid isn't loaded yet
        setTimeout(() => {
            if (typeof mermaid !== 'undefined') {
                initializeMermaid();
            } else {
                console.error('Mermaid library failed to load');
                const diagramElement = document.getElementById('vlsm-tree-diagram');
                if (diagramElement) {
                    diagramElement.innerHTML = '<div style="text-align: center; color: var(--accent-red); padding: 40px;">Mermaid library failed to load. Please refresh the page.</div>';
                }
            }
        }, 1000);
    }
});

function initializeMermaid() {
    // Configure Mermaid with custom dark theme
    mermaid.initialize({
        startOnLoad: true,
        theme: 'dark',
        themeVariables: {
            // Dark theme colors matching the site design
            primaryColor: '#00695c',
            primaryTextColor: '#ffffff',
            primaryBorderColor: '#003d33',
            lineColor: '#a78bfa',
            secondaryColor: '#4a148c',
            tertiaryColor: '#1565c0',
            background: '#131829',
            mainBkg: '#131829',
            secondBkg: '#0a0e27',
            textColor: '#f8fafc',
            border1: '#94a3b8',
            border2: '#60a5fa',
            noteBkgColor: '#1a237e',
            noteTextColor: '#ffffff',
            noteBorderColor: '#000051',
            actorBorder: '#a78bfa',
            actorBkg: '#00695c',
            actorTextColor: '#ffffff',
            actorLineColor: '#003d33',
            signalColor: '#22d3ee',
            signalTextColor: '#000000',
            labelBoxBkgColor: '#4a148c',
            labelBoxBorderColor: '#12005e',
            labelTextColor: '#ffffff',
            loopTextColor: '#f8fafc',
            activationBorderColor: '#a78bfa',
            activationBkgColor: '#1565c0',
            sequenceNumberColor: '#000000',
            sectionBkgColor: '#2e7d32',
            altBkgColor: '#1565c0',
            clusterBkg: '#4a148c',
            clusterBorder: '#12005e',
            defaultLinkColor: '#60a5fa',
            titleColor: '#a78bfa',
            edgeLabelBackground: '#131829',
            compositeTitleBackground: '#0a0e27',
            compositeBackground: '#131829',
            cScale0: '#00695c',
            cScale1: '#1565c0',
            cScale2: '#2e7d32',
            cScale3: '#f57c00',
            cScale4: '#b71c1c',
            cScale5: '#4a148c',
            cScale6: '#a78bfa',
            cScale7: '#22d3ee',
            // Font settings
            fontFamily: "'Inter', sans-serif",
            fontSize: '14px',
            // Node styling
            nodeBorder: '2px',
            nodeTextColor: '#f8fafc',
            // Edge styling
            edgeLabelBackground: 'rgba(20, 25, 45, 0.8)',
            edgeLabelColor: '#cbd5e1'
        },
        flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
            curve: 'basis',
            padding: 20,
            nodeSpacing: 50,
            rankSpacing: 80,
            diagramPadding: 20
        },
        securityLevel: 'loose',
        logLevel: 'error'
    });

    // Render the diagram
    const diagramElement = document.getElementById('vlsm-tree-diagram');
    if (diagramElement) {
        // Render with a slight delay to ensure DOM is ready
        setTimeout(() => {
                mermaid.run({
                    querySelector: '#vlsm-tree-diagram',
                    suppressErrors: false
                }).then((results) => {
                    console.log('Mermaid diagram rendered successfully!', results);
                    // Add animation to the rendered diagram
                    const svg = diagramElement.querySelector('svg');
                    if (svg) {
                        svg.style.opacity = '0';
                        svg.style.transition = 'opacity 0.8s ease-out';
                        // Apply custom styling after render
                        applyMermaidStyles(svg);
                        setTimeout(() => {
                            svg.style.opacity = '1';
                            // Setup controls after SVG is rendered and visible
                            setupMermaidControls();
                        }, 100);
                    } else {
                        // Retry setup controls if SVG not found yet
                        setTimeout(() => {
                            setupMermaidControls();
                        }, 500);
                    }
                }).catch(err => {
                    console.error('Error rendering Mermaid diagram:', err);
                    diagramElement.innerHTML = `<div style="text-align: center; color: var(--accent-red); padding: 40px;">
                        <p>Error loading diagram: ${err.message || 'Unknown error'}</p>
                        <p style="font-size: 0.9rem; margin-top: 10px;">Please refresh the page or check the console for details.</p>
                    </div>`;
                });
        }, 1000);
    }
}

// Apply custom styles to Mermaid SVG after rendering
function applyMermaidStyles(svg) {
    if (!svg) return;
    
    // Apply styles to nodes based on their text content
    const nodes = svg.querySelectorAll('.node');
    nodes.forEach(node => {
        const text = node.textContent || '';
        const rect = node.querySelector('rect');
        
        if (text.includes('Network F') || text.includes('Network B') || text.includes('Network C') || 
            text.includes('Network A') || text.includes('Network L') || text.includes('Network E') || 
            text.includes('Network M') || text.includes('Network G') || text.includes('Network D') || 
            text.includes('Network J') || text.includes('Network H') || text.includes('Network N') || 
            text.includes('Network I')) {
            if (rect) {
                rect.setAttribute('fill', '#00695c');
                rect.setAttribute('stroke', '#003d33');
                rect.setAttribute('stroke-width', '3');
            }
        } else if (text.includes('Point-to-Point')) {
            if (rect) {
                rect.setAttribute('fill', '#1565c0');
                rect.setAttribute('stroke', '#0d47a1');
                rect.setAttribute('stroke-width', '3');
            }
        } else if (text.includes('LAN Segments')) {
            if (rect) {
                rect.setAttribute('fill', '#2e7d32');
                rect.setAttribute('stroke', '#1b5e20');
                rect.setAttribute('stroke-width', '3');
            }
        } else if (text.includes('Future Expansion')) {
            if (rect) {
                rect.setAttribute('fill', '#f57c00');
                rect.setAttribute('stroke', '#bf360c');
                rect.setAttribute('stroke-width', '2');
            }
        } else if (text.includes('Block:') || text.includes('Remaining:')) {
            if (rect) {
                rect.setAttribute('fill', '#4a148c');
                rect.setAttribute('stroke', '#12005e');
                rect.setAttribute('stroke-width', '2');
            }
        } else if (text.includes('Split:') || text.includes('First Split') || text.includes('Second Split')) {
            if (rect) {
                rect.setAttribute('fill', '#b71c1c');
                rect.setAttribute('stroke', '#7f0000');
                rect.setAttribute('stroke-width', '2');
            }
        } else if (text.includes('Supernet')) {
            if (rect) {
                rect.setAttribute('fill', '#1a237e');
                rect.setAttribute('stroke', '#000051');
                rect.setAttribute('stroke-width', '4');
            }
        }
    });
    
    // Style edges
    const edges = svg.querySelectorAll('.edgePath');
    edges.forEach(edge => {
        const path = edge.querySelector('path');
        if (path) {
            path.setAttribute('stroke', '#60a5fa');
            path.setAttribute('stroke-width', '2');
        }
    });
}

// Setup Mermaid diagram controls (zoom, pan, download)
function setupMermaidControls() {
    let currentZoom = 1;
    const diagramContainer = document.querySelector('.mermaid-container');
    
    // Helper function to get SVG (will be called each time to ensure we have the latest reference)
    const getSVG = () => {
        return document.querySelector('#vlsm-tree-diagram svg');
    };

    // Zoom In
    const zoomInBtn = document.getElementById('zoomIn');
    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const svg = getSVG();
            if (svg && diagramContainer) {
                currentZoom = Math.min(currentZoom + 0.2, 3);
                svg.style.transform = `scale(${currentZoom})`;
                svg.style.transformOrigin = 'top left';
                svg.style.transition = 'transform 0.3s ease';
                // Visual feedback
                zoomInBtn.style.transform = 'scale(0.95)';
                setTimeout(() => { zoomInBtn.style.transform = ''; }, 150);
                console.log('Zoomed in to:', currentZoom);
            } else {
                console.warn('SVG not found. Diagram may still be loading.');
                // Retry after a short delay
                setTimeout(() => {
                    const retrySvg = getSVG();
                    if (retrySvg && diagramContainer) {
                        currentZoom = Math.min(currentZoom + 0.2, 3);
                        retrySvg.style.transform = `scale(${currentZoom})`;
                        retrySvg.style.transformOrigin = 'top left';
                        retrySvg.style.transition = 'transform 0.3s ease';
                    }
                }, 500);
            }
        });
    }

    // Zoom Out
    const zoomOutBtn = document.getElementById('zoomOut');
    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const svg = getSVG();
            if (svg && diagramContainer) {
                currentZoom = Math.max(currentZoom - 0.2, 0.3);
                svg.style.transform = `scale(${currentZoom})`;
                svg.style.transformOrigin = 'top left';
                svg.style.transition = 'transform 0.3s ease';
                // Visual feedback
                zoomOutBtn.style.transform = 'scale(0.95)';
                setTimeout(() => { zoomOutBtn.style.transform = ''; }, 150);
                console.log('Zoomed out to:', currentZoom);
            } else {
                console.warn('SVG not found. Diagram may still be loading.');
                // Retry after a short delay
                setTimeout(() => {
                    const retrySvg = getSVG();
                    if (retrySvg && diagramContainer) {
                        currentZoom = Math.max(currentZoom - 0.2, 0.3);
                        retrySvg.style.transform = `scale(${currentZoom})`;
                        retrySvg.style.transformOrigin = 'top left';
                        retrySvg.style.transition = 'transform 0.3s ease';
                    }
                }, 500);
            }
        });
    }

    // Reset Zoom
    const resetZoomBtn = document.getElementById('resetZoom');
    if (resetZoomBtn) {
        resetZoomBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const svg = getSVG();
            if (svg && diagramContainer) {
                currentZoom = 1;
                svg.style.transform = 'scale(1)';
                svg.style.transformOrigin = 'center';
                svg.style.transition = 'transform 0.3s ease';
                diagramContainer.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: 'smooth'
                });
                // Visual feedback
                resetZoomBtn.style.transform = 'scale(0.95)';
                setTimeout(() => { resetZoomBtn.style.transform = ''; }, 150);
                console.log('Zoom reset to:', currentZoom);
            } else {
                console.warn('SVG not found. Diagram may still be loading.');
                // Retry after a short delay
                setTimeout(() => {
                    const retrySvg = getSVG();
                    if (retrySvg && diagramContainer) {
                        currentZoom = 1;
                        retrySvg.style.transform = 'scale(1)';
                        retrySvg.style.transformOrigin = 'center';
                        retrySvg.style.transition = 'transform 0.3s ease';
                        diagramContainer.scrollTo({
                            top: 0,
                            left: 0,
                            behavior: 'smooth'
                        });
                    }
                }, 500);
            }
        });
    }

    // Download Diagram
    const downloadBtn = document.getElementById('downloadDiagram');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const svg = getSVG();
            if (!svg) {
                // Visual feedback
                downloadBtn.style.transform = 'scale(0.95)';
                setTimeout(() => { downloadBtn.style.transform = ''; }, 150);
                // Retry after a short delay
                setTimeout(() => {
                    const retrySvg = getSVG();
                    if (retrySvg) {
                        downloadBtn.click(); // Retry the download
                    } else {
                        alert('Diagram is still loading. Please wait a moment and try again.');
                    }
                }, 500);
                console.warn('SVG not found for download. Retrying...');
                return;
            }
            
            // Visual feedback
            downloadBtn.style.transform = 'scale(0.95)';
            downloadBtn.textContent = 'Downloading...';
            setTimeout(() => { 
                downloadBtn.style.transform = '';
                downloadBtn.textContent = 'Download Diagram';
            }, 2000);
            
            try {
                // Clone the SVG to avoid modifying the original
                const clonedSvg = svg.cloneNode(true);
                
                // Get SVG dimensions
                const bbox = svg.getBBox();
                const width = bbox.width || svg.viewBox.baseVal.width || 1200;
                const height = bbox.height || svg.viewBox.baseVal.height || 800;
                
                // Set explicit dimensions on cloned SVG
                clonedSvg.setAttribute('width', width);
                clonedSvg.setAttribute('height', height);
                clonedSvg.setAttribute('viewBox', `0 0 ${width} ${height}`);
                
                // Serialize SVG
                const svgData = new XMLSerializer().serializeToString(clonedSvg);
                const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
                const svgUrl = URL.createObjectURL(svgBlob);
                
                // Create an image element
                const img = new Image();
                img.crossOrigin = 'anonymous';
                
                img.onload = () => {
                    try {
                        const canvas = document.createElement('canvas');
                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext('2d');
                        
                        // Fill background
                        ctx.fillStyle = '#131829';
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                        
                        // Draw SVG
                        ctx.drawImage(img, 0, 0);
                        
                        // Download as PNG
                        canvas.toBlob((blob) => {
                            if (blob) {
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = 'vlsm-tree-diagram.png';
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                                URL.revokeObjectURL(url);
                                console.log('Diagram downloaded successfully!');
                            } else {
                                alert('Error creating image. Please try again.');
                            }
                        }, 'image/png');
                        
                        URL.revokeObjectURL(svgUrl);
                    } catch (error) {
                        console.error('Error processing image:', error);
                        alert('Error processing image. Please try again.');
                        URL.revokeObjectURL(svgUrl);
                    }
                };
                
                img.onerror = () => {
                    console.error('Error loading SVG image');
                    alert('Error loading diagram. Please try again.');
                    URL.revokeObjectURL(svgUrl);
                };
                
                img.src = svgUrl;
            } catch (error) {
                console.error('Error downloading diagram:', error);
                alert('Error downloading diagram: ' + error.message);
            }
        });
    }

    // Add pan functionality with mouse drag
    let isDragging = false;
    let startX, startY, scrollLeft, scrollTop;

    if (diagramContainer) {
        diagramContainer.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.pageX - diagramContainer.offsetLeft;
            startY = e.pageY - diagramContainer.offsetTop;
            scrollLeft = diagramContainer.scrollLeft;
            scrollTop = diagramContainer.scrollTop;
            diagramContainer.style.cursor = 'grabbing';
        });

        diagramContainer.addEventListener('mouseleave', () => {
            isDragging = false;
            diagramContainer.style.cursor = 'default';
        });

        diagramContainer.addEventListener('mouseup', () => {
            isDragging = false;
            diagramContainer.style.cursor = 'default';
        });

        diagramContainer.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - diagramContainer.offsetLeft;
            const y = e.pageY - diagramContainer.offsetTop;
            const walkX = (x - startX) * 2;
            const walkY = (y - startY) * 2;
            diagramContainer.scrollLeft = scrollLeft - walkX;
            diagramContainer.scrollTop = scrollTop - walkY;
        });
    }

    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        if (e.ctrlKey || e.metaKey) {
            if (e.key === '=' || e.key === '+') {
                e.preventDefault();
                document.getElementById('zoomIn')?.click();
            } else if (e.key === '-') {
                e.preventDefault();
                document.getElementById('zoomOut')?.click();
            } else if (e.key === '0') {
                e.preventDefault();
                document.getElementById('resetZoom')?.click();
            }
        }
    });
}

console.log('Mermaid VLSM tree visualization initialized!');

